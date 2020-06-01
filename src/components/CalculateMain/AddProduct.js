import React from 'react';
import { Col, Label, Button, Input, FormGroup } from 'reactstrap';

const addProduct = (props) => (
    <div className={props.class}>
        <Label>{props.nameLabel}</Label>
        <FormGroup row>
            <Col sm={7}>
                <Input 
                    onChange={props.onChange}
                    type={props.type}
                    name={props.name}
                    id="exampleText" 
                    placeholder={props.placeholder}
                    value={props.valueAdd} />
            </Col>
            {props.children}
            <Col sm={2}>
                <Button onClick={props.onClick} outline color="primary">{props.buttonText}</Button>
            </Col>
        </FormGroup>
    </div>
);

export default addProduct;