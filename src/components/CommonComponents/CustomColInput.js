import React from 'react';
import { Col, CustomInput} from 'reactstrap';

const customColInput = (props) => (
    <Col sm={props.sm}>
        <CustomInput multiple={false} id={props.id} type={props.type} name={props.name} label={props.label} title={props.title} onChange={props.onChange} checked={props.value} />
    </Col>
);

export default customColInput;