import React from 'react';
import { Row, Col, FormGroup, Label, Button } from 'reactstrap';
import CustomColMdInput from '../CommonComponents/CustomColMdInput';

const FirePlaceProduct = (props) => {
    return (
        <Row form>
        <CustomColMdInput id={props.id} md="2" type="checkbox" label={props.label} checked={props.checked} name={props.name} title={props.title} onChange={props.onChange} />
        <Col md={7}>
            <FormGroup>
                <Label>
                    {props.descr}
                </Label>
            </FormGroup>
        </Col>
        <Col md={2}>
            <FormGroup>
                <Button disabled={props.disabled} type="button" color="primary" onClick={props.onClickEdit}>{props.buttonText}</Button>
            </FormGroup>
        </Col>
    </Row>
    );
}

export default FirePlaceProduct;