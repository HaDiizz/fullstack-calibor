import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import LogOutButton from "../components/LogOutButton";
import { useSelector, useDispatch } from "react-redux";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";

import { BsSun, BsMoonStarsFill } from "react-icons/bs";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { setTheme } from "../redux/reducers/themeReducer";
import { Link } from "react-router-dom";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import CreateTaskModal from "./CreateTaskModal";
import SidebarItems from "./SidebarItems";
import { getAllBoards, updatePosition } from "../redux/actions/boardAction";
import { useNavigate, useLocation } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import FavoriteList from "./FavoriteList";
import { getSchedule } from "../redux/actions/scheduleAction";
import { AiOutlineSchedule } from "react-icons/ai";

import GroupModal from "./GroupModal";

import i18n from "../i18n";
import { useTranslation } from "react-i18next";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "#000000",
  },
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Navbar({ children }) {
  const { t } = useTranslation();
  const themes = useTheme();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const { auth, boards, groups } = useSelector((state) => state);
  const { theme } = useSelector((state) => state.theme);
  const [isOpenDropDown, setIsOpenDropDown] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [screenWidth, setScreenWidth] = React.useState("");
  const location = useLocation();
  const borderId = location.pathname.split("/")[2];
  const [isOpenGroupModal, setIsOpenGroupModal] = React.useState(false);

  const handleOpenGroupModal = () => setIsOpenGroupModal(true);
  const handleCloseGroupModal = () => setIsOpenGroupModal(false);

  const handleOpenModal = () => setIsOpenModal(true);
  const handleCloseModal = () => setIsOpenModal(false);

  const handleToggle = () => {
    setIsOpenDropDown((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setIsOpenDropDown(false);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    const getBoards = async () => {
      try {
        const res = await dispatch(getAllBoards(auth.token));
        dispatch({ type: "GET_ALL_BOARDS", payload: res });
      } catch (err) {
        alert(err);
      }
    };
    const getFetchSchedule = async () => {
      await dispatch(getSchedule(auth.token));
    };
    getBoards();
    getFetchSchedule();
  }, [dispatch]);

  React.useEffect(() => {
    if (boards) {
      const activeItem = boards.findIndex((e) => e._id === borderId);
      // if (boards.length > 0 && id === undefined) {
      //   navigate(`/boards/${boards[0]._id}`);
      // }
      setActiveIndex(activeItem);
    }
  }, [boards, borderId]);

  React.useEffect(() => {
    setScreenWidth(window.innerWidth);
  }, []);

  const onDragEnd = async ({ source, destination }) => {
    const newList = [...boards];
    const [removed] = newList.splice(source.index, 1);
    newList.splice(destination.index, 0, removed);

    const activeItem = newList.findIndex((e) => e._id === borderId);
    setActiveIndex(activeItem);
    dispatch({ type: "GET_ALL_BOARDS", payload: newList });

    try {
      await dispatch(updatePosition(newList, auth.token));
    } catch (err) {
      alert(err);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <GroupModal
        isOpenModal={isOpenGroupModal}
        handleCloseModal={handleCloseGroupModal}
      />
      <CreateTaskModal
        isOpenModal={isOpenModal}
        handleCloseModal={handleCloseModal}
      />
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{ backgroundColor: theme === "dark" ? "black" : "#ffffff" }}
      >
        <Toolbar
          sx={{ display: "flex", justifyContent: "space-between" }}
          className={`${theme === "dark" ? "text-white" : "text-black"}`}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          {open && <div></div>}
          {/* <Typography variant='h6' noWrap component='div'>
            Tasktify Application
          </Typography> */}
          {(!open || screenWidth > 500) && (
            <div className="flex justify-center align-middle place-content-center">
              <div className="place-self-center pr-5 flex">
                <div
                  className="form-check form-switch p-3 pr-5 pt-4"
                  style={{ zIndex: "1" }}
                >
                  {theme === "dark" ? (
                    <BsMoonStarsFill
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        dispatch(setTheme(theme === "dark" ? "light" : "dark"))
                      }
                    />
                  ) : (
                    <BsSun
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        dispatch(setTheme(theme === "dark" ? "light" : "dark"))
                      }
                    />
                  )}
                </div>
                <ButtonGroup
                  ref={anchorRef}
                  aria-label="split button"
                  sx={{
                    border: "0",
                    "& button:focus": {
                      outline: "none",
                      boxShadow: "none",
                      border: "0",
                    },
                    "& button:hover": {
                      outline: "none",
                      boxShadow: "none",
                      border: "0",
                    },
                  }}
                >
                  <Button
                    sx={{
                      border: "0",
                      "& .MuiButton-root:focus": {
                        outline: "none",
                        boxShadow: "none",
                        border: "0",
                      },
                      "& .MuiButton-root:hover": {
                        outline: "none",
                        boxShadow: "none",
                        border: "0",
                      },
                    }}
                    size="small"
                    aria-controls={
                      isOpenDropDown ? "split-button-menu" : undefined
                    }
                    aria-expanded={isOpenDropDown ? "true" : undefined}
                    aria-label="select merge strategy"
                    aria-haspopup="menu"
                    onClick={handleToggle}
                  >
                    <img
                      className="medium-avatar mt-1"
                      src={
                        auth?.user?.avatar ||
                        "https://res.cloudinary.com/dmgfhwjl6/image/upload/v1680174804/senior-project/2.png"
                      }
                      alt="avatar"
                      referrerPolicy="no-referrer"
                    />
                  </Button>
                </ButtonGroup>
              </div>

              <Popper
                sx={{
                  zIndex: 1,
                  paddingTop: 2,
                  paddingLeft: 15,
                }}
                open={isOpenDropDown}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === "bottom" ? "center top" : "center bottom",
                      color: theme === "dark" ? "white" : "black",
                      backgroundColor: theme === "dark" ? "black" : "#ffffff",
                    }}
                  >
                    <Paper>
                      <div className="px-4 py-3 border-b-2">
                        <span className="block text-sm text-dark">
                          {auth.user.name}
                        </span>
                        <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                          {auth.user.email}
                        </span>
                      </div>

                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList id="split-button-menu" autoFocusItem>
                          <Link to="/document">
                            <MenuItem onClick={handleClose}>
                              {t("document")}
                            </MenuItem>
                          </Link>
                          <Link to="/rating">
                            <MenuItem onClick={handleClose}>
                              {t("rating")}
                            </MenuItem>
                          </Link>
                          <MenuItem
                            onClick={(e) => {
                              i18n.changeLanguage(
                                t("lang") === "EN" ? "th" : "en"
                              );
                              handleClose(e);
                            }}
                          >
                            <Link>
                              {t("lang_option")}:{" "}
                              <span className="text-indigo-500">
                                {t("lang")}
                              </span>
                            </Link>
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>

              <LogOutButton />
            </div>
          )}
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose} sx={{ color: "white" }}>
            {themes.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <SidebarItems open={open} />
        </List>
        <Divider className="bg-gray-500/50" />
        <List>
          {[t("create_group")].map((text) => (
            <ListItem
              key={text}
              disablePadding
              sx={{ display: "block" }}
              onClick={handleOpenGroupModal}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  color: "white",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <GroupAddIcon />
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <List>
          {groups &&
            groups.map((group) => (
              <ListItem
                disablePadding
                sx={{ display: "block" }}
                key={group._id}
              >
                <Link
                  to={`group/${group._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      color: "white",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color: "white",
                      }}
                    >
                      <img
                        src={group.image}
                        alt="thumbnail"
                        className="small-avatar"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={group.name}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
        </List>
        <Divider className="bg-gray-500/50" />
        <List>
          {[t("create_board")].map((text) => (
            <ListItem
              key={text}
              disablePadding
              sx={{ display: "block" }}
              onClick={handleOpenModal}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  color: "white",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <AddCircleIcon />
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
          <FavoriteList open={open} />
          <Divider className="bg-gray-500/50" />

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              key={"list-board-droppable-key"}
              droppableId={"list-board-droppable"}
            >
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {boards &&
                    boards.map((item, index) => (
                      <Draggable
                        key={item._id}
                        draggableId={item._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <ListItem
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            selected={index === activeIndex}
                            component={Link}
                            to={`/boards/${item._id}`}
                            disablePadding
                            sx={{
                              cursor: snapshot.isDragging
                                ? "grab"
                                : "pointer!important",
                              minWidth: 0,
                              mr: open ? 3 : "auto",
                              justifyContent: "center",
                              color: "white",
                              display: "block",
                            }}
                          >
                            <ListItemButton
                              sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                                color: "white",
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: open ? 3 : "auto",
                                  justifyContent: "center",
                                  color: "white",
                                }}
                              >
                                {item.icon}
                              </ListItemIcon>
                              <ListItemText
                                primary={item.title}
                                sx={{ opacity: open ? 1 : 0 }}
                              />
                            </ListItemButton>
                          </ListItem>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
