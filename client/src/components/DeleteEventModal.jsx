import React from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';

const DeleteEventModal = ({
  isOpenDeleteModal,
  setIsOpenDeleteModal,
  onDelete,
  title,
}) => {
  return (
    <Modal
      basic
      onClose={() => setIsOpenDeleteModal(false)}
      onOpen={() => setIsOpenDeleteModal(true)}
      open={isOpenDeleteModal}
      size='small'
    >
      <Header icon>
        <Icon className='text-red-500' name='delete' />
        <span className='text-2xl'>Confirm Delete Message</span>
      </Header>
      <Modal.Content>
        <span className='text-xl'>
          Do you want to delete <span className='text-indigo-500'>{title}</span>{' '}
          event ?
        </span>
      </Modal.Content>
      <Modal.Actions>
        <Button
          basic
          color='red'
          inverted
          onClick={() => setIsOpenDeleteModal(false)}
        >
          <Icon name='remove' /> No
        </Button>
        <Button onClick={onDelete} color='green' inverted>
          <Icon name='checkmark' /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default DeleteEventModal;
