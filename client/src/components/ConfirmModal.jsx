import React from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";

const ConfirmModal = ({
  isOpenModal,
  setIsOpenModal,
  handleClick,
  title,
  description,
}) => {
  return (
    <Modal
      basic
      onClose={() => setIsOpenModal(false)}
      onOpen={() => setIsOpenModal(true)}
      open={isOpenModal}
      size="small"
    >
      <Header icon>
        <Icon className="text-red-500" name="exclamation circle" />
        <div className="pt-5">
          <span className="text-2xl">Confirm Message</span>
        </div>
      </Header>
      <Modal.Content>
        <span className="text-xl">
          {description} <span className="text-indigo-500">{title}</span> ?
        </span>
      </Modal.Content>
      <Modal.Actions>
        <Button
          basic
          color="red"
          inverted
          onClick={() => setIsOpenModal(false)}
        >
          <Icon name="remove" /> No
        </Button>
        <Button onClick={() => handleClick()} color="green" inverted>
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ConfirmModal;
