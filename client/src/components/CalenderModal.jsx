import React, { useState } from "react";
import {
  Backdrop,
  Fade,
  IconButton,
  Modal,
  Box,
  TextField,
  Typography,
  Divider,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  MenuItem,
  InputBase,
  NativeSelect,
  InputLabel,
  styled,
  Select,
} from "@mui/material";
import { FaTimes } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  createCalendar,
  getEventsCalendar,
} from "../redux/actions/calendarAction";

const modalStyle = {
  outline: "none",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  border: "0px solid #000",
  boxShadow: 24,
  p: 1,
  height: "80%",
  width: "90%",
};

const CalenderModal = ({
  isOpen,
  onClose,
  data,
  setData,
  handleCreate,
  scheduleTopic = null,
}) => {
  const dispatch = useDispatch();
  const { auth, topics } = useSelector((state) => state);
  const { theme } = useSelector((state) => state.theme);

  const BootstrapInput = styled(InputBase)((themes) => ({
    "label + &": {
      marginTop: themes.theme.spacing(3),
    },
    // '& .css-6hp17o-MuiList-root-MuiMenu-list': {
    //   backgroundColor: '#00ff1e'
    // },
    "& .MuiInputBase-input": {
      borderRadius: 4,
      position: "relative",
      color: theme === "dark" ? "#ffff" : "#020202",
      // backgroundColor: theme === 'dark' ? '#272727' : '#020202',
      transition: themes.theme.transitions.create([
        "border-color",
        "box-shadow",
      ]),
      border: "1px solid #ced4da",
      fontSize: 16,
      padding: "10px 26px 10px 12px",
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
      "&:focus": {
        borderRadius: 4,
        borderColor: "#80bdff",
        boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
      },
    },
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  return (
    <>
      <Modal
        className="backdrop-blur-md"
        open={isOpen}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={isOpen}>
          <Box
            sx={modalStyle}
            className="dark:bg-neutral-900 dark:text-white bg-white"
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <IconButton variant="outlined" color="error" onClick={onClose}>
                <FaTimes />
              </IconButton>
            </Box>
            <Box
              sx={{
                display: "flex",
                height: "100%",
                flexDirection: "column",
                padding: "2rem 5rem 5rem",
              }}
            >
              <TextField
                value={data?.title}
                name="title"
                onChange={handleChange}
                placeholder="Untitled"
                variant="outlined"
                fullWidth
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-input": { padding: 0 },
                  "& .MuiOutlinedInput-notchedOutline": { border: "unset " },
                  "& .MuiOutlinedInput-root": {
                    fontSize: "2.5rem",
                    fontWeight: "700",
                  },
                  input: {
                    color: "#969696",
                    "&::placeholder": {
                      opacity: 1,
                    },
                  },
                  marginBottom: "10px",
                }}
              />
              <InputLabel
                id="demo-customized-select-label"
                style={{ color: "#969696", paddingTop: "2rem" }}
              >
                Topics
              </InputLabel>
              <>
                {/* <select className='dark:bg-neutral-900 dark:text-neutral-400 selector' name="color" onChange={handleChange}>
                {
                  topics &&
                  topics.length > 0 && topics.map((topic) => (
                    <option style={{
                      background: topic.color,
                    }} value={topic.color} key={topic._id}>{topic.name}</option>
                  ))
                }
              </select>*/}
              </>
              <Select
                name="color"
                value={data?.color}
                onChange={(event) => {
                  handleChange(event);
                  const selectedTopic = scheduleTopic
                    ? scheduleTopic.find(
                        (topic) => topic.color === event.target.value
                      )
                    : topics.find(
                        (topic) => topic.color === event.target.value
                      );
                  if (selectedTopic) {
                    setData({
                      ...data,
                      title: selectedTopic.name,
                      color: selectedTopic.color,
                    });
                  }
                }}
                input={<BootstrapInput />}
              >
                <MenuItem
                  sx={{
                    background: "black",
                    color: "white",
                    "&:hover": {
                      background: "black",
                      opacity: 0.8,
                    },
                  }}
                  value={""}
                >
                  None
                </MenuItem>
                {scheduleTopic
                  ? scheduleTopic &&
                    scheduleTopic.length > 0 &&
                    scheduleTopic.map((topic) => (
                      <MenuItem
                        sx={{
                          background: topic.color,
                          "&:hover": {
                            background: topic.color,
                            opacity: 0.8,
                          },
                        }}
                        key={topic._id}
                        value={topic.color}
                      >
                        {topic.name}
                      </MenuItem>
                    ))
                  : topics &&
                    topics.length > 0 &&
                    topics.map((topic) => (
                      <MenuItem
                        sx={{
                          background: topic.color,
                          "&:hover": {
                            background: topic.color,
                            opacity: 0.8,
                          },
                        }}
                        key={topic._id}
                        value={topic.color}
                      >
                        {topic.name}
                      </MenuItem>
                    ))}
              </Select>

              <Divider sx={{ margin: "1.5rem 0" }} />
              <Box>
                <Button
                  onClick={handleCreate}
                  autoFocus
                  sx={{
                    position: "absolute",
                    bottom: "16px",
                    right: "16px",
                  }}
                >
                  Create
                </Button>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default CalenderModal;
