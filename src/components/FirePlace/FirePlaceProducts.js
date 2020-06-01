import React, { Component } from 'react';
import axios from 'axios';
import { Collapse, Button, Card, CardBody, Col, Input } from 'reactstrap';

import AddProduct from '../../components/CalculateMain/AddProduct';
import EditProduct from '../../components/CalculateMain/EditProduct';
import FirePlaceProduct from '../../components/FirePlace/FirePlaceProduct';
import { mainTranslation } from '../../mainTranslations';
import './FirePlaceProducts.css';

class FirePlaceProducts extends Component {

    state = {
        allProducts: null,
        firePlaceProductName: '',
        firePlaceProductDescr: '',
        updateFirePlaceProductNameId: null,
        changedFirePlaceProductName: null,
        changedFirePlaceProductDescr: null
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
        this.setState({[`updateFirePlaceProductName${el.id}`]: true});
      })
    }
    
    loadData() {
        axios.get("/products/FirePlace").then(response =>{
          this.setState({allProducts: response.data});
        })
    }
    
    postDataHandler = () => {
        const data = {
            name: this.state.firePlaceProductName,
            description: this.state.firePlaceProductDescr,
            type: "FirePlace"
        };
        
        if(this.state.firePlaceProductName !== ''){
          axios.post('/products', data)
          .then(() => {
              this.loadData();
              //this.props.readDescription({id: result.data._id, description: result.data.description});
              this.setState({
                firePlaceProductName: '',
                firePlaceProductDescr: '',
                isOpen: false,
                addMode: false,
                editMode: false
              })
          });
        }
      }

      deleteDataHandler = () => {
        let productId = this.state.updateFirePlaceProductNameId;
        let checkedProduct = this.state[`updateFirePlaceProductName${productId}`];
  
        if(productId && checkedProduct === true){
          axios.delete('/products/' + productId)
          .then(() => {
              this.loadData();
              this.loadOfferProducts();
              this.setState({updateFirePlaceProductName: null,
              isOpen: false,
              addMode: false,
              editMode: false});
          });
        }
      }
  
      updateDataHandler = () => {
        let productId = this.state.updateFirePlaceProductNameId;
        let checkedProduct = this.state[`updateFirePlaceProductName${productId}`];
       
        const data = {
          _id: productId,
          name: this.state.changedFirePlaceProductName,
          description: this.state.changedFirePlaceProductDescr,
          type: "FirePlace"
        };

        if(productId && checkedProduct === true && this.state.changedFirePlaceProductName !== '' && this.state.changedFirePlaceProductDescr !== ''){
            axios.put('/products/' + productId, data)
            .then(() => {
                this.loadData();
                this.loadOfferProducts();
                this.setState({
                  changedFirePlaceProductName: '',
                  changedFirePlaceProductDescr: '',
                  isOpen: false,
                  addMode: false,
                  editMode: false
                })
            });
        }
      }

      onEdit = (id, name, descr) =>{
        this.setState((prevState) => {return {editMode: !prevState.editMode}});
        Object.keys(this.state).forEach((key) => {
          if (key.startsWith('updateFirePlaceProductName')) {
            this.setState({[key]: false});
          }
        })
  
        this.setState((prevState) => {return {isOpen: !prevState.isOpen}});
        this.setState({[`updateFirePlaceProductName${id}`]: true,
          updateFirePlaceProductNameId: id,
          changedFirePlaceProductName: name,
          changedFirePlaceProductDescr: descr
        })
        if(this.state.isOpen === true){
          this.setState({[`updateFirePlaceProductName${id}`]: false})
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
            <FirePlaceProduct 
                key={el._id} 
                id={el._id} 
                label={el.name}
                onClickEdit={() => this.onEdit(el._id, el.name, el.description)} 
                checked={this.state[`updateFirePlaceProductName${el._id}`] || ''} 
                name={el.name}
                disabled={this.state.addMode === true ? true : false}
                title={el.type}
                descr={el.description} 
                onChange={(event) => this.setState({[`updateFirePlaceProductName${event.target.id}`]: event.target.checked,
                updateFirePlaceProductNameId: el._id,
                changedFirePlaceProductName: el.name,
                changedFirePlaceProductDescr: el.description
                })}
                buttonText={mainTranslation.editMode}
                placeholder={mainTranslation.description}
                type="text"
                descrName="descrInput"/>
            );
      });
      }
        return (
            <>
            {products}
            <Button disabled={this.state.editMode === true ? true : false} onClick={this.onAdd} color="primary" className="FirePlaceProductsAddButton">
                  {mainTranslation.addNew}
                </Button>
                <Collapse isOpen={this.state.isOpen}>
                  <Card className="FirePlaceProducts">
                    <CardBody>
                          <AddProduct
                            class= {this.state.editMode === true ? "EditModeVisibility" : ''}
                            nameLabel={mainTranslation.addProduct}
                            type="text"
                            name="text"
                            placeholder={mainTranslation.nameProductPlaceHolder}
                            onClick={this.postDataHandler}
                            onChange={(event) => this.setState({firePlaceProductName: event.target.value})} 
                            buttonText={mainTranslation.add}
                            valueAdd={this.state.firePlaceProductName}>
                            <Col sm={6}>
                                <Input 
                                    onChange={(event) => this.setState({firePlaceProductDescr: event.target.value})}
                                    type="textarea"
                                    name="text"
                                    id="firePlaceElementAdd" 
                                    placeholder={mainTranslation.description}
                                    value={this.state.firePlaceProductDescr} />
                            </Col>
                          </AddProduct>                                                        
                          <EditProduct
                            class= {this.state.addMode === true ? "EditModeVisibility" : ''}
                            nameLabel={mainTranslation.editProduct}
                            type="text"
                            name="text"
                            placeholder={mainTranslation.nameProductPlaceHolder}
                            onClick={this.updateDataHandler}
                            onChange={(event) => this.setState({changedFirePlaceProductName: event.target.value})}
                            buttonText={mainTranslation.change}
                            deleteText= {mainTranslation.delete}
                            deleteOnClick={this.deleteDataHandler}
                            valueEdit={this.state[`updateFirePlaceProductName${this.state.updateFirePlaceProductNameId}`] ? this.state.changedFirePlaceProductName : ''}>
                            <Col sm={6}>
                                <Input 
                                    onChange={(event) => this.setState({changedFirePlaceProductDescr: event.target.value})}
                                    type="textarea"
                                    name="text"
                                    id="firePlaceElementEdit" 
                                    value={this.state[`updateFirePlaceProductName${this.state.updateFirePlaceProductNameId}`] ? this.state.changedFirePlaceProductDescr  : ''} 
                                    placeholder={mainTranslation.description} />
                            </Col>
                          </EditProduct>
                    </CardBody>
                  </Card>
                </Collapse>
            </>
        )
    }
}

export default FirePlaceProducts;