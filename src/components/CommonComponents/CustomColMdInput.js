import React from 'react';
import { Col, CustomInput, FormGroup } from 'reactstrap';

const customColMdInput = (props) => (
    <Col md={props.md}>
        <FormGroup>
            <CustomInput id={props.id} type={props.type} checked={props.checked} label={props.label} name={props.name} title={props.title} onChange={props.onChange} />
        </FormGroup>
    </Col>
);

export default customColMdInput;