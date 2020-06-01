import React from 'react'
import {Col, FormGroup, Input} from 'reactstrap';

const ColFormGroupInput = (props) => {
    return (
    <Col md={props.md}>
        <FormGroup>
            {props.children}
            <Input 
                id={props.id}
                type={props.type}
                title={props.title} 
                onChange={props.onChange} 
                name={props.inputName} 
                defaultValue={props.defaultValue} 
                disabled={props.disabled}
                value={props.value}>{props.elements}
            </Input>
        </FormGroup>
    </Col>
    )
}

export default ColFormGroupInput;