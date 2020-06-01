import React from 'react';
import { Row, Col, FormGroup, Input, Button } from 'reactstrap';
import CustomColMdInput from '../CommonComponents/CustomColMdInput';

const grillesProduct = (props) => (
    <Row form>
        <CustomColMdInput id={props.id} checked={props.checked} md={2} type="checkbox" label={props.label} name={props.name} title={props.title} onChange={props.onChange} />
        <Col md={6}>
            <FormGroup>
                <Input
                    onChange={props.onChangeDescr}
                    type={props.type}
                    name={props.descrName}
                    title={props.title}
                    id={props.id}
                    placeholder={props.placeholder}
                    value={props.value} />
            </FormGroup>
        </Col>
        <Col md={2}>
            <FormGroup>
                <Input
                    onChange={props.onChangeSize}
                    type="textarea"
                    name={props.sizeName}
                    title={props.title}
                    id={props.id}
                    placeholder={props.sizePlaceholder}
                    value={props.sizeValue} />
            </FormGroup>
        </Col>
        <Col md={2}>
            <FormGroup>
                <Button className={props.class} disabled={props.disabled} type="button" color="primary" onClick={props.onClickEdit}>{props.buttonText}</Button>    
            </FormGroup>
        </Col>
    </Row>
);

export default grillesProduct;