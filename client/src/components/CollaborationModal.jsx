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

export default function CollaborationModal({
  isOpenModal,
  handleCloseModal,
  boardId,
  boardUser,
  participants,
  setParticipants,
}) {
  const dispatch = useDispatch();
  const { auth, boards } = useSelector((state) => state);
  const { theme } = useSelector((state) => state.theme);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  React.useEffect(() => {
    setLoading(true);
    if (!search) return;
    getDataAPI(`search?username=${search}`, boardId, auth.token).then((res) => {
      setUsers(res.data.users);
      setLoading(false);
    });
  }, [search, boardId]);

  const getABoard = async () => {
    const res = await dispatch(getOneBoard(boardId, auth.token));
    await setParticipants(res?.participants);
  };

  const handleInvite = async (id) => {
    await dispatch(inviteUserToBoard({ boardId, id }, auth.token));
    await setSearch("");
    await getABoard();
  };

  const handleRemoveMember = async (id) => {
    await dispatch(
      removeMemberFromGroup({ boardId, memberId: id }, auth.token)
    );
    await getABoard();
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
          Collaborations
        </BootstrapDialogTitle>
        <DialogContent
          sx={{ height: "60vh" }}
          dividers
          className="dark:bg-neutral-900 dark:text-white"
        >
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab className="dark:text-white" label="Search" value="1" />
                <Tab className="dark:text-white" label="Members" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
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
                    onChange={(e) =>
                      setSearch(e.target.value.toLowerCase().replace(/ /g, ""))
                    }
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
                {search && users?.length > 0
                  ? users?.map((user) => (
                      // user._id !== boardUser._id &&
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
                                <span className="dark:text-white">
                                  {user.email}
                                </span>
                              }
                            />
                            {user._id !== boardUser._id && (
                              <AiOutlinePlus
                                onClick={() => handleInvite(user._id)}
                                size={20}
                                className="dark:text-white self-center cursor-pointer"
                              />
                            )}
                          </Grid>
                        </ListItem>
                      </div>
                    ))
                  : search !== "" &&
                    !loading && (
                      <h3 className="pt-4 tracking-widest uppercase text-center">
                        user Not found
                      </h3>
                    )}
                {loading && search !== "" && (
                  <div className="text-center pt-[5rem]">
                    {/* <Loading type="points" /> */}
                    <span className="pt-2 tracking-widest uppercase">
                      Searching...
                    </span>
                  </div>
                )}
              </Box>
            </TabPanel>
            <TabPanel value="2">
              <Box>
                {boardUser?._id && (
                  <>
                    <ListItem>
                      <Grid container className="pb-4">
                        <ListItemAvatar>
                          <Avatar
                            alt="Profile Picture"
                            src={boardUser?.avatar}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          className="dark:text-white"
                          primary={boardUser?.name}
                          secondary={
                            <span className="dark:text-white">
                              {boardUser?.email}
                            </span>
                          }
                        />
                        <Chip label="ADMIN" color="error" />
                      </Grid>
                    </ListItem>
                  </>
                )}
                {participants?.length > 0 ? (
                  participants?.map((user) => (
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
                              <span className="dark:text-white">
                                {user.email}
                              </span>
                            }
                          />
                          {auth.user._id === boardUser?._id && (
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
            </TabPanel>
          </TabContext>
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
