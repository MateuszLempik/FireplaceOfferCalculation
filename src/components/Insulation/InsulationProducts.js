import React, { Component } from 'react';
import axios from 'axios';
import { Collapse, Button, FormGroup, Card, CardBody } from 'reactstrap';

import AddProduct from '../../components/CalculateMain/AddProduct';
import EditProduct from '../../components/CalculateMain/EditProduct';
import CustomColInput from '../../components/CommonComponents/CustomColInput';
import { mainTranslation } from '../../../src/mainTranslations';
import './InsulationProducts.css';

class InsulationProducts extends Component {

    state = {
        allProducts: null,
        addInsulationInput: '',
        updateInsulationInputId: null,
        changedInsulationInput: null
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
        this.setState({[`updateInsulationInput${el.id}`]: true});
      })
    }
    
    loadData() {
        axios.get("/products/Insulation").then(response =>{
          this.setState({allProducts: response.data});
        })
    }
    
    postDataHandler = () => {
        const data = {
            name: this.state.addInsulationInput,
            type: "Insulation"
        };
        let insulationInput = this.state.addInsulationInput;
        if(insulationInput !== ''){
          axios.post('/products', data)
          .then(() => {
              this.loadData();
              this.setState({
                addInsulationInput: '',
                isOpen: false,
                addMode: false,
                editMode: false});
          });
        }
      }

      deleteDataHandler = () => {
        let productId = this.state.updateInsulationInputId;
        let checkedProduct = this.state[`updateInsulationInput${productId}`];
  
        if(productId && checkedProduct === true){
          axios.delete('/products/' + productId)
          .then(() => {
              this.loadData();
              this.loadOfferProducts();
              this.setState({updateInsulationInput: null,
                isOpen: false,
                addMode: false,
                editMode: false});
          });
        }
      }
  
      updateDataHandler = () => {
        let productId = this.state.updateInsulationInputId;
        let checkedProduct = this.state[`updateInsulationInput${productId}`];
        let insulationInput = this.state.changedInsulationInput;
       
        const data = {
          _id: productId,
          name: insulationInput,
          type: "Insulation"
        };
        if(productId && checkedProduct === true && insulationInput !== ''){
            axios.put('/products/' + productId, data)
            .then(() => {
                this.loadData();
                this.loadOfferProducts();
                this.setState({
                  changedInsulationInput: '',
                  isOpen: false,
                  addMode: false,
                  editMode: false});
            });
        }
      }

      onEdit = () =>{
        this.setState((prevState) => {return {editMode: !prevState.editMode}});
        Object.keys(this.state).forEach((key) => {
          if (key.startsWith('updateInsulationInput')) {
            this.setState({[key]: false});
          }else if(key.startsWith('changedInsulationInput')){
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
                value={this.state[`updateInsulationInput${el._id}`] || ''}
                sm={3}
                type="checkbox"
                onChange={(event) => this.setState({
                  [`updateInsulationInput${el._id}`]: event.target.checked,
                  updateInsulationInputId: event.target.id,
                  changedInsulationInput: event.target.name
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
              <Button disabled={this.state.editMode === true ? true : false} onClick={this.onAdd} color="primary" className="InsulationProductsAddButton">
                  {mainTranslation.addNew}
              </Button>
              <Button color="primary" onClick={this.onEdit} className="InsulationProductsEditButton">
                  {mainTranslation.editMode}
                </Button>
                <Collapse isOpen={this.state.isOpen}>
                  <Card className="InsulationProducts">
                    <CardBody>
                        <AddProduct
                          class= {this.state.editMode === true ? "EditModeVisibility" : ''}
                          nameLabel={mainTranslation.addProduct} 
                          type="text"
                          name="text"
                          placeholder={mainTranslation.nameProductPlaceHolder}
                          onClick={this.postDataHandler}
                          onChange={(event) => this.setState({addInsulationInput: event.target.value})} 
                          buttonText={mainTranslation.add}
                          valueAdd={this.state.addInsulationInput}/>
                        <EditProduct
                          class= {this.state.addMode === true ? "EditModeVisibility" : ''}
                          nameLabel={mainTranslation.editProduct}
                          type="text"
                          name="text"
                          placeholder={mainTranslation.nameProductPlaceHolder}
                          onClick={this.updateDataHandler}
                          onChange={(event) => this.setState({changedInsulationInput: event.target.value})}
                          buttonText={mainTranslation.change}
                          deleteText={mainTranslation.delete}
                          deleteOnClick={this.deleteDataHandler}
                          valueEdit={this.state[`updateInsulationInput${this.state.updateInsulationInputId}`] ? this.state.changedInsulationInput : ''} />
                    </CardBody>
                  </Card>
                </Collapse>
            </>
        )
    }
}

export default InsulationProducts;