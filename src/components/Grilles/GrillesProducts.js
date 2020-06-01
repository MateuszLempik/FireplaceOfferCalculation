import React, { Component } from 'react';
import axios from 'axios';
import { Collapse, Button, Card, CardBody } from 'reactstrap';

import AddProduct from '../../components/CalculateMain/AddProduct';
import EditProduct from '../../components/CalculateMain/EditProduct';
import GrillesProduct from '../../components/Grilles/GrillesProduct';
import { mainTranslation } from '../../mainTranslations';
import './GrillesProducts.css';

class GrillesProducts extends Component {

    state = {
        allProducts: null,
        grillesProductName: '',
        updateGrillesProductNameId: null,
        changedGrillesProductName: null
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
        this.setState({[`updateGrillesProductName${el.id}`]: true});
        this.setState({[`description${el.id}`]: el.description});
        this.setState({[`size${el.id}`]: el.size});
      })
    }
    
    loadData() {
        axios.get("/products/Grilles").then(response =>{
          this.setState({allProducts: response.data});
        })
    }
    
    postDataHandler = () => {
        const data = {
            name: this.state.grillesProductName,
            type: "Grilles"
        };
        if(this.state.grillesProductName !== ''){
          axios.post('/products', data)
          .then(() => {
              this.loadData();
              this.setState({
                grillesProductName: '',
                isOpen: false,
                addMode: false,
                editMode: false})
          });
        }
      }

      deleteDataHandler = () => {
        let productId = this.state.updateGrillesProductNameId;
        let checkedProduct = this.state[`updateGrillesProductName${productId}`];
  
        if(productId && checkedProduct === true){
          axios.delete('/products/' + productId)
          .then(() => {
              this.loadData();
              this.loadOfferProducts();
              this.setState({
                isOpen: false,
                addMode: false,
                editMode: false});
          });
        }
      }
  
      updateDataHandler = () => {
        let productId = this.state.updateGrillesProductNameId;
        let checkedProduct = this.state[`updateGrillesProductName${productId}`];
       
        const data = {
          _id: productId,
          name: this.state.changedGrillesProductName,
          type: "Grilles"
        };

        if(productId && checkedProduct === true && this.state.changedGrillesProductName !== ''){
            axios.put('/products/' + productId, data)
            .then(() => {
                this.loadData();
                this.loadOfferProducts();
                this.setState({
                  isOpen: false,
                  addMode: false,
                  editMode: false});
          });
        }
      }

      onEdit = (id, name) =>{
        this.setState((prevState) => {return {editMode: !prevState.editMode}});
        Object.keys(this.state).forEach((key) => {
          if (key.startsWith('updateGrillesProductName')) {
            this.setState({[key]: false});
          }
        })
  
        this.setState((prevState) => {return {isOpen: !prevState.isOpen}});
        this.setState({[`updateGrillesProductName${id}`]: true,
          updateGrillesProductNameId: id,
          changedGrillesProductName: name,
        })
        if(this.state.isOpen === true){
          this.setState({[`updateGrillesProductName${id}`]: false})
        }

        if(this.state.editMode === true){
          this.loadOfferProducts();
        }
      }
  
      onAdd = () => {
        this.setState((prevState) => {return {isOpen: !prevState.isOpen}});
        this.setState((prevState) => {return {addMode: !prevState.addMode}});
      }

    render(){
      let products
      if(this.state.allProducts){
         products = this.state.allProducts.map(el => {
          return (
            <GrillesProduct 
                key={el._id} 
                id={el._id} 
                label={el.name}
                name={el.name}
                buttonText={mainTranslation.editMode}
                disabled={this.state.addMode === true ? true : false}
                checked={this.state[`updateGrillesProductName${el._id}`] || ''}
                onClickEdit={() => this.onEdit(el._id, el.name, el.description, el.size)}  
                title={el.type} 
                text={el.colour} 
                option={el.thickness}
                class="GrillesProductsEditButton"
                value={this.state[`description${el._id}`] || ''}
                sizeValue={this.state[`size${el._id}`] || ''}
                onChangeDescr={(event => this.setState({[`description${event.target.id}`]: event.target.value}))}
                onChangeSize={(event => this.setState({[`size${event.target.id}`]: event.target.value}))}
                onChange={(event) => this.setState({[`updateGrillesProductName${event.target.id}`]: event.target.checked,
                  updateGrillesProductNameId: el._id,
                  changedGrillesProductName: el.name})}
                placeholder={mainTranslation.typeOrDescription}
                type="textarea"
                sizePlaceholder = {mainTranslation.size}
                sizeName="sizeInput"
                descrName="descrInput"/>
            );
      });
      }
        return (
            <>
            {products}
            <Button disabled={this.state.editMode === true ? true : false} onClick={this.onAdd} color="primary" className="ChimneyConnectionProductsAddButton">
                  {mainTranslation.addNew}
                </Button>
                <Collapse isOpen={this.state.isOpen}>
                  <Card className="GrillesProducts">
                    <CardBody>
                          <AddProduct
                            class= {this.state.editMode === true ? "EditModeVisibility" : ''}
                            nameLabel={mainTranslation.addProduct} 
                            type="text"
                            name="text"
                            placeholder={mainTranslation.nameProductPlaceHolder}
                            onClick={this.postDataHandler}
                            onChange={(event) => this.setState({grillesProductName: event.target.value})} 
                            buttonText={mainTranslation.add}
                            valueAdd={this.state.grillesProductName}>
                          </AddProduct>                                                        
                          <EditProduct
                            class= {this.state.addMode === true ? "EditModeVisibility" : ''}
                            nameLabel={mainTranslation.editProduct}
                            type="text"
                            name="text"
                            placeholder={mainTranslation.nameProductPlaceHolder}
                            onClick={this.updateDataHandler}
                            onChange={(event) => this.setState({changedGrillesProductName: event.target.value})}
                            buttonText={mainTranslation.change}
                            deleteText={mainTranslation.delete}
                            deleteOnClick={this.deleteDataHandler}
                            valueEdit={this.state[`updateGrillesProductName${this.state.updateGrillesProductNameId}`] ? this.state.changedGrillesProductName : ''}>
                          </EditProduct>
                    </CardBody>
                  </Card>
                </Collapse>
            </>
        )
    }
}

export default GrillesProducts;