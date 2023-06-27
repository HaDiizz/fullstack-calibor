import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteBoard,
  getAllBoards,
  getOneBoard,
  leaveFromBoard,
  updateBoard,
} from "../redux/actions/boardAction";
import {
  Box,
  IconButton,
  TextField,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutline";
import EmojiPicker from "../components/EmojiPicker";
import Kanban from "../components/Kanban";
import CollaborationModal from "../components/CollaborationModal";
import ConfirmModal from "../components/ConfirmModal";

let timer;
const timeOut = 500;

const board = () => {
  const navigate = useNavigate();
  const { auth, boards, favorites } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sections, setSections] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [icon, setIcon] = useState("");
  const [boardUser, setBoardUser] = useState({});
  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const [participants, setParticipants] = React.useState([]);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [isOpenConfirmModalDelete, setIsOpenConfirmModalDelete] =
    useState(false);

  const handleOpenModal = () => setIsOpenModal(true);
  const handleCloseModal = () => setIsOpenModal(false);

  useEffect(() => {
    const getBoard = async () => {
      const res = await dispatch(getOneBoard(id, auth.token));
      if (!res) return navigate("/");
      setTitle(res.title);
      setDescription(res.description);
      setSections(res.sections);
      setIsFavorite(res.favorite);
      setIcon(res.icon);
      setBoardUser(res?.user);
      setParticipants(res.participants);
    };
    getBoard();
  }, [id, auth.token, isOpenConfirmModal]);

  const onIconChange = async (newIcon) => {
    let temp = [...boards];
    const index = temp.findIndex((e) => e._id === id);
    temp[index] = { ...temp[index], icon: newIcon };

    if (isFavorite) {
      let tempFavorite = [...favorites];
      const favoriteIndex = tempFavorite.findIndex((e) => e._id === id);
      tempFavorite[favoriteIndex] = {
        ...tempFavorite[favoriteIndex],
        icon: newIcon,
      };
      dispatch({ type: "GET_FAVORITES", payload: tempFavorite });
    }

    setIcon(newIcon);
    dispatch({ type: "GET_ALL_BOARDS", payload: temp });

    try {
      await dispatch(updateBoard({ id, icon: newIcon }, auth.token));
    } catch (err) {
      alert(err);
    }
  };

  const updateTitle = (e) => {
    clearTimeout(timer);
    const newTitle = e.target.value;
    setTitle(newTitle);

    let temp = [...boards];
    const index = temp.findIndex((e) => e._id === id);
    temp[index] = { ...temp[index], title: newTitle };

    if (isFavorite) {
      let tempFavorite = [...favorites];
      const favoriteIndex = tempFavorite.findIndex((e) => e._id === id);
      tempFavorite[favoriteIndex] = {
        ...tempFavorite[favoriteIndex],
        title: newTitle,
      };
      dispatch({ type: "GET_FAVORITES", payload: tempFavorite });
    }

    dispatch({ type: "GET_ALL_BOARDS", payload: temp });

    timer = setTimeout(async () => {
      try {
        await dispatch(updateBoard({ id, title: newTitle }, auth.token));
      } catch (err) {
        alert(err);
      }
    }, timeOut);
  };

  const updateDescription = (e) => {
    clearTimeout(timer);
    const newDescription = e.target.value;
    setDescription(newDescription);

    let temp = [...boards];
    const index = temp.findIndex((e) => e._id === id);
    temp[index] = { ...temp[index], description: newDescription };
    if (isFavorite) {
      let tempFavorite = [...favorites];
      const favoriteIndex = tempFavorite.findIndex((e) => e._id === id);
      tempFavorite[favoriteIndex] = {
        ...tempFavorite[favoriteIndex],
        description: newDescription,
      };
      dispatch({ type: "GET_FAVORITES", payload: tempFavorite });
    }
    dispatch({ type: "GET_ALL_BOARDS", payload: temp });

    timer = setTimeout(async () => {
      try {
        await dispatch(
          updateBoard({ id, description: newDescription }, auth.token)
        );
      } catch (err) {
        alert(err);
      }
    }, timeOut);
  };

  const addFavorite = async () => {
    try {
      const board = await dispatch(
        updateBoard({ id, favorite: !isFavorite }, auth.token)
      );
      let newFavoriteList = [...favorites];
      if (isFavorite) {
        newFavoriteList = newFavoriteList.filter((e) => e._id !== id);
      } else {
        newFavoriteList.unshift(board);
      }
      dispatch({ type: "GET_FAVORITES", payload: newFavoriteList });
      setIsFavorite(!isFavorite);
    } catch (err) {
      alert(err);
    }
  };

  const handleClickDeleteBoardConfirm = () => {
    setIsOpenConfirmModalDelete(!isOpenConfirmModalDelete);
  };

  const handleDeleteBoard = async () => {
    try {
      await dispatch(deleteBoard(id, auth.token));
      if (isFavorite) {
        const newFavorite = favorites.filter((e) => e._id !== id);
        dispatch({ type: "GET_FAVORITES", payload: newFavorite });
      }
      const newList = boards.filter((e) => e._id !== id);
      if (newList.length === 0) {
        navigate("/");
      } else {
        navigate(`/boards/${newList[0]._id}`);
      }
      setIsOpenConfirmModalDelete(false);
      dispatch({ type: "GET_ALL_BOARDS", payload: newList });
    } catch (err) {
      alert(err);
    }
  };

  const handleClickConfirmModal = () => {
    setIsOpenConfirmModal(!isOpenConfirmModal);
  };

  const handleLeaveGroup = async () => {
    await dispatch(
      leaveFromBoard({ boardId: id, userId: auth.user._id }, auth.token)
    );
    const res = await dispatch(getAllBoards(auth.token));
    dispatch({ type: "GET_ALL_BOARDS", payload: res });
    setIsOpenConfirmModal(false);
  };
  return (
    <div>
      <ConfirmModal
        isOpenModal={isOpenConfirmModal}
        setIsOpenModal={setIsOpenConfirmModal}
        handleClick={handleLeaveGroup}
        title={title}
        description={"Do you want to leave this"}
      />
      <ConfirmModal
        isOpenModal={isOpenConfirmModalDelete}
        setIsOpenModal={setIsOpenConfirmModalDelete}
        handleClick={handleDeleteBoard}
        title={title}
        description={"Do you want to delete"}
      />
      <CollaborationModal
        isOpenModal={isOpenModal}
        handleCloseModal={handleCloseModal}
        boardId={id}
        boardUser={boardUser}
        participants={participants}
        setParticipants={setParticipants}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: "16px",
        }}
      >
        <Box>
          <button
            className="relative p-0.5 inline-flex items-center justify-center font-bold overflow-hidden group rounded-md"
            onClick={handleOpenModal}
          >
            <span className="w-full h-full bg-gradient-to-br from-[#ff8a05] via-[#ff5478] to-[#ff00c6] group-hover:from-[#ff00c6] group-hover:via-[#ff5478] group-hover:to-[#ff8a05] absolute" />
            <span className="relative px-6 py-3 transition-all ease-out bg-gray-900 rounded-md group-hover:bg-opacity-0 duration-400">
              <span className="relative text-white">Collaborators</span>
            </span>
          </button>
        </Box>
        {auth.user._id === boardUser?._id ? (
          <Box>
            <IconButton variant="outlined" onClick={addFavorite}>
              {isFavorite ? (
                <BookmarkIcon className="text-yellow-400" />
              ) : (
                <BookmarkAddIcon className="dark:text-white" />
              )}
            </IconButton>
            <IconButton
              variant="outlined"
              color="error"
              onClick={handleClickDeleteBoardConfirm}
            >
              <DeleteOutlinedIcon />
            </IconButton>
          </Box>
        ) : (
          <Button onClick={handleClickConfirmModal} sx={{ color: "red" }}>
            Leave the group
          </Button>
        )}
      </Box>
      <Box
        sx={{
          padding: "10px 50px",
        }}
      >
        <Box>
          <EmojiPicker icon={icon} onChange={onIconChange} />
        </Box>
        <TextField
          value={title}
          placeholder="Untitled"
          variant="outlined"
          fullWidth
          onChange={updateTitle}
          sx={{
            "& .MuiOutlinedInput-input": { padding: 0 },
            "& .MuiOutlinedInput-notchedOutline": { border: "unset" },
            "& .MuiOutlinedInput-root": { fontSize: "2rem", fontWeight: "700" },
            input: {
              color: "#7c7c7c",
              "&::placeholder": {
                opacity: 1,
              },
            },
          }}
        />
        <TextField
          value={description}
          placeholder="No Description..."
          variant="outlined"
          fullWidth
          onChange={updateDescription}
          sx={{
            "& .MuiOutlinedInput-input": { padding: 2 },
            "& .MuiOutlinedInput-notchedOutline": { border: "unset" },
            "& .MuiOutlinedInput-root": {
              fontSize: "0.8rem",
            },
            input: {
              color: "#7c7c7c",
              "&::placeholder": {
                opacity: 1,
              },
            },
          }}
        />
      </Box>
      <Kanban sections={sections} borderId={id} boardUser={boardUser} />
    </div>
  );
};

export default board;
