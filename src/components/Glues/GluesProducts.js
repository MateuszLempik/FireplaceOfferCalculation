import React, { Component } from 'react';
import axios from 'axios';
import { Collapse, Button, FormGroup, Card, CardBody } from 'reactstrap';

import AddProduct from '../../components/CalculateMain/AddProduct';
import EditProduct from '../../components/CalculateMain/EditProduct';
import CustomColInput from '../../components/CommonComponents/CustomColInput';
import { mainTranslation } from '../../mainTranslations';
import './GluesProducts.css';

class GluesProducts extends Component {

    state = {
        allProducts: null,
        addGluesInput: '',
        updateGluesInputId: null,
        changedGluesInput: null
    }

    componentWillMount(){
      this.setState({
        allProducts: this.props.products,
        offerProducts: this.props.offerProducts && this.props.offerProducts.products
      });
    }

    componentDidMount(){
      this.loadOfferProducts();
    }

    loadOfferProducts() {
      const products = this.state.offerProducts;
      products && products.forEach((el) => {
        this.setState({[`updateGluesInput${el.id}`]: true});
      })
    }
    
    loadData() {
        axios.get("/products/Glues").then(response =>{
          this.setState({allProducts: response.data});
        })
    }
    
    postDataHandler = () => {
        const data = {
            name: this.state.addGluesInput,
            type: "Glues"
        };
        let gluesInput = this.state.addGluesInput;
        if(gluesInput !== ''){
          axios.post('/products', data)
          .then(() => {
              this.loadData();
              this.setState({
                addGluesInput: '',
                isOpen: false,
                addMode: false,
                editMode: false});
          });
        }
      }

      deleteDataHandler = () => {
        let productId = this.state.updateGluesInputId;
        let checkedProduct = this.state[`updateGluesInput${productId}`];
  
        if(productId && checkedProduct === true){
          axios.delete('/products/' + productId)
          .then(() => {
              this.loadData();
              this.loadOfferProducts();
              this.setState({updateGluesInputId: '',
                isOpen: false,
                addMode: false,
                editMode: false});
          });
        }
      }
  
      updateDataHandler = () => {
        let productId = this.state.updateGluesInputId;
        let checkedProduct = this.state[`updateGluesInput${productId}`];
        let gluesInput = this.state.changedGluesInput;
       
        const data = {
          _id: productId,
          name: gluesInput,
          type: "Glues"
        };
        if(productId && checkedProduct === true && gluesInput !== ''){
            axios.put('/products/' + productId, data)
            .then(() => {
                this.loadData();
                this.loadOfferProducts();
                this.setState({updateGluesInputId: '',
                isOpen: false,
                addMode: false,
                editMode: false});
          });
        }
      }

      onEdit = () =>{
        this.setState((prevState) => {return {editMode: !prevState.editMode}});
        Object.keys(this.state).forEach((key) => {
          if (key.startsWith('updateGluesInput')) {
            this.setState({[key]: false});
          }else if(key.startsWith('changedGluesInput')){
            this.setState({[key]: ''});
          }
        })
  
        this.setState((prevState) => {return {isOpen: !prevState.isOpen}});

        if(this.state.editMode === true){
          this.loadOfferProducts();
        }
      }
  
      onAdd = () => {
        this.setState((prevState) => {return {isOpen: !prevState.isOpen}});
        this.setState((prevState) => {return {addMode: !prevState.addMode}});
      }

    render(){
      let products;
      if(this.state.allProducts){
         products = this.state.allProducts.map(el => {
          return (
              <CustomColInput 
                key={el._id} 
                id={el._id} 
                label={el.name}
                name={el.name}
                title={el.type}
                value={this.state[`updateGluesInput${el._id}`] || ''}
                sm={3}
                type="checkbox"
                onChange={(event) => this.setState({
                  [`updateGluesInput${el._id}`]: event.target.checked,
                  updateGluesInputId: event.target.id,
                  changedGluesInput: event.target.name
                }
              )} />
          )
      });
      }
        return (
            <>
              <FormGroup row>
                  {products}
              </FormGroup>
              <Button disabled={this.state.editMode === true ? true : false} onClick={this.onAdd} color="primary" className="GluesProductsAddButton">
                  {mainTranslation.addNew}
              </Button>
              <Button color="primary" onClick={this.onEdit} className="GluesProductsEditButton">
                  {mainTranslation.editMode}
                </Button>
                <Collapse isOpen={this.state.isOpen}>
                  <Card className="GluesProducts">
                    <CardBody>
                        <AddProduct
                          class= {this.state.editMode === true ? "EditModeVisibility" : ''}
                          nameLabel= {mainTranslation.addProduct}
                          type="text"
                          name="text"
                          placeholder={mainTranslation.nameProductPlaceHolder}
                          onClick={this.postDataHandler}
                          onChange={(event) => this.setState({addGluesInput: event.target.value})} 
                          buttonText={mainTranslation.add}
                          valueAdd={this.state.addGluesInput}/>
                        <EditProduct
                          class= {this.state.addMode === true ? "EditModeVisibility" : ''}
                          nameLabel={mainTranslation.editProduct}
                          type="text"
                          name="text"
                          placeholder={mainTranslation.nameProductPlaceHolder}
                          onClick={this.updateDataHandler}
                          onChange={(event) => this.setState({changedGluesInput: event.target.value})}
                          buttonText={mainTranslation.change}
                          deleteText={mainTranslation.delete}
                          deleteOnClick={this.deleteDataHandler}
                          valueEdit={this.state[`updateGluesInput${this.state.updateGluesInputId}`] ? this.state.changedGluesInput : ''}/>
                    </CardBody>
                  </Card>
                </Collapse>
            </>
        )
    }
}

export default GluesProducts;