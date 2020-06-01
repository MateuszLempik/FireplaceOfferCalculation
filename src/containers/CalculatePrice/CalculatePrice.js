import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {Row, Button, Label, Col, Input, ListGroupItemText, ListGroup, ListGroupItem, ListGroupItemHeading, FormGroup} from 'reactstrap';
import axios from 'axios';

import OfferSingleElement from '../../components/CalculatePrice/OfferSingleElement';
import OfferPrice from '../../components/CalculatePrice/OfferPrice';
import Sum from '../../components/CalculatePrice/Sum';
import OfferQty from '../../components/CalculatePrice/OfferQty';
import './CalculatePrice.css';
import { commonTranslation, priceTranslation, mainTranslation } from '../../mainTranslations';
import ColFormGroupInput from '../../components/CommonComponents/ColFormGroupInput';

let newArr = null;
let variable = null;

class CalculatePrice extends Component {

  state = {
    chosenProducts: null,
    arrayvar: {},
    stoneElementsArr: {},
    firePlaceArr: {},
    insulationArr: {},
    grillesArr: {},
    result: 0,
    firePlaceSumPrice: 0,
    stoneElementsSumPrice: 0,
    insulationSumPrice: 0,
    grillesSumPrice: 0
  }

    componentDidMount () {
        this.loadData();
    }

    loadData() {
      const offerId = this.props.location.state;
      if(!this.state.chosenProducts && offerId !== null){
        axios.get("/offers/" + offerId).then(response =>{
          this.setState({chosenProducts: response.data});
          this.setState({offerId: response.data._id});
          this.loadPrices();
        })
      }
    }

    loadPrices() {
      const {chimneyConnection, others, glues, stoneElements, grilles, insulation, firePlace, work} = this.state.chosenProducts;

      this.setState({chimneyConnectionPrice: (chimneyConnection && chimneyConnection.price) || 0});
      this.setState({othersPrice: (others && others.price) || 0});
      this.setState({gluesPrice: (glues && glues.price) || 0});
      this.setState({work});
      
      stoneElements && stoneElements.products && stoneElements.products.forEach(item => {if(item.price)return this.filterPrices(item, "stoneElements")});
      insulation && insulation.products && insulation.products.forEach(item => {if(item.price)this.filterPrices(item, "insulation")});
      grilles && grilles.products && grilles.products.forEach(item => {if(item.price)this.filterPrices(item, "grilles")});
      firePlace && firePlace.products && firePlace.products.forEach(item => {
        if(item.price){
          this.initialPriceState(item)
          this.countSumPrice("firePlace", item.id, item.sum);
      }});
      
    }
    filterPrices(item, productType) {
      this.initialPriceState(item);
      this.countResult(item.id, item.sum, true);
      this.countSumPrice(productType, item.id, item.sum);
    }

    countResult(id, sum, bool) {
      newArr = {...this.state.arrayvar};
      newArr[id] = sum;
      this.setState({arrayvar: newArr});
      this.setState({[id + "final"]: sum});
      if(bool === true){
         this.setState({result: Object.values(newArr).reduce((a,b) => a+b, 0)});
      }
    }

    countSumPrice(productType, id, sum) {
      variable = [productType + "temp"]
      variable  = {...this.state[productType + "Arr"]};
      variable[id] = sum;
      this.setState({[productType + "Arr"]: variable});
      this.setState({[productType + "SumPrice"]: Object.values(variable).reduce((a,b) => a+b, 0)});
    }

    initialPriceState(item){
      this.setState({[item.id + "count"]: item.count || null});
      this.setState({[item.id + "price"]: item.price || null});
      this.setState({[item.id + "final"]: item.sum || null});
    }

    switchToSummary = () => {
      this.setState({redirect: true});
    }

    backToPrevios = () => {
      this.props.history.push('/calculateMain', this.state.offerId);
    }

    updateDataHandler = () =>{

      const helpFunc = (el) => {
        el.price = this.state[el.id + "price"]
        el.count = this.state[el.id + "count"]
        el.sum = this.state[el.id + "final"]
        return el;
      }

      const copyState =  {
        ...this.state.chosenProducts
      }

      const chimneyConnection = {
        products: copyState.chimneyConnection && copyState.chimneyConnection.products,
        price: this.state.chimneyConnectionPrice
      }

      const stoneElements = {
        products: copyState && copyState.stoneElements && copyState.stoneElements.products && copyState.stoneElements.products.map((el) => helpFunc(el)),
        price: this.state.stoneElementsSumPrice
      }

      const insulation = {
        products: copyState && copyState.insulation && copyState.insulation.products && copyState.insulation.products.map((el) => helpFunc(el)),
        price: this.state.insulationSumPrice
      }

      const grilles = {
        products: copyState && copyState.grilles && copyState.grilles.products && copyState.grilles.products.map((el) => helpFunc(el)),
        price: this.state.grillesSumPrice
      }

      const glues = {
        products: copyState.glues && copyState.glues.products,
        price: this.state.gluesPrice
      }

      const others = {
        products: copyState.others && copyState.others.products,
        price: this.state.othersPrice
      }

      const firePlace = {
        products: copyState && copyState.firePlace && copyState.firePlace.products && copyState.firePlace.products.map((el) => helpFunc(el)),
        price: this.state.firePlaceSumPrice
      }

      const description = this.state.description

      let finalPrice = this.state.result + this.state.othersPrice + this.state.gluesPrice + this.state.chimneyConnectionPrice;
      const finalFinal = this.countNettoBruttoPrice(finalPrice);

      const withWork = finalFinal + this.state.work;
      
      const work = this.state.work;
      const materialsPrice = this.state.result;

      const data = {
         finalPrice: withWork, materialsPrice, work, description, chimneyConnection, stoneElements, insulation, grilles, glues, others, firePlace 
      }

      if(this.props.location.state !== null){
        axios.put("/offers/" + this.props.location.state, data)
        .then((result) =>{
          this.setState({offerId: result.data._id});
          this.switchToSummary();
        });
      }
    }

    commaHelper = (i, el) => {
      if(i !== 0) return ", " + el; 
        return el;   
    }

    onWheel = (event) => {
      let id = event.target.id;
      const input = document.getElementById(id);
      input.addEventListener("mousewheel",function(e) { e.preventDefault() })
    }

    countPrice = (id, value, type, productType, bool) => {
      //debugger;
      let state = this.state;
      state[id + type] =  value;
      this.setState(state);

      if(!state[id + type]){
        this.setState({[id + "final"]: 0});
      }

      let finalPrice;
      
      if(this.state[id + "count"] >= 0 && this.state[id + "price"] >= 0){
        let count = this.state[id + "count"];
        let price = this.state[id + "price"];
        finalPrice = count * price;
      }else {
        this.setState({[id + "final"]: 0});
        //this.setState({[id + "count"]: undefined});
        this.setState({[productType + "SumPrice"]: 0});
        finalPrice = 0;
      }

      this.countResult(id, finalPrice, bool);
      this.countSumPrice(productType, id, finalPrice);
    }

    elementMapHelper = (id, value, type, i, description, size, bool) =>{
      return (
        <div key={id}>
        <br />
        <ListGroupItemText><strong>{priceTranslation.product} </strong>{value}</ListGroupItemText>
        <ListGroupItemText className={!description && 'visibility'}><strong>{priceTranslation.description} </strong>{description}</ListGroupItemText>
        <ListGroupItemText className={!size && 'visibility'}><strong>{priceTranslation.dimension} </strong>{size}</ListGroupItemText>
        <Sum id={[type + i]} priceValue={this.state[id + "price"] || ""} onChange={(event) => {
            this.countPrice(id, event.target.valueAsNumber, "price", type, bool);
          }}value={this.state[id + "final"] || ""} onFocus={this.onWheel} defaultValue={0} >

          <OfferQty id={[type + "qty" + i]} value={this.state[id + "count"] || undefined} onFocus={this.onWheel} onChange={(event) => {
            this.countPrice(id, event.target.valueAsNumber, "count", type, bool);
          }}/>
        </Sum>
      </div> 
      )
    }

    multipleElementHelper = (products, type) =>{
      const style= {
        fontWeight: '600'
      }
      return (
      <>
        <ListGroupItemText><span style={style}>{priceTranslation.products} </span>{products}</ListGroupItemText>
        <OfferPrice id={"priceId" + type} value={this.state[type + "Price"] || ""} onFocus={this.onWheel} onChange={(event) => {
            if(event.target.valueAsNumber && event.target.valueAsNumber >= 0){
              this.setState({[type + "Price"]: event.target.valueAsNumber});
             }
             else{
              this.setState({[type + "Price"]: null});
            }         
        }}>
        </OfferPrice>
      </>
      )
    }

    countNettoBruttoPrice = (finalPrice) => {
      let finalPrice1 = finalPrice / 123;
      let finalPrice2 = finalPrice1 * 23;
      let finalNetto = finalPrice - finalPrice2;
      let finalNetto2 = finalNetto * 0.08;
      let finalFinal = finalNetto + finalNetto2;

      return finalFinal;
    }
    
    render () {
      
      if (this.state.redirect && this.state.offerId) {
        return <Redirect to={{pathname: "/calculateSummary", state: this.state.offerId}} />
      }
      
      const renderProducts = (header, elementHelper) => {

        if(this.state.chosenProducts){
          return (
            <div key={header}>
              <div className={elementHelper === false ? 'visibility': undefined}>
                <OfferSingleElement key={header} header={header} priceVisible={true} >{elementHelper}</OfferSingleElement>
              </div>
            </div>
          )
        }
      }

      let dataProducts;
      let value;

      if(this.state.chosenProducts){

        const {chimneyConnection, stoneElements, insulation, grilles, glues, others, firePlace} = this.state.chosenProducts;

        dataProducts = [
          {header: commonTranslation.chimneyConnection, elementHelper: chimneyConnection && chimneyConnection.products ? this.multipleElementHelper(chimneyConnection.products.map((el, i) => {
            return this.commaHelper(i, el.name);   
          }), "chimneyConnection") : false},
          {header: commonTranslation.stoneElements, elementHelper: stoneElements && stoneElements.products ? stoneElements.products.map((el, i) => {value = el.name + "  " + el.value;
            return this.elementMapHelper(el.id, value, "stoneElements", i, null, null, true);
          }): false},
          {header: commonTranslation.insulation, elementHelper: insulation && insulation.products ? insulation.products.map((el, i) => {value = el.name;
            return this.elementMapHelper(el.id, value, "insulation", i, null, null, true); 
          }): false},
          {header: commonTranslation.grilles, elementHelper: grilles && grilles.products ? grilles.products.map((el, i) => {value = el.name;
            return this.elementMapHelper(el.id, value, "grilles", i, el.description, el.size, true);
          }): false},
          {header: commonTranslation.glues, elementHelper: glues && glues.products ? this.multipleElementHelper(glues.products.map((el, i) => {
            return this.commaHelper(i, el.name);
          }), "glues"): false},
          {header: commonTranslation.others, elementHelper: others && others.products ? this.multipleElementHelper(others.products.map((el, i) => {
            return this.commaHelper(i, el.name); 
          }), "others"): false},
          {header: commonTranslation.fireplace, elementHelper: firePlace && firePlace.products ? firePlace.products.map((el, i) => {value = el.name
           return this.elementMapHelper(el.id, value, "firePlace", i, el.description, null, false);
         }): false}
        ]
      }

      if(this.state.chosenProducts){

        let finalPrice = this.state.result + this.state.othersPrice + this.state.gluesPrice + this.state.chimneyConnectionPrice;
        const finalFinal = this.countNettoBruttoPrice(finalPrice);
        
        return (
            <div className="CalculatePrice">
                <h1>{priceTranslation.header}</h1>       
                  {dataProducts.map(item => {
                      return renderProducts(item.header, item.elementHelper, item.visible)
                  })}             
                <OfferSingleElement header={priceTranslation.work}>
                  <Row form>
                    <Col md={3}>
                      <FormGroup>
                      <Label>{priceTranslation.work}</Label>
                        <Input value={this.state.work || ""} onChange={(event) => {this.setState({work: event.target.valueAsNumber})}}
                          type="number"/>
                      </FormGroup>
                    </Col>
                  </Row>
                </OfferSingleElement>
                <ListGroup>
                  <ListGroupItem className="productsList">
                  <ListGroupItemHeading><strong>{commonTranslation.summary}</strong></ListGroupItemHeading>
                        <Row form>
                        <ColFormGroupInput md={4} type="text" disabled={true} value={finalPrice || ""}>
                          <br /><Label>{commonTranslation.materialsTogether}</Label>
                        </ColFormGroupInput>
                        <ColFormGroupInput md={4} type="text" disabled={true} value={this.state.work || ""}>
                          <br /><Label>{priceTranslation.work}</Label>
                        </ColFormGroupInput>
                        <ColFormGroupInput md={4} type="text" disabled={true} value={Math.round(finalFinal) || ""}>
                          <br /><Label>{commonTranslation.materialsTogetherVat}</Label>
                        </ColFormGroupInput>
                        <ColFormGroupInput md={4} type="text" disabled={true} value={(Math.round(this.state.work + finalFinal)) || ""}>
                          <br /><Label>{commonTranslation.materialsTogetherVatWork}</Label>
                        </ColFormGroupInput>
                      </Row>
                  </ListGroupItem>
                </ListGroup>
                <br />
              <footer className="footerStyle">
                <Button onClick={this.backToPrevios} size="lg" color="primary" className="footerBackButton"> {mainTranslation.back}</Button> 
                <Button size="lg" className="footerNextButton" onClick={this.updateDataHandler} color="primary">{commonTranslation.nextButton}</Button>
              </footer>
            </div>
        );
      }
      return <div>{priceTranslation.noProducts}</div>
    }

}

export default CalculatePrice;