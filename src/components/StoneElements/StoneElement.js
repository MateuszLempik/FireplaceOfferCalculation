import React from 'react';
import { Row, Button, Col, FormGroup } from 'reactstrap';
import CustomColMdInput from '../CommonComponents/CustomColMdInput';
import ColLabel from '../CommonComponents/ColLabel';
import ColSelect from '../CommonComponents/ColSelect';
import { mainTranslation } from '../../../src/mainTranslations';

const stoneElement = (props) => (
    <Row form>
        <CustomColMdInput id={props.id} md={2} type="checkbox" label={props.label} checked={props.checked} name={props.name} onChange={props.onChange} title={props.title} />     
        <ColLabel md={2} text={mainTranslation.colour + ": " + props.text} />
        <ColSelect selId={props.selId} md={2} type="select" name="select" onChangeSel={props.onChangeSel} title={props.title} valueSel={props.valueSel} option={props.option} />
        <Col md={2}>
            <FormGroup>
                <Button className={props.class} disabled={props.disabled} type="button" color="primary" onClick={props.onClickEdit}>{props.buttonText}</Button>    
            </FormGroup>
        </Col>
    </Row>
);

export default stoneElement;