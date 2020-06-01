import React from 'react';
import { ListGroup, ListGroupItem, ListGroupItemHeading} from 'reactstrap';
import '../../containers/CalculatePrice/CalculatePrice.css';

const offerSingleElement = (props) => (
    <>
    <ListGroup>
        {props.label}
        <ListGroupItem className="OfferSingleElement">
            <ListGroupItemHeading>{props.header}</ListGroupItemHeading>
            {props.children}
        </ListGroupItem>
    </ListGroup>
    <br />
    </>
);

export default offerSingleElement;