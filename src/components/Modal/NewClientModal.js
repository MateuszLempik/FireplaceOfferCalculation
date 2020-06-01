import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Row, Col, FormGroup, FormFeedback } from 'reactstrap';
import { newClientModalTranslations } from '../../mainTranslations';

const NewClientModal = (props) => {
  const {
    onClickAccept,
    onChangeName,
    onChangeTitle,
    onChangeEmail,
    onChangeDate,
    value,
    onToggle,
    manage,
    id,
    invalid,
    defaultValue
  } = props;

  return (
    <>
      <Modal centered={true} isOpen={manage === id} >
      <ModalHeader toggle={onToggle}>{newClientModalTranslations.header}</ModalHeader>
        <ModalBody>
          <Row>
          <Col md={6}>
              <FormGroup>
                <Label>{newClientModalTranslations.clientData}</Label>
                <Input required invalid={invalid} type="text" value={value} onChange={onChangeName} />
                <FormFeedback>{newClientModalTranslations.requiredInput}</FormFeedback>
              </FormGroup>
          </Col>
          <Col md={6}>
              <FormGroup>
                <Label>{newClientModalTranslations.email}</Label>
                <Input type="text" onChange={onChangeEmail} />
              </FormGroup>
          </Col>
          <Col md={6}>
              <FormGroup>
                <Label>{newClientModalTranslations.title}</Label>
                <Input type="text" onChange={onChangeTitle} />
              </FormGroup>
          </Col>
          <Col md={6}>
              <FormGroup>
                <Label>{newClientModalTranslations.date}</Label>
                <Input defaultValue={defaultValue} type="date" onChange={onChangeDate} />
              </FormGroup>
          </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" color="primary" onClick={onClickAccept}>{newClientModalTranslations.ok}</Button>{' '}
          <Button color="secondary" onClick={onToggle}>{newClientModalTranslations.anuluj}</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default NewClientModal;