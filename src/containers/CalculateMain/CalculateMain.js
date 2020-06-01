import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Row, Input} from 'reactstrap';
import './CalculateMain.css';

import StoneElements from '../../components/StoneElements/StoneElements';
import ChimneyConnectionProducts from '../../components/ChimneyConnection/ChimneyConnectionProducts';
import InsulationProducts from '../../components/Insulation/InsulationProducts';
import GrillesProducts from '../../components/Grilles/GrillesProducts';
import GluesProducts from '../../components/Glues/GluesProducts';
import OthersProducts from '../../components/Others/OthersProducts';
import FirePlaceProducts from '../../components/FirePlace/FirePlaceProducts';
import ColFormGroupInput from '../../components/CommonComponents/ColFormGroupInput';
import { commonTranslation, mainTranslation } from '../../../src/mainTranslations';

const chimneyConnection = {name: "ChimneyConnection", transalted: commonTranslation.chimneyConnection};
const stoneElements = {name: "StoneElements", translated: commonTranslation.stoneElements};
const insulation = {name: "Insulation", translated: commonTranslation.insulation};
const grilles = {name: "Grilles", translated: commonTranslation.grilles};
const glues = {name: "Glues", translated: commonTranslation.glues};
const others = {name: "Others", translated: commonTranslation.others};
const fireplace = {name: "FirePlace", translated: commonTranslation.fireplace};

class CalculateMain extends Component {

    state = {
      allProducts: null,
      offerData: null
    }

    componentDidMount(){
      let offerId = this.props.location.state;
      if(offerId){
        this.loadOffer(offerId);
      }
      this.loadData();

      const baseDate = new Date();

      let day = baseDate.getDate();
      let month = baseDate.getMonth() + 1;
      const year = baseDate.getFullYear();

      if(day < 10) day = `0${day}`;
      if(month < 10) month = `0${month}`;

      const date = `${year}-${month}-${day}`;
      date.toString();

      this.setState({date});
    }

    loadData(bool, list) {
      if(!this.state.allProducts || bool){
        axios.get("/products").then(response =>{
          this.setState({allProducts: response.data});
          if(bool === true){
            this.saveData(list);
          }
        })
      }
    }

    loadOffer(offerId) {
      if(!this.state.offerData && offerId !== null){
        axios.get("/offers/" + offerId).then(response =>{
          this.setState({offerData: response.data});
          this.setState({title: (this.state.offerData && this.state.offerData.title) || "",
          name: (this.state.offerData && this.state.offerData.name) || "",
          email: (this.state.offerData && this.state.offerData.email) || "",
          date: (this.state.offerData && this.state.offerData.date) || this.state.date,
          description: {
            value: (this.state.offerData && this.state.offerData.description && this.state.offerData.description.value) || "",
            rows: this.state.offerData && this.state.offerData.description && this.state.offerData.description.rows
          },
          description2: {
            value: (this.state.offerData && this.state.offerData.description2 && this.state.offerData.description2.value) || "",
            rows: this.state.offerData && this.state.offerData.description2 && this.state.offerData.description2.rows
          }})
        })
      }
    }

    switchToCalculate = () => {
      this.setState({redirect: true});
    }

    postDataOffer(chimneyConnectionResults, stoneElementsResults, insulationResults, grillesResults, gluesResults, othersResults, firePlaceResults){
      const {title, name, email, date, description, description2} = this.state;
      
      const data = {
        title, name, email, date, description,
        chimneyConnection: chimneyConnectionResults.length > 0 ?  {products: chimneyConnectionResults} : null,
        stoneElements: stoneElementsResults.length > 0 ? {products: stoneElementsResults} : null,
        insulation: insulationResults.length > 0 ? {products: insulationResults} : null,
        grilles: grillesResults.length > 0 ? {products: grillesResults} : null,
        glues: gluesResults.length > 0 ? {products: gluesResults} : null,
        others: othersResults.length > 0 ? {products: othersResults} : null,
        firePlace: firePlaceResults.length > 0 ? {products: firePlaceResults} : null,
        description2
      }
      axios.post('/offers', data)
        .then((result) => {
          this.setState({offerId: result.data._id});
          this.switchToCalculate();
      })};

      updateDataOffer(chimneyConnectionResults, stoneElementsResults, insulationResults, grillesResults, gluesResults, othersResults, firePlaceResults){
        
        let newObj = {};
        let createObj = {};   
        const helpFunc = (el, products) => {
          createObj = {};
          products.forEach((element) => {
            if(element.id === el.id){
              createObj = {
                price: element ? element.price : null,
                count: element ? element.count : null,
                sum: element ? element.sum : null
              }
            }
          })

          newObj = {...el, ...createObj};

          return newObj;


        }

        const {title, name, email, date, description, description2} = this.state;
        const { stoneElements, insulation, grilles, firePlace } = this.state.offerData

        const chimneyConnection = {
          products: chimneyConnectionResults.length > 0 ? chimneyConnectionResults : null,
          price: chimneyConnectionResults.length > 0 ? this.state.offerData && this.state.offerData.chimneyConnection && this.state.offerData.chimneyConnection.price : null
        }

        const stoneElementsToUpdate = {
          products: stoneElementsResults.map((el) => {
            return (helpFunc(el, stoneElements.products))
          }),
          price: this.state.offerData.stoneElements.price
        }

        const insulationToUpdate = {
          products: insulationResults.map((el) => {
            return (helpFunc(el, insulation.products))
          }),
          price: this.state.offerData.insulation.price
        }

        const grillesToUpdate = {
          products: grillesResults.map((el) => {
            return (helpFunc(el, grilles.products))
          }),
          price: this.state.offerData.grilles.price
        }

        const glues = {
          products: gluesResults.length > 0 ? gluesResults : null,
          price: gluesResults.length > 0 ? this.state.offerData && this.state.offerData.glues && this.state.offerData.glues.price : null
        }

        const others = {
          products: othersResults.length > 0 ? othersResults : null,
          price: othersResults.length > 0 ?  this.state.offerData && this.state.offerData.others && this.state.offerData.others.price : null
        }

        const firePlaceToUpdate = {
          products: firePlaceResults.map((el) => {
            return (helpFunc(el, firePlace.products))
          }),
          price: this.state.offerData.firePlace.price
        }
        
        const data = {
          title, name, email, date, description,
          chimneyConnection,
          stoneElements: stoneElementsToUpdate,
          insulation: insulationToUpdate,
          grilles: grillesToUpdate,
          glues,
          others,
          firePlace: firePlaceToUpdate,
          description2
        }
        axios.put('/offers/' + this.props.location.state, data)
          .then((result) => {
            this.setState({offerId: result.data._id});
            this.switchToCalculate();
        })};

      
    // myCallback = (dataFromChild) => {
    //   console.log(dataFromChild)
    //   return dataFromChild;
    // }

    saveData(list) {
      let chimneyConnectionResults = [];
      let stoneElementsResults = [];
      let insulationResults = [];
      let grillesResults = [];
      let othersResults = [];
      let gluesResults = [];
      let firePlaceResults = [];
      let name;
      let id;
      let description;

      for (let i = 0; i < list.length; i++) {
        switch(list[i].title){
            case chimneyConnection.name:
              if(list[i].checked === true){
                name = list[i].name;
                chimneyConnectionResults.push({name: name, id: list[i].id});
              }
            break;

            case stoneElements.name:
              if(list[i].checked === true){
                name = list[i].name;
                id = list[i].id;
              }
              else if(list[i].id === id && list[i].type === "select-one"){
                stoneElementsResults.push({name: name, value: list[i].value, id: list[i].id})
              }
            break;

            case insulation.name:
              if(list[i].checked === true){
                name = list[i].name;
                insulationResults.push({name: name, id: list[i].id});
              }
            break;

            case grilles.name:
            if(list[i].checked === true){
              name = list[i].name;
              id = list[i].id;
            }
            else if(list[i].name === "descrInput" && list[i].id === id){
              description = list[i].value;
            }
            else if(list[i].name === "sizeInput" && list[i].id === id){
              grillesResults.push({name: name, description: description, size: list[i].value, id: list[i].id})
            }
            break;

            case glues.name:
            if(list[i].checked === true){
              name = list[i].name;
              gluesResults.push({name: name, id: list[i].id});
            }
            break;
            case others.name:
            if(list[i].checked === true){
              name = list[i].name;
              othersResults.push({name: name, id: list[i].id});
            }
            break;
            case fireplace.name: 
            if(list[i].checked === true){
              let descr;
              name = list[i].name;
              this.state.allProducts.filter((item) => {
                if(item._id === list[i].id) {
                    descr = item.description
                }
                return descr;
              })
              firePlaceResults.push({name: name, id: list[i].id, description: descr})
            }
            break;
            default:
            break;
          }
      }
      if(this.props.location.state && this.state.offerData){
        this.updateDataOffer(chimneyConnectionResults, stoneElementsResults, insulationResults, grillesResults, gluesResults, othersResults, firePlaceResults);
      }else {
        this.postDataOffer(chimneyConnectionResults, stoneElementsResults, insulationResults, grillesResults, gluesResults, othersResults, firePlaceResults);
      }
    }

    handleSubmit = (event) => {
      event.preventDefault();
      this.loadData(true, event.target)
    }

    render() {
      if (this.state.redirect && this.state.offerId) {
        return <Redirect to={{pathname: "/calculatePrice", state: this.state.offerId}} />
      }

      const locationState = this.props.location.state;
      let offerData = null;

      if (locationState){
        offerData = this.state.offerData;
      }else{
        offerData = true;
      }
      
      if(this.state.allProducts && offerData){

        const onChanged = (event) => {
          const {name, value} = event.target;
          this.setState({[name]: value})
        }

        const headerData = [
          {header: commonTranslation.title, name: "title", change: onChanged, value: this.state.title || "" },
          {header: commonTranslation.name, name: "name", change: onChanged, value: this.state.name || "" },
          {header: commonTranslation.email, name: "email", change: onChanged, value: this.state.email || "" },
          {header: commonTranslation.date, name: "date", change: onChanged, value: this.state.date, disabled: false, type: "date" }
        ]

        const productData = [
          { header: chimneyConnection.transalted,  name: chimneyConnection.name, component: ChimneyConnectionProducts, offerData: this.state.offerData && this.state.offerData.chimneyConnection}, 
          { header: stoneElements.translated, name: stoneElements.name, component: StoneElements, offerData: this.state.offerData && this.state.offerData.stoneElements },
          { header: insulation.translated, name: insulation.name, component: InsulationProducts, offerData: this.state.offerData && this.state.offerData.insulation },
          { header: grilles.translated, name: grilles.name, component: GrillesProducts, offerData: this.state.offerData && this.state.offerData.grilles },
          { header: glues.translated, name: glues.name, component: GluesProducts, offerData: this.state.offerData && this.state.offerData.glues },
          { header: others.translated, name: others.name, component: OthersProducts, offerData: this.state.offerData && this.state.offerData.others },
          { header: fireplace.translated, name: fireplace.name, component: FirePlaceProducts, offerData: this.state.offerData && this.state.offerData.firePlace }
        ]

        const renderProducts = (ProductComponent, prodType, header, offerProducts) =>{
          return (
            <div key={header}>
              <div className="CalculateMainProducts">
                <br />
                <h5>{header}</h5>
                <br />
                <ProductComponent products = {this.state.allProducts.filter(el => {
                  return el.type === prodType      
                })} offerProducts={offerProducts}/>          
              </div>
              <br />
            </div>
          )
        }

        return(
          <>
            <Form className="CalculateMain" onSubmit={this.handleSubmit}>
              <h1>{mainTranslation.calculationHeader}</h1>
              <br />
              <div className="headerStyle">
                <Row form>
                  {headerData.map((item, i) => {
                      return <ColFormGroupInput
                                md={3}
                                key={item.header}
                                type={item.type} 
                                inputName={item.name} 
                                onChange={item.change}
                                header={item.header} 
                                value={item.value} 
                                disabled={item.disabled}>
                               <h6>{item.header}</h6>
                      </ColFormGroupInput>
                  })}
                </Row>
                <h6>{mainTranslation.description}:</h6>
                <Input className="descriptionInputStyle" type="textarea" 
                  name="text" id="descriptionText" 
                  rows={this.state.description ? this.state.description.rows : 0} 
                  value={this.state.description ? this.state.description.value : "" || ""} 
                  onChange={(event) => {
                    const rows = event.target.value.split("\n").length;                    
                    this.setState({description: {
                      value: event.target.value,
                      rows: rows + 4
                    }})
                }} />
              </div>
              <br />
              <h4><strong>{mainTranslation.productsSelection}</strong></h4>        
                {productData.map(item => {
                  return renderProducts(item.component, item.name, item.header, item.offerData)
                })}
                <div className="additionalStyle">
                  <h5>{mainTranslation.additional}</h5>
                  <Input className="additionalStyleInput" type="textarea" 
                    name="text" id="descriptionText"
                    rows={this.state.description2 ? this.state.description2.rows : 0} 
                    value={this.state.description2 ? this.state.description2.value : "" || ""} 
                    onChange={(event) => {
                      const rows = event.target.value.split("\n").length;                    
                      this.setState({description2: {
                        value: event.target.value,
                        rows: rows + 1
                      }})
                  }} />
                </div>
                <br />
                <footer className="footerStyle">
                  <Button className="footerButton" size="lg" color="primary">{commonTranslation.nextButton}</Button>
                </footer>
            </Form>     
          </>  
        ) 
      }
    return <div>{commonTranslation.loading}</div>
    }
}

export default CalculateMain;