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
import { getSearchGroup } from "../helpers/getData";
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
import ReactQuill from "react-quill";
import {
  createScheduleGroup,
  getSchedule,
  joinGroup,
} from "../redux/actions/scheduleAction";

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

export default function GroupModal({ isOpenModal, handleCloseModal }) {
  const dispatch = useDispatch();
  const { auth, groups } = useSelector((state) => state);
  const { theme } = useSelector((state) => state.theme);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [group, setGroup] = React.useState([]);
  const [value, setValue] = React.useState("1");
  const [name, setName] = React.useState("");
  const [link, setLink] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [imagePreview, setImagePreview] = React.useState(null);
  const [image, setImage] = React.useState(null);
  const [error, setError] = React.useState("");
  const editorWrapperRef = React.useRef();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toolbarOptions = [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["image", "video"],
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png"];
    if (file && allowedTypes.includes(file.type)) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size should be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImage(reader.result);
      };
      setImagePreview(file);
      setError("");
    } else {
      setError("Invalid file type. Please select a JPEG or PNG image.");
    }
  };

  const handleSubmit = async () => {
    if (!name || !image) return;
    await dispatch(
      createScheduleGroup({ name, description, image, link }, auth.token)
    );
    await dispatch(getSchedule(auth.token));
    await handleCloseModal();
  };

  React.useEffect(() => {
    setLoading(true);
    if (!search) return;
    getSearchGroup(`group?code=${search}`, auth.token).then((res) => {
      setGroup(res.data.group);
      setLoading(false);
    });
  }, [search]);

  const handleJoinGroup = async (groupId) => {
    await dispatch(joinGroup({ groupId, id: auth.user._id }, auth.token));
    await setSearch("");
    await dispatch(getSchedule(auth.token));
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
        fullWidth={true}
        maxWidth={"md"}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleCloseModal}
          className="dark:bg-neutral-800 dark:text-white"
        >
          Groups
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
                <Tab
                  className="dark:text-white"
                  label="Create Group"
                  value="1"
                />
                <Tab className="dark:text-white" label="Search" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    height: "100%",
                    flexDirection: "column",
                    padding: "2rem 2rem 5rem",
                  }}
                >
                  <div className="mb-5 h-24 cursor-pointer relative flex justify-center items-center border-2 rounded-md dark:bg-neutral-900 dark:text-white">
                    <input
                      type="file"
                      name="file"
                      onChange={handleImageUpload}
                      className="z-20 opacity-0 cursor-pointer h-full w-full"
                      required
                      accept="image/*"
                    />
                    <div className="absolute flex justify-center items-center gap-2">
                      <img
                        className={`h-10 w-10 rounded-full ${
                          imagePreview ? "opacity-1" : "opacity-0"
                        }`}
                        src={
                          imagePreview ? URL.createObjectURL(imagePreview) : ""
                        }
                      />
                      <span className="text-[18px] w-56 truncate">
                        {imagePreview ? imagePreview.name : "Choose image"}
                      </span>
                    </div>
                  </div>
                  {error && (
                    <div
                      className="pb-5 text-sm font-bold"
                      style={{ color: "red" }}
                    >
                      {error}
                    </div>
                  )}
                  <div className="pt-10 pb-10">
                    <label htmlFor="">Group Name</label>
                    <br />
                    <br />
                    <TextField
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Untitled"
                      variant="outlined"
                      fullWidth
                      name="name"
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
                  </div>
                  <div className="pt-5 pb-10">
                    <label htmlFor="">URL Link</label>
                    <br />
                    <br />
                    <TextField
                      placeholder="Link (https://example.com)"
                      variant="outlined"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      name="link"
                      fullWidth
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
                  </div>
                  <div className="pt-5 pb-10">
                    <label htmlFor="">Description</label>
                    <br />
                    <br />
                    <TextField
                      placeholder="Description"
                      variant="outlined"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      name="description"
                      fullWidth
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
                  </div>
                </Box>
              </Box>
            </TabPanel>
            <TabPanel value="2">
              <Box
                component="form"
                sx={{ "& > :not(style)": { m: 1 } }}
                noValidate
                autoComplete="off"
              >
                <StyledFormControl>
                  <TextField
                    name="code"
                    placeholder="Search by code"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
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
                {search && group?.length > 0
                  ? group?.map((item) => (
                      // user._id !== groupUser._id &&
                      <div className="col-md-12" key={item._id}>
                        <ListItem>
                          <Grid container className="pb-4">
                            <ListItemAvatar>
                              <Avatar alt="Profile Picture" src={item.image} />
                            </ListItemAvatar>
                            <ListItemText
                              className="dark:text-white"
                              primary={item.name}
                              secondary={
                                <span className="dark:text-white">
                                  {item.members.length} members
                                </span>
                              }
                            />
                            {(item.user !== auth.user._id ||
                              item.members.includes(auth.user._id)) && (
                              <AiOutlinePlus
                                onClick={() => handleJoinGroup(item._id)}
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
                        group Not found
                      </h3>
                    )}
                {loading && search !== "" && (
                  <div className="text-center pt-[5rem]">
                    <span className="pt-2 tracking-widest uppercase">
                      Searching...
                    </span>
                  </div>
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
          {value === "1" && (
            <Button autoFocus onClick={handleSubmit} sx={{ color: "#03a9f4" }}>
              Save
            </Button>
          )}
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
