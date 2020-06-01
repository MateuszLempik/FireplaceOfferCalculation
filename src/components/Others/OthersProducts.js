import React, { Component } from 'react';
import axios from 'axios';
import { Collapse, Button, FormGroup, Card, CardBody } from 'reactstrap';

import AddProduct from '../../components/CalculateMain/AddProduct';
import EditProduct from '../../components/CalculateMain/EditProduct';
import CustomColInput from '../../components/CommonComponents/CustomColInput';
import { mainTranslation } from '../../mainTranslations';
import './OthersProducts.css'

class OthersProducts extends Component {

    state = {
        allProducts: null,
        addOthersProductsInput: '',
        updateOthersProductsInputId: null,
        changedOthersProductsInput: null
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
        this.setState({[`updateOthersProductsInput${el.id}`]: true});
      })
    }
    
    loadData() {
        axios.get("/products/Others").then(response =>{
          this.setState({allProducts: response.data});
        })
    }
    
    postDataHandler = () => {
        const data = {
            name: this.state.addOthersProductsInput,
            type: "Others"
        };
        let othersProductsInput = this.state.addOthersProductsInput;
        if(othersProductsInput !== ''){
          axios.post('/products', data)
          .then(() => {
              this.loadData();
              this.setState({
                addOthersProductsInput: '',
                isOpen: false,
                  addMode: false,
                  editMode: false});
          });
        }
      }

      deleteDataHandler = () => {
        let productId = this.state.updateOthersProductsInputId
        let checkedProduct = this.state[`updateOthersProductsInput${productId}`];
  
        if(productId && checkedProduct === true){
          axios.delete('/products/' + productId)
          .then(() => {
              this.loadData();
              this.loadOfferProducts();
              this.setState({updateOthersProductsInput: null,
                changedOthersProductsInput: '',
                isOpen: false,
                addMode: false,
                editMode: false});
          });
        }
      }
  
      updateDataHandler = () => {
        let productId = this.state.updateOthersProductsInputId
        let checkedProduct = this.state[`updateOthersProductsInput${productId}`];
        let othersProductsInput = this.state.changedOthersProductsInput;
       
        const data = {
          _id: productId,
          name: othersProductsInput,
          type: "Others"
        };
        if(productId && checkedProduct === true && othersProductsInput !== ''){
            axios.put('/products/' + productId, data)
            .then(() => {
                this.loadData();
                this.loadOfferProducts();
                this.setState({
                  changedOthersProductsInput: '',
                  isOpen: false,
                  addMode: false,
                  editMode: false});
            });
        }
      }

      onEdit = () =>{
        this.setState((prevState) => {return {editMode: !prevState.editMode}});
        Object.keys(this.state).forEach((key) => {
          if (key.startsWith('updateOthersProductsInput')) {
            this.setState({[key]: false});
          }else if(key.startsWith('changedOthersProductsInput')){
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
                title={el.type}
                value={this.state[`updateOthersProductsInput${el._id}`] || ''} 
                name={el.name}
                sm={3}
                type="checkbox"
                onChange={(event) => this.setState({
                  [`updateOthersProductsInput${el._id}`]: event.target.checked,
                  updateOthersProductsInputId: event.target.id,
                  changedOthersProductsInput: event.target.name
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
              <Button disabled={this.state.editMode === true ? true : false} onClick={this.onAdd} color="primary" className="OthersProductsAddButton">
                  {mainTranslation.addNew}
              </Button>
              <Button color="primary" onClick={this.onEdit} className="OthersProductsEditButton">
                  {mainTranslation.editMode}
                </Button>
                <Collapse isOpen={this.state.isOpen}>
                  <Card className="OthersProducts">
                    <CardBody>
                        <AddProduct
                          class= {this.state.editMode === true ? "EditModeVisibility" : ''}
                          nameLabel={mainTranslation.addProduct}
                          type="text"
                          name="text"
                          placeholder={mainTranslation.nameProductPlaceHolder}
                          onClick={this.postDataHandler}
                          onChange={(event) => this.setState({addOthersProductsInput: event.target.value})} 
                          buttonText={mainTranslation.add}
                          valueAdd={this.state.addOthersProductsInput}/>
                        <EditProduct
                          class= {this.state.addMode === true ? "EditModeVisibility" : ''}
                          nameLabel={mainTranslation.editProduct}
                          type="text"
                          name="text"
                          placeholder={mainTranslation.nameProductPlaceHolder}
                          onClick={this.updateDataHandler}
                          onChange={(event) => this.setState({changedOthersProductsInput: event.target.value})}
                          buttonText={mainTranslation.change}
                          deleteText={mainTranslation.delete}
                          deleteOnClick={this.deleteDataHandler}
                          valueEdit={this.state[`updateOthersProductsInput${this.state.updateOthersProductsInputId}`] ? this.state.changedOthersProductsInput : ''} />
                    </CardBody>
                  </Card>
                </Collapse>
            </>
        )
    }
}

export default OthersProducts;