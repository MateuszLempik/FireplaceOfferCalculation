import React from 'react';
import { Col, Label, Button, Input, FormGroup } from 'reactstrap';
import '../../containers/CalculateMain/CalculateMain.css';

const editProduct = (props) => (
    <div className={props.class}>
        <Label>{props.nameLabel}</Label>
        <FormGroup row>
            <Col sm={props.sm}>
                <Input 
                    onChange={props.onChange}
                    type={props.type}
                    name={props.name}
                    id={props.id}
                    placeholder={props.placeholder}
                    value={props.valueEdit} />
            </Col>
            {props.children}
            <Col sm={4}>
                <Button className="EditProduct" onClick={props.onClick} outline color="primary">{props.buttonText}</Button>
                <Button onClick={props.deleteOnClick} outline color="danger">{props.deleteText}</Button>
            </Col>
        </FormGroup>
    </div>
);

export default editProduct;


