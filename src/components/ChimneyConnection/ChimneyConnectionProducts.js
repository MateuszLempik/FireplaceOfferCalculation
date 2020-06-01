import React, { Component } from 'react';
import axios from 'axios';
import { Collapse, Button, FormGroup, Card, CardBody } from 'reactstrap';

import AddProduct from '../../components/CalculateMain/AddProduct';
import EditProduct from '../../components/CalculateMain/EditProduct';
import CustomColInput from '../../components/CommonComponents/CustomColInput';
import { mainTranslation } from '../../../src/mainTranslations';
import './ChimneyConenctionProducts.css';

class ChimneyConenctionProducts extends Component {

    state = {
        allProducts: null,
        addChimneyConenctionInput: '',
        updateChimneyConenctionInputId: null,
        changedChimneyConenctionInput: null,
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
        this.setState({[`updateChimneyConenctionInput${el.id}`]: true});
      })
    }
    
    loadData() {
        axios.get("/products/ChimneyConnection").then(response =>{
          this.setState({allProducts: response.data});
        })
    }
    
    postDataHandler = () => {
        const data = {
            name: this.state.addChimneyConenctionInput,
            type: "ChimneyConnection"
        };
        let chimneyConnectionInput = this.state.addChimneyConenctionInput;
        if(chimneyConnectionInput !== ''){
          axios.post('/products', data)
          .then(() => {
              this.loadData();
              this.setState({
                addChimneyConenctionInput: ''});
              this.setState({isOpen: false,
                addMode: false,
                editMode: false});
          });
        }
      }

      deleteDataHandler = () => {
        let productId = this.state.updateChimneyConenctionInputId;
        let checkedProduct = this.state[`updateChimneyConenctionInput${productId}`];
  
        if(productId && checkedProduct === true){
          axios.delete('/products/' + productId)
          .then(() => {
              this.loadData();
              this.loadOfferProducts();
              this.setState({updateChimneyConenctionInputId: ''});
              this.setState({isOpen: false,
                addMode: false,
                editMode: false});
          });
        }
      }
  
      updateDataHandler = () => {
        let productId = this.state.updateChimneyConenctionInputId;
        let checkedProduct = this.state[`updateChimneyConenctionInput${productId}`];
        let chimneyConnectionInput = this.state.changedChimneyConenctionInput;
       
        const data = {
          _id: productId,
          name: chimneyConnectionInput,
          type: "ChimneyConnection"
        };
        if(productId && checkedProduct === true && chimneyConnectionInput !== ''){
            axios.put('/products/' + productId, data)
            .then(() => {
                this.loadData();
                this.loadOfferProducts();
                this.setState({changedChimneyConenctionInput: ''});
                this.setState({isOpen: false,
                  addMode: false,
                  editMode: false});
            });
        }
      }

      onEdit = () =>{
        this.setState((prevState) => {return {editMode: !prevState.editMode}});
        Object.keys(this.state).forEach((key) => {
          if (key.startsWith('updateChimneyConenctionInput')) {
            this.setState({[key]: false});
          }else if(key.startsWith('changedChimneyConenctionInput')){
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
                value={this.state[`updateChimneyConenctionInput${el._id}`] || ''}
                sm={3}
                type="checkbox"
                onChange={(event) => this.setState({
                  [`updateChimneyConenctionInput${el._id}`]: event.target.checked,
                  updateChimneyConenctionInputId: event.target.id,
                  changedChimneyConenctionInput: event.target.name
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
              <Button className="ChimneyConnectionProductsEditButton" disabled={this.state.editMode === true ? true : false} onClick={this.onAdd} color="primary">
                  {mainTranslation.addNew}
              </Button>
              <Button color="primary" onClick={this.onEdit} disabled={this.state.addMode === true ? true : false}  id="togglerCC" className="ChimneyConnectionProductsAddButton">
                  {mainTranslation.editMode}
                </Button>
                <Collapse isOpen={this.state.isOpen}>
                  <Card className="ChimneyConnectionProducts">
                    <CardBody>
                        <AddProduct
                          class= {this.state.editMode === true ? "EditModeVisibility" : ''}
                          nameLabel= {mainTranslation.addProduct}
                          type="text"
                          name="text"
                          placeholder={mainTranslation.nameProductPlaceHolder}
                          onClick={this.postDataHandler}
                          onChange={(event) => this.setState({addChimneyConenctionInput: event.target.value})} 
                          buttonText={mainTranslation.add}
                          valueAdd={this.state.addChimneyConenctionInput}/>
                        <EditProduct
                          class= {this.state.addMode === true ? "EditModeVisibility" : ''}
                          nameLabel={mainTranslation.editProduct}
                          type="text"
                          name="text"
                          placeholder={mainTranslation.nameProductPlaceHolder}
                          onClick={this.updateDataHandler}
                          onChange={(event) => this.setState({changedChimneyConenctionInput: event.target.value})}
                          buttonText={mainTranslation.change}
                          deleteText={mainTranslation.delete}
                          deleteOnClick={this.deleteDataHandler}
                          valueEdit={this.state[`updateChimneyConenctionInput${this.state.updateChimneyConenctionInputId}`] ? this.state.changedChimneyConenctionInput : ''} />
                    </CardBody>
                  </Card>
                </Collapse>
            </>
        )
    }
}

export default ChimneyConenctionProducts;