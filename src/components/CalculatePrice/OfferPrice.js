import React from 'react';
import { Input, FormGroup, Label, Row, Col} from 'reactstrap';
import { priceTranslation } from '../../mainTranslations';

const offerPrice = (props) => (
        <Row form>
        {props.children}
        <Col md={3}>
            <FormGroup>
            <br />
                <Label for="examplePassword">{priceTranslation.priceOther}</Label>
                <Input id={props.id} type="number" name={props.name} onChange={props.onChange} value={props.value} onFocus={props.onFocus} />
            </FormGroup>
        </Col>
        </Row>
);

export default offerPrice;
