import React, { Component } from 'react';
import axios from 'axios';
import { Collapse, Button, Card, CardBody, Input, Col } from 'reactstrap';

import AddProduct from '../../components/CalculateMain/AddProduct';
import EditProduct from '../../components/CalculateMain/EditProduct';
import StoneElement from '../../components/StoneElements/StoneElement';
import { mainTranslation } from '../../mainTranslations';
import './StoneElements.css';

class StoneElements extends Component {

    state = {
        allProducts: null,
        stoneElementName: '',
        stoneElementColour: '',
        updateStoneElementNameId: null,
        changedStoneElementName: null,
        changedStoneElementColour: null
    }

    componentWillMount(){
      this.setState({
        allProducts: this.props.products,
        offerProducts: this.props.offerProducts && this.props.offerProducts.products
      });
    }

    componentDidMount(){
      this.loadOfferProducts();
      this.setState({thickness: ["2 cm", "3 cm"]});
    }

    loadOfferProducts() {
      const products = this.state.offerProducts;
      products && products.forEach((el) => {
        this.setState({[`updateStoneElementName${el.id}`]: true});
        this.setState({[`thickness${el.id}`]: el.value});
      })
    }
    
    loadData() {
        axios.get("/products/StoneElements").then(response =>{
          this.setState({allProducts: response.data});
        })
    }
    
    postDataHandler = () => {
      debugger;
        const data = {
            name: this.state.stoneElementName,
            colour: this.state.stoneElementColour,
            thickness: this.state.thickness,
            type: "StoneElements"
        };
        if(this.state.stoneElementName !== '' && this.state.stoneElementColour !== ''){
          axios.post('/products', data)
          .then(() => {
              this.loadData();
              this.setState({
                stoneElementName: '',
                stoneElementColour: ''
              });
              this.setState({isOpen: false,
                addMode: false,
                editMode: false});
          });
        }
      }

      deleteDataHandler = () => {
        let productId = this.state.updateStoneElementNameId;
        let checkedProduct = this.state[`updateStoneElementName${productId}`];
  
        if(productId && checkedProduct === true){
          axios.delete('/products/' + productId)
          .then(() => {
              this.loadData();
              this.loadOfferProducts();
              this.setState({
                changedStoneElementName: '',
                changedStoneElementColour: '',
              });
              this.setState({isOpen: false,
                addMode: false,
                editMode: false});
          });
        }
      }
  
      updateDataHandler = () => {
        let productId = this.state.updateStoneElementNameId;
        let checkedProduct = this.state[`updateStoneElementName${productId}`];
       
        const data = {
          _id: productId,
          name: this.state.changedStoneElementName,
          colour: this.state.changedStoneElementColour,
          thickness: this.state.thickness,
          type: "StoneElements"
        };

        if(productId && checkedProduct === true && this.state.changedStoneElementName !== '' && this.state.changedStoneElementColour !== ''){
            axios.put('/products/' + productId, data)
            .then(() => {
                this.loadData();
                this.loadOfferProducts();
                this.setState({
                  changedStoneElementName: '',
                  changedStoneElementColour: '',
                });
                this.setState({isOpen: false,
                  addMode: false,
                  editMode: false});
            });
        }
      }
    
    onEdit = (id, name, colour) =>{
      this.setState((prevState) => {return {editMode: !prevState.editMode}});
      Object.keys(this.state).forEach((key) => {
        if (key.startsWith('updateStoneElementName')) {
          this.setState({[key]: false});
        }
      })

      this.setState((prevState) => {return {isOpen: !prevState.isOpen}});
      this.setState({[`updateStoneElementName${id}`]: true,
        updateStoneElementNameId: id,
        changedStoneElementName: name,
        changedStoneElementColour: colour
      })
      if(this.state.isOpen === true){
        this.setState({[`updateStoneElementName${id}`]: false})
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
         products = this.state.allProducts.map((el, i)=> {
          return (
            <StoneElement 
                key={el._id} 
                id={el._id}
                selId={el._id}
                label={el.name}
                class="StoneElementsEditButton"
                buttonText={mainTranslation.editMode}
                onClickEdit={() => this.onEdit(el._id, el.name, el.colour)} 
                checked={this.state[`updateStoneElementName${el._id}`] || ''} 
                name={el.name + " " + el.colour}
                disabled={this.state.addMode === true ? true : false}
                text={el.colour}
                title={el.type} 
                option={el.thickness}
                valueSel={this.state[`thickness${el._id}`] || ''} 
                onChangeSel={(event) => this.setState({[`thickness${event.target.id}`]: event.target.value})}
                onChange={(event) => this.setState({[`updateStoneElementName${event.target.id}`]: event.target.checked,
                updateStoneElementNameId: el._id,
                changedStoneElementName: el.name,
                changedStoneElementColour: el.colour
                })}/>
            );
      });
      }
        return (
            <>
            {products}
              <Button disabled={this.state.editMode === true ? true : false} onClick={this.onAdd} color="primary" className="StoneElementsAddButton">
                  {mainTranslation.addNew}
                </Button>
                <Collapse isOpen={this.state.isOpen}>
                  <Card className="StoneElements">
                    <CardBody>
                          <AddProduct
                            class= {this.state.editMode === true ? "EditModeVisibility" : ''}
                            nameLabel={mainTranslation.addProduct}
                            type="text"
                            name="text"
                            placeholder={mainTranslation.nameProductPlaceHolder}
                            onClick={this.postDataHandler}
                            onChange={(event) => this.setState({stoneElementName: event.target.value})} 
                            buttonText={mainTranslation.add}
                            valueAdd={this.state.stoneElementName}>
                            <Col sm={3}>
                                <Input 
                                    onChange={(event) => this.setState({stoneElementColour: event.target.value})}
                                    type="text"
                                    name="text"
                                    id="stoneElementAdd" 
                                    placeholder={mainTranslation.colour}
                                    value={this.state.stoneElementColour} />
                            </Col>
                          </AddProduct>                                                 
                          <EditProduct
                            class= {this.state.addMode === true ? "EditModeVisibility" : ''}
                            nameLabel={mainTranslation.editProduct}
                            type="text"
                            name="text"
                            placeholder={mainTranslation.nameProductPlaceHolder}
                            onClick={this.updateDataHandler}
                            onChange={(event) => this.setState({changedStoneElementName: event.target.value})}
                            onChangeCheck={this.onEdit}
                            buttonText={mainTranslation.change}
                            deleteText={mainTranslation.delete}
                            deleteOnClick={this.deleteDataHandler}
                            valueEdit={this.state[`updateStoneElementName${this.state.updateStoneElementNameId}`] ? this.state.changedStoneElementName : ''}>
                            <Col sm={3}>
                                <Input 
                                    onChange={(event) => this.setState({changedStoneElementColour: event.target.value})}
                                    type="text"
                                    name="text"
                                    id="stoneElementEdit"
                                    value={this.state[`updateStoneElementName${this.state.updateStoneElementNameId}`] ? this.state.changedStoneElementColour  : ''} 
                                    placeholder={mainTranslation.colour} />
                            </Col>
                          </EditProduct>
                    </CardBody>
                  </Card>
                </Collapse>
            </>
        )
    }
}

export default StoneElements;