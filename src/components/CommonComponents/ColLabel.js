import React from 'react';
import { Col, Label, FormGroup } from 'reactstrap';

const colLabel = (props) => (
    <Col md={props.md}>
        <FormGroup>
            <Label>{props.text}</Label>
        </FormGroup>
    </Col>
);

export default colLabel;