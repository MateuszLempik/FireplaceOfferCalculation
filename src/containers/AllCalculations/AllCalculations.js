import React, { Component } from 'react';
import axios from 'axios';
import { ListGroup, ListGroupItem, Button, ListGroupItemHeading, ListGroupItemText} from 'reactstrap';
import Modal from '../../components/Modal/NewClientModal';
import './AllCalculations.css';
import { allCalculationsTranslations } from '../../mainTranslations';

class AllCalculations extends Component {

    state = {
        allOffers: null,
        customerName: null,
        customerTitle: null,
        customerEmail: null,
        customerDate: new Date().toISOString().substring(0, 10)
    }

    componentDidMount(){
        this.loadData();
      }

    loadData(){
        axios.get("/offers").then(response =>{
            this.setState({allOffers: response.data});
        })
    }

    deleteOffer = (event) => {
        axios.delete('/offers/' + event.target.id)
        .then(() => {
            this.loadData();
        });
    }

    showOffer = (event) => {
        this.props.history.replace('/calculateSummary', event.target.id);
    }

    editOffer = (event) => {
        this.props.history.replace('/calculateMain', event.target.id);
    }

    onPrint = (id) => {
        this.setState({offerId: id})
    }

    copyOffer = (item) => {
        const {customerName, customerTitle, customerEmail, customerDate} = this.state;

        const newItem = {...item};
        
        newItem.name = customerName;
        newItem.title = customerTitle;
        newItem.email = customerEmail;
        newItem.date = customerDate;

        if(customerName){
            this.setState({invalid: false})
            delete newItem._id;
            this.createOfferOnCopy(newItem);
        }else {
            this.setState({invalid: true})
        }
    }

    createOfferOnCopy = (item) => {
        axios.post('/offers', item)
        .then(() => {
            this.loadData()
            this.setState({manage: null,
                customerName: null,
                customerEmail: null,
                customerTitle: null,
                customerDate: null
            })
        })
    }

    onToggle = (id) => {
        this.setState(prevState => ({manage: prevState.manage === id? null: id})); 
    }

    changeName = (event) => {
        if(event.target.value !== null) this.setState({invalid: false})
        this.setState({customerName: event.target.value})
    }
    
    render () {
        if(this.state.allOffers){
            const sortArray = this.state.allOffers;

            sortArray.sort((a, b) => {
                const c = new Date(a.date);
                const d = new Date(b.date);

                return d-c;
            });

            return (
                <div className="AllCalculations">
                <ListGroup>
                    {sortArray.map((item) => {
                    return (
                    <div key={item._id}>
                    <ListGroupItem>
                        <ListGroupItemHeading>
                            <strong>{item.name}</strong>, {allCalculationsTranslations.date} <strong>{item.date}</strong>
                            <div className="buttonsStyle">
                                <Button onClick={() => this.onToggle(item._id)}>{allCalculationsTranslations.copyOffer}</Button>
                                <Button id={item._id} onClick={this.deleteOffer}>{allCalculationsTranslations.deleteOffer}</Button>
                                <Button id={item._id} onClick={this.editOffer}>{allCalculationsTranslations.editOffer}</Button>
                                <Button id={item._id} onClick={this.showOffer}>{allCalculationsTranslations.showOffer}</Button>
                            </div>  
                            <Modal
                                id={item._id}
                                onClickAccept={() => this.copyOffer(item)}
                                manage={this.state.manage} 
                                onChangeName={this.changeName}
                                onChangeEmail={(event) => this.setState({customerEmail: event.target.value})} 
                                onChangeTitle={(event) => this.setState({customerTitle: event.target.value})}
                                onChangeDate={(event) => this.setState({customerDate: event.target.value})}
                                onToggle={() => this.onToggle(item._id)}
                                invalid={this.state.invalid}
                                defaultValue={this.state.customerDate} 
                                />
                        </ListGroupItemHeading>
                        {item.title ? 
                            <ListGroupItemText>
                                {allCalculationsTranslations.offerTitle} {item.title}
                            </ListGroupItemText> : null
                        }
                        <ListGroupItemText>
                            {allCalculationsTranslations.offerEmail} {item.email}   
                        </ListGroupItemText>
                    </ListGroupItem>
                    <br />
                    </div>
                    )
                    })}
                </ListGroup>
                </div>
            )
        }
        return <div>{allCalculationsTranslations.loading}</div>
    }
}


export default AllCalculations;