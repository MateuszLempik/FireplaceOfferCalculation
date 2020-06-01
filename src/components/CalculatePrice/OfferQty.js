import React from 'react';
import { Input, FormGroup, Label, Col} from 'reactstrap';
import { priceTranslation } from '../../mainTranslations';

const offerQty = (props) => (
    <Col md={2}>
        <FormGroup>
        <br />
        <Label for="exampleEmail">{priceTranslation.qty}</Label>
        <Input id={props.id} type="number" className={props.class} defaultValue={props.defaultValue} value={props.value} onChange={props.onChange} onFocus={props.onFocus} />
        </FormGroup>
    </Col>
);

export default offerQty;