import React, { Component } from 'react';
import axios from 'axios';
import {Row, ListGroupItem, Col, ListGroupItemText, Label, Input, ListGroup, FormGroup, Button} from 'reactstrap';
import OfferSingleElement from '../../components/CalculatePrice/OfferSingleElement';
import ProductsElementsTable from '../../components/CalculateSummary/ProductsElementsTable';
import './CalculateSummary.css'
import { commonTranslation, summaryTranslation, mainTranslation } from '../../mainTranslations';
import Logo from '../../Logo/Logo';


class CalculateSummary extends Component {

    state = {
        chosenProducts: null,
        showPrice: true
    }

    componentDidMount () {
        let offerId = this.props && this.props.location && this.props.location.state
        this.setState({offerId})
        this.loadData(offerId);
    }

    loadData(offerId) {
      if((!this.state.chosenProducts && offerId !== null)){
        axios.get("/offers/" + offerId).then(response =>{
          this.setState({chosenProducts: response.data});
        })
      }
    }

    commaHelper = (i, el) => {
        if(i !== 0) return ", " + el; 
          return el;   
    }

    onPointerOverCapture() {
        console.log("focus")
    }
    
    onFocus() {
        console.log("leave")
    }

    backToPrevios = () => {
        this.props.history.push('/calculatePrice', this.state.offerId);
    }

    render (){
        let dataProducts;
        let headerData;

        if(this.state.chosenProducts){
            const {title, email, name, chimneyConnection, glues, others} = this.state.chosenProducts;
            
            headerData = [
                {header:  commonTranslation.title, name: "title", value: title, disabled: true},
                {header:  commonTranslation.name, name: "name", value: name, disabled: true},
                {header:  commonTranslation.email, name: "email", value: email, disabled: true}
              ]
            
            dataProducts = [
                {header: commonTranslation.chimneyConnection, products: chimneyConnection && chimneyConnection.products && chimneyConnection.products.map((el, i) => {
                    return this.commaHelper(i, el.name); 
                }), price: chimneyConnection && chimneyConnection.price},
                {header: commonTranslation.glues, products: glues && glues.products && glues.products.map((el, i) => {
                    return this.commaHelper(i, el.name); 
                }), price: glues && glues.price},
                {header: commonTranslation.others, products: others && others.products && others.products.map((el, i) => {
                    return this.commaHelper(i, el.name); 
                }), price: others && others.price}
            ]
        }

        if(this.state.chosenProducts){
            const {stoneElements, insulation, grilles, firePlace, finalPrice, date, description2} = this.state.chosenProducts;
        return (
            <div className="CalculateSummary">
                <h1>{summaryTranslation.header}</h1>      
                <br />
                    <div className="dateStyle">
                        <h5>{commonTranslation.date} {date}</h5>
                    </div>
                    <Logo />
                    <Row>
                        <Col>
                        {headerData.map(item => {
                        return item.value ? 
                            <FormGroup key={item.header}>
                                <h5><strong>{item.header}</strong> {item.value}</h5>
                            </FormGroup> 
                             : null
                        })}
                        </Col>
                    </Row>
                <br />         
                {this.state.chosenProducts && this.state.chosenProducts.description && this.state.chosenProducts.description.value ?
                <Input className="descriptionStyleInput" type="textarea" 
                    id="textAreaProductSummary" 
                    name="text" defaultValue={this.state.chosenProducts.description && this.state.chosenProducts.description.value} 
                    rows={this.state.chosenProducts.description && this.state.chosenProducts.description.rows} disabled={true}/>: null
                }
                <br />
                {dataProducts.map((item, i) => {
                    if(item.products){
                        return (
                            <OfferSingleElement key={`offerSingleElement${i}`}
                                label={<Label><strong><h4>{item.header}</h4></strong></Label>}>
                                <ListGroupItemText ><strong>{summaryTranslation.products} </strong>{item.products}</ListGroupItemText>
                                {this.state.showPrice ? <ListGroupItemText><strong>{summaryTranslation.price}: </strong>{item.price} zł</ListGroupItemText>: null}
                            </OfferSingleElement>                
                        )
                    }else {
                        return null;
                    }
                })}
                {
                    <>
                    <ProductsElementsTable 
                        products={stoneElements && stoneElements.products} 
                        thVisible={true}
                        descrVisible={false}
                        sizeVisible={false}
                        priceVisible={this.state.showPrice}
                        countVisible={true}
                        summaryPriceVisible={this.state.showPrice}    
                        price={stoneElements && stoneElements.price} 
                        header={commonTranslation.stoneElements} 
                        columnName={summaryTranslation.nameColour}
                        columnCount={4}/>                             
                    <ProductsElementsTable 
                        products={insulation && insulation.products} 
                        thVisible={false} 
                        descrVisible={false}
                        sizeVisible={false}
                        priceVisible={this.state.showPrice}
                        countVisible={true}
                        summaryPriceVisible={this.state.showPrice}     
                        price={insulation && insulation.price} 
                        header={commonTranslation.insulation}
                        columnName={summaryTranslation.name}
                        columnCount={3} />
                    <ProductsElementsTable 
                        products={grilles && grilles.products} 
                        thVisible={false}
                        descrVisible={true}
                        sizeVisible={true}
                        priceVisible={this.state.showPrice}
                        countVisible={true}
                        summaryPriceVisible={this.state.showPrice}     
                        price={grilles && grilles.price} 
                        header={commonTranslation.grilles}
                        columnName={summaryTranslation.name}
                        columnCount={5} />  
                    <ProductsElementsTable
                        products={firePlace && firePlace.products} 
                        thVisible={false}
                        descrVisible={true}
                        sizeVisible={false}
                        countVisible={false}
                        summaryPriceVisible={false} 
                        priceVisible={true}   
                        price={firePlace && firePlace.price} 
                        header={commonTranslation.fireplace}
                        columnName={summaryTranslation.name}
                        columnCount={3} />   
                    </>
                }
                <Label><strong><h4>{commonTranslation.summary}</h4></strong></Label>
                <ListGroup onPointerUp={() => {this.setState({showButton: true})}}>
                    <ListGroupItem className="listGroupStyle">
                            <Row form>
                            <Col md={8}>
                                <FormGroup>
                                <p>{commonTranslation.materialsTogetherVatWork} <strong>{`${Math.round(finalPrice) || 0} zł*`}</strong></p>
                                </FormGroup>
                            </Col>
                        </Row>
                    <p>{summaryTranslation.additionalInfo}</p>
                    </ListGroupItem>
                </ListGroup>
                <br />
                {description2 && description2.value ?
                <> 
                <h4>{summaryTranslation.additional}</h4>
                <Input type="textarea" className="description2InputStyle"
                    id="textAreaProductSummary" 
                    name="text" defaultValue={this.state.chosenProducts.description2 && this.state.chosenProducts.description2.value} 
                    rows={this.state.chosenProducts.description2 && this.state.chosenProducts.description2.rows} disabled={true}/>                        
                </> :null
                }
                <br />
                <footer className="footerStyle">
                    {this.state.showButton ?
                    <>
                    <Button className="footerBackButton" onClick={this.backToPrevios} size="lg" color="primary">{mainTranslation.back}</Button>
                        <Button 
                            size="lg" 
                            className="footerPriceButton"
                            onClick={() => {this.setState((prevState) => {return {showPrice: !prevState.showPrice, showButton: false}})}} 
                            color="primary">{this.state.showPrice ? summaryTranslation.hidePrice : summaryTranslation.showPrice}
                        </Button>
                    </>: null
                    }
                </footer>
            </div>
        )
        }
        return <div>{summaryTranslation.noProducts}</div>
    }
}

export default CalculateSummary;