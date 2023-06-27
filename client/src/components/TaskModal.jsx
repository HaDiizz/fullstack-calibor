import {
  Backdrop,
  Fade,
  IconButton,
  Modal,
  Box,
  TextField,
  Typography,
  Divider,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { removeTask, updateTask } from '../redux/actions/taskAction';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modalStyle = {
  outline: 'none',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  //   bgcolor: 'background.paper',
  border: '0px solid #000',
  boxShadow: 24,
  p: 1,
  height: '80%',
};
const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
  ['image', 'video'],
];
let timer;
const timeout = 500;
let isModalClosed = false;

const TaskModal = (props) => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);
  const boardId = props.boardId;
  const [task, setTask] = useState(props.task);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const editorWrapperRef = useRef();

  useEffect(() => {
    setTask(props.task);
    setTitle(props.task !== undefined ? props.task.title : '');
    setContent(props.task !== undefined ? props.task.content : '');
    if (props.task !== undefined) {
      isModalClosed = false;
    }
  }, [props.task]);

  const onClose = () => {
    isModalClosed = true;
    props.onUpdate(task);
    props.onClose();
  };

  const deleteTask = async () => {
    try {
      //   await taskApi.delete(boardId, task.id)
      await dispatch(removeTask(task._id, auth.token));
      props.onDelete(task);
      setTask(undefined);
    } catch (err) {
      alert(err);
    }
  };

  const updateTitle = async (e) => {
    clearTimeout(timer);
    const newTitle = e.target.value;
    timer = setTimeout(async () => {
      try {
        // await taskApi.update(boardId, task.id, { title: newTitle });
        await dispatch(updateTask(task._id, { title: newTitle }, auth.token));
      } catch (err) {
        alert(err);
      }
    }, timeout);

    task.title = newTitle;
    setTitle(newTitle);
    props.onUpdate(task);
  };

  const updateContent = async (event) => {
    clearTimeout(timer);
    const data = event;
    if (!isModalClosed) {
      timer = setTimeout(async () => {
        try {
          //   await taskApi.update(boardId, task.id, { content: data });
          await dispatch(updateTask(task._id, { content: data }, auth.token));
        } catch (err) {
          alert(err);
        }
      }, timeout);

      task.content = data;
      setContent(data);
      props.onUpdate(task);
    }
  };

  return (
    <Modal
      className='backdrop-blur-md'
      open={task !== undefined}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={task !== undefined}>
        <Box
          sx={modalStyle}
          className='dark:bg-neutral-900 dark:text-white bg-white'
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            <IconButton variant='outlined' color='error' onClick={deleteTask}>
              <DeleteOutlinedIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              flexDirection: 'column',
              padding: '2rem 2rem 5rem',
            }}
          >
            <TextField
              value={title}
              onChange={updateTitle}
              placeholder='Untitled'
              variant='outlined'
              fullWidth
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-input': { padding: 0 },
                '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
                '& .MuiOutlinedInput-root': {
                  fontSize: '2rem',
                  fontWeight: '700',
                },
                input: {
                  color: '#969696',
                  '&::placeholder': {
                    opacity: 1,
                  },
                },
                marginBottom: '10px',
              }}
            />
            <Typography variant='body2' fontWeight='700'>
              {task !== undefined
                ? Moment(task.createdAt).format('YYYY-MM-DD')
                : ''}
            </Typography>
            <Divider sx={{ margin: '1.5rem 0' }} />
            <Box
              ref={editorWrapperRef}
              sx={{
                position: 'relative',
                height: '80%',
                overflowX: 'hidden',
                overflowY: 'auto',
              }}
            >
              <ReactQuill
                theme='snow'
                value={content}
                onChange={updateContent}
                modules={{
                  toolbar: toolbarOptions,
                }}
                style={{
                  fontSize: '16px'
                }}
              />
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default TaskModal;
