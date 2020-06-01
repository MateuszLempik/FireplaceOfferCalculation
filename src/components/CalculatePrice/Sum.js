import React from 'react';
import { Input, Form, FormGroup, Label, Row, Col} from 'reactstrap';
import { priceTranslation } from '../../mainTranslations';

const sum = (props) => (
    <Form>
        <Row form>
        {props.children}
        <Col md={3}>
            <FormGroup>
            <br />
            <Label for="sumLabel">{priceTranslation.price}</Label>
                <Input type="number" id={props.id} name={props.name} value={props.priceValue} onChange={props.onChange} onFocus={props.onFocus} />
            </FormGroup>
        </Col>
        <Col md={3}>
            <FormGroup>
            <br />
            <Label for="exampleEmail">{priceTranslation.total}</Label>
                <Input disabled={true} value={props.value} type="text"/>
            </FormGroup>
        </Col>
        </Row>
    </Form>
);

export default sum;
