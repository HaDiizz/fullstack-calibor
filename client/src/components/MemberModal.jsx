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
import {
  createBoard,
  getOneBoard,
  inviteUserToBoard,
  removeMemberFromGroup,
} from "../redux/actions/boardAction";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import { BsSearch } from "react-icons/bs";
import InputAdornment from "@mui/material/InputAdornment";
import { getDataAPI } from "../helpers/getData";
import { Grid } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { AiOutlinePlus } from "react-icons/ai";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Chip from "@mui/material/Chip";
import { removeFromGroup } from "../redux/actions/scheduleAction";

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

export default function MemberModal({
  isOpenModal,
  handleCloseModal,
  group,
  setGroup,
}) {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState([]);

  React.useEffect(() => {
    setFilter(group?.members);
  }, [group?.members]);
  
  const handleRemoveMember = async (userId) => {
    await dispatch(removeFromGroup(userId, group?._id, auth.token));
    const removeUser = group?.members.filter((user) => user._id !== userId);
    setFilter(removeUser);
    
    const index = group?.members.findIndex((member) => member._id === userId);
    
    if (index !== -1) {
      group?.members.splice(index, 1);
    }
    return;
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearch(value);
    const filteredMembers = group?.members.filter(
      (member) =>
        member.name.toLowerCase().includes(value.toLowerCase()) ||
        member.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilter(filteredMembers);
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
        fullWidth={true}
        maxWidth={"md"}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleCloseModal}
          className="dark:bg-neutral-800 dark:text-white"
        >
          Members
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
            <StyledFormControl>
              <TextField
                name="username"
                placeholder="Search by username, full name, email"
                variant="outlined"
                value={search}
                onChange={handleSearch}
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BsSearch className="dark:text-white" />
                    </InputAdornment>
                  ),
                }}
              />
            </StyledFormControl>
          </Box>
          <Box>
            {filter && filter?.length > 0 ? (
              filter?.map((user) => (
                <div className="col-md-12" key={user._id}>
                  <ListItem>
                    <Grid container className="pb-4">
                      <ListItemAvatar>
                        <Avatar alt="Profile Picture" src={user.avatar} />
                      </ListItemAvatar>
                      <ListItemText
                        className="dark:text-white"
                        primary={user.name}
                        secondary={
                          <span className="dark:text-white">{user.email}</span>
                        }
                      />
                      {auth.user._id === group?.user && (
                        <Button
                          onClick={() => handleRemoveMember(user._id)}
                          color="error"
                        >
                          Remove from group
                        </Button>
                      )}
                    </Grid>
                  </ListItem>
                </div>
              ))
            ) : (
              <h3 className="pt-4 tracking-widest uppercase text-center">
                user Not found
              </h3>
            )}
          </Box>
        </DialogContent>
        <DialogActions className="dark:bg-neutral-900 dark:text-white">
          <Button
            autoFocus
            onClick={handleCloseModal}
            sx={{ color: "#03a9f4" }}
          >
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
