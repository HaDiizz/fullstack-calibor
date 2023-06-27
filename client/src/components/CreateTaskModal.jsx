import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { createBoard } from "../redux/actions/boardAction";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import EmojiPicker from "./EmojiPicker";
import { useTranslation } from "react-i18next";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};
const StyledFormControl = styled(FormControl)({
  width: "100%",
  margin: "8px 0",
  paddingTop: "2rem",
});

export default function CreateTaskModal({ isOpenModal, handleCloseModal }) {
  const { t } = useTranslation()
  const { auth, boards } = useSelector((state) => state);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialState = {
    title: "",
    icon: "📋",
    description: "",
  };
  const [data, setData] = React.useState(initialState);

  const { title, icon, description } = data;

  const handleChangeIcon = (newIcon) => {
    setData((prevData) => ({
      ...prevData,
      icon: newIcon,
    }));
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleCreateBoard = async () => {
    const res = await dispatch(createBoard(data, auth.token));
    const newList = [res, ...boards];
    dispatch({ type: "GET_ALL_BOARDS", payload: newList });
    await navigate(`/boards/${res._id}`);
    await handleCloseModal();
  };
  return (
    <>
      <BootstrapDialog
        sx={{
          backdropFilter: "blur(3px)",
          backgroundColor: "rgba(0,0,30,0.4)",
        }}
        onClose={handleCloseModal}
        aria-labelledby="customized-dialog-title"
        open={isOpenModal}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleCloseModal}
          className="dark:bg-neutral-800 dark:text-white"
        >
          {t('create_board')}
        </BootstrapDialogTitle>
        <DialogContent
          sx={{ height: "60vh" }}
          dividers
          className="dark:bg-neutral-900 dark:text-white"
        >
          <Box
            component="form"
            sx={{ "& > :not(style)": { m: 1 } }}
            noValidate
            autoComplete="off"
          >
            <div className="mb-[2rem]">
              <EmojiPicker icon={icon} onChange={handleChangeIcon} />
            </div>
            <StyledFormControl>
              <TextField
                placeholder={t('title')}
                variant="outlined"
                name="title"
                onChange={handleChangeInput}
                inputProps={{
                  style: {
                    color: theme === "dark" ? "white" : "black",
                  },
                }}
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-input": { padding: 2 },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #7c7c7c ",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      border: "1px solid #7c7ccc",
                    },
                  "& .MuiOutlinedInput-root": {
                    fontSize: "1rem",
                    fontWeight: "700",
                  },
                  input: {
                    color: "#7c7c7c",
                    "&::placeholder": {
                      opacity: 1,
                    },
                  },
                  marginBottom: "10px",
                }}
              />
            </StyledFormControl>
            <StyledFormControl>
              <TextField
                placeholder={t('description')}
                variant="outlined"
                onChange={handleChangeInput}
                name="description"
                inputProps={{
                  style: {
                    color: theme === "dark" ? "white" : "black",
                  },
                }}
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-input": { padding: 2 },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #7c7c7c ",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      border: "1px solid #7c7ccc",
                    },
                  "& .MuiOutlinedInput-root": {
                    fontSize: "1rem",
                    fontWeight: "700",
                  },
                  input: {
                    color: "#7c7c7c",
                    "&::placeholder": {
                      opacity: 1,
                    },
                  },
                  marginBottom: "10px",
                }}
              />
            </StyledFormControl>
          </Box>
        </DialogContent>
        <DialogActions className="dark:bg-neutral-900 dark:text-white">
          <Button
            autoFocus
            onClick={handleCreateBoard}
            sx={{ color: "#03a9f4" }}
          >
            {t('create')}
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
