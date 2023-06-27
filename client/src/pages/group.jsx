import React, { useCallback, useEffect, useState } from "react";
import { Calendar } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import {
  Box,
  Button,
  Card,
  Grid,
  TextField,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import CalenderModal from "../components/CalenderModal";
import MemberModal from "../components/MemberModal";
import { useSelector, useDispatch } from "react-redux";
import { SketchPicker } from "react-color";
import { MdRemoveCircle } from "react-icons/md";
import moment from "moment";
import DeleteEventModal from "../components/DeleteEventModal";
import SimpleBar from "simplebar-react";
import {
  createSchedule,
  createScheduleEvent,
  deleteGroup,
  deleteSchedule,
  deleteScheduleTopic,
  getSchedule,
  getScheduleCurrentMonth,
  getScheduleEvents,
  getScheduleEventsTopic,
  getScheduleGroup,
  leaveGroup,
  updateGroup,
  updateImageGroup,
  updateSchedule,
} from "../redux/actions/scheduleAction";
import { useNavigate, useParams } from "react-router-dom";
import { AiFillCopy, AiTwotoneEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import { FiLogOut } from "react-icons/fi";
import { GoLinkExternal } from "react-icons/go";
import ConfirmModal from "../components/ConfirmModal";

let timer;
const timeOut = 500;

const Group = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const currentDay = moment(new Date()).format("DD/MM/YYYY");
  const { auth, events, topics, works, groups } = useSelector((state) => state);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [group, setGroup] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMemberModal, setIsOpenMemberModal] = useState(false);
  const [isPick, setIsPick] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [eventName, setEventName] = useState("");
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [formatCurrentMonth, setFormatCurrentMonth] = useState("");
  const [workList, setWorkList] = useState([]);
  const [color, setColor] = useState("#8C04F9");
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [option, setOption] = useState("");
  const [sketchPickerColor, setSketchPickerColor] = useState({
    r: "140",
    g: "4",
    b: "249",
    a: "1",
  });
  const [topicEvents, setTopicEvents] = useState([]);
  const { r, g, b, a } = sketchPickerColor;
  const [data, setData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    color: "",
    groupId,
    allDay: false,
  });

  useEffect(() => {
    const fetchGroup = async () => {
      const res = await dispatch(getScheduleGroup(groupId, auth.token));
      if (!res) return navigate("/");
      setGroup(res);
      setImage(res.image);
      setName(res.name);
      setLink(res.link);
      setDescription(res.description);
    };
    fetchGroup();
  }, [groupId, auth.token, isOpenConfirmModal]);

  useEffect(() => {
    const fetchTopicEvent = async () => {
      const res = await dispatch(getScheduleEventsTopic(groupId, auth.token));
      setTopicEvents(res);
    };
    dispatch(getScheduleEvents(groupId, auth.token));
    fetchTopicEvent();
    dragEvent();
  }, [groupId, auth.token]);

  const dragEvent = () => {
    let draggable = document.getElementById("external-event");
    new Draggable(draggable, {
      itemSelector: ".div-event",
      eventData: function (eventElement) {
        let id = eventElement.getAttribute("id");
        let name = eventElement.getAttribute("name");
        let color = eventElement.getAttribute("color");

        return {
          id,
          title: name,
          color,
        };
      },
    });
  };

  const handleReceive = async (info) => {
    let value = {
      id: info.draggedEl.getAttribute("id"),
      title: info.draggedEl.getAttribute("name"),
      color: info.draggedEl.getAttribute("color"),
      startDate: info.dateStr,
      endDate: moment(info.dateStr).add(+1, "days").format("YYYY-MM-DD"),
      groupId,
      allDay: info.allDay,
    };
    await dispatch(createSchedule(value, auth.token));
    await dispatch(getScheduleEvents(groupId, auth.token));
    const res = await dispatch(
      getScheduleCurrentMonth(
        { formatMonth: formatCurrentMonth, groupId },
        auth.token
      )
    );
    setWorkList(res);
  };

  const handleCreate = async () => {
    if (data?.title === "" || !data?.title) return;
    await dispatch(createSchedule(data, auth.token));
    await dispatch(getScheduleEvents(groupId, auth.token));
    const res = await dispatch(
      getScheduleCurrentMonth(
        { formatMonth: formatCurrentMonth, groupId },
        auth.token
      )
    );
    setWorkList(res);
    setData({
      ...data,
      title: "",
      color: "",
    });
    await onClose();
  };

  const handleSelect = (event) => {
    setData({
      ...data,
      startDate: event.startStr,
      endDate: event.endStr,
      allDay: true,
    });
    setIsOpen(true);
  };
  const onClose = () => {
    setIsOpen(false);
    setData({
      ...data,
      title: "",
      color: "",
    });
  };

  const handleCreateEvent = async () => {
    if (!eventName || eventName === "") return;
    await dispatch(
      createScheduleEvent({ name: eventName, color, groupId }, auth.token)
    );
    const res = await dispatch(getScheduleEventsTopic(groupId, auth.token));
    setTopicEvents(res);
    setEventName("");
  };
  const handleDeleteTopicEvent = async (id) => {
    await dispatch(deleteScheduleTopic(id, auth.token));
    const res = await dispatch(getScheduleEventsTopic(groupId, auth.token));
    setTopicEvents(res);
  };
  const currentMonth = async (info) => {
    const { currentDate } = info.view.calendar.currentDataManager.data;
    const formatMonth = moment(currentDate).format("M");
    setFormatCurrentMonth(formatMonth);
    const res = await dispatch(
      getScheduleCurrentMonth({ formatMonth, groupId }, auth.token)
    );
    setWorkList(res);
  };
  const handleEventChange = async (info) => {
    const { startStr, endStr, allDay } = info.event;
    const { _id } = info.event._def.extendedProps;
    const values = {
      start: startStr,
      end: endStr,
      allDay,
    };
    await dispatch(updateSchedule(values, _id, auth.token));
    const res = await dispatch(
      getScheduleCurrentMonth(
        { formatMonth: formatCurrentMonth, groupId },
        auth.token
      )
    );
    setWorkList(res);
  };
  const handleClick = (info) => {
    setIsOpenDeleteModal(!isOpenDeleteModal);
    const id = info.event._def.extendedProps._id;
    const topic = info.event._def.title;
    setId(id);
    setTitle(topic);
  };

  const handleDeleteModal = async () => {
    await dispatch(deleteSchedule(id, auth.token));
    await dispatch(getScheduleEvents(groupId, auth.token));
    const updateWorkList = workList.filter((item) => item._id !== id);
    setWorkList(updateWorkList);
    setIsOpenDeleteModal(false);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(group?.code);
    toast.success(`Copied to clipboard.`, {
      id: "code",
    });
  };

  const handleSelectImage = (event) => {
    const file = event.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png"];
    if (file && allowedTypes.includes(file.type)) {
      if (file.size > 2 * 1024 * 1024) {
        dispatch({
          type: "ALERT",
          payload: { error: "Image size should be less than 2MB." },
        });
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        setImage(reader.result);
        await dispatch(
          updateImageGroup(
            { image: reader.result, code: group?.code },
            groupId,
            auth.token
          )
        );
        await dispatch(getSchedule(auth.token));
      };
      setImagePreview(file);
    } else {
      dispatch({
        type: "ALERT",
        payload: {
          error: "Invalid file type. Please select a JPEG or PNG image.",
        },
      });
      return;
    }
  };
  const deleteImage = () => {
    setImage(null);
  };

  const updateDescription = (e) => {
    clearTimeout(timer);
    const newDescription = e.target.value;
    setDescription(newDescription);

    timer = setTimeout(async () => {
      try {
        await dispatch(
          updateGroup({ groupId, description: newDescription }, auth.token)
        );
      } catch (err) {
        alert(err);
      }
    }, timeOut);
  };

  const updateLink = (e) => {
    clearTimeout(timer);
    const newLink = e.target.value;
    setLink(newLink);

    timer = setTimeout(async () => {
      try {
        await dispatch(updateGroup({ groupId, link: newLink }, auth.token));
      } catch (err) {
        alert(err);
      }
    }, timeOut);
  };

  const updateName = (e) => {
    clearTimeout(timer);
    const newName = e.target.value;
    setName(newName);

    timer = setTimeout(async () => {
      try {
        await dispatch(updateGroup({ groupId, name: newName }, auth.token));
      } catch (err) {
        alert(err);
      }
    }, timeOut);
  };

  const FullCalendarComponent = useCallback(
    () => (
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        headerToolbar={{
          left: "prev next today",
          center: "title",
          // right: "dayGridMonth",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={works}
        selectable={true}
        select={handleSelect}
        drop={handleReceive}
        datesSet={currentMonth}
        editable={true}
        eventChange={handleEventChange}
        eventClick={handleClick}
        initialView="dayGridMonth"
      />
    ),
    [
      groupId,
      works,
      isOpenDeleteModal
      // handleClick,
      // handleSelect,
      // handleReceive,
      // currentMonth,
      // handleEventChange,
      // dayGridPlugin,
      // interactionPlugin,
      // timeGridPlugin,
    ]
  );

  const handleActionGroup = (info) => {
    setIsOpenConfirmModal(!isOpenConfirmModal);
    setOption(info);
  };

  const handleGroup = async () => {
    if (option === "delete") {
      await dispatch(deleteGroup(groupId, auth.token));
    } else if (option === "leave") {
      await dispatch(leaveGroup(auth.user._id, groupId, auth.token));
    }
    await dispatch(getSchedule(auth.token));
    setIsOpenConfirmModal(false);
  };

  return (
    <>
      <Toaster />
      <ConfirmModal
        isOpenModal={isOpenConfirmModal}
        setIsOpenModal={setIsOpenConfirmModal}
        handleClick={handleGroup}
        title={name}
        description={`Do you want to ${option}`}
      />
      <MemberModal
        isOpenModal={isOpenMemberModal}
        handleCloseModal={() => setIsOpenMemberModal(false)}
        group={group}
        setGroup={setGroup}
      />
      <DeleteEventModal
        isOpenDeleteModal={isOpenDeleteModal}
        setIsOpenDeleteModal={setIsOpenDeleteModal}
        onDelete={handleDeleteModal}
        title={title}
      />
      <CalenderModal
        isOpen={isOpen}
        onClose={onClose}
        data={data}
        setData={setData}
        handleCreate={handleCreate}
        scheduleTopic={topicEvents}
      />
      <Grid container spacing={2} className="pb-5">
        <Grid
          item
          xs={12}
          sm={12}
          md={2}
          lg={2}
          className="flex flex-col justify-center text-center"
        >
          <div className="upload">
            <input
              style={{ display: image ? "none" : "block" }}
              className="dark:before:bg-black before:bg-white"
              type="file"
              name="file"
              id={image ? "file" : "file_up"}
              onChange={handleSelectImage}
              multiple
              accept="image/*"
            />

            {image && (
              <div id="file_img">
                <div className="file_img">
                  <img
                    src={image ? image : URL.createObjectURL(imagePreview)}
                    alt="logo"
                    className="img-thumbnail rounded"
                  />
                  {auth.user._id === group?.user && (
                    <span className="delete-btn" onClick={() => deleteImage()}>
                      X
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </Grid>
        <Grid item xs={12} sm={12} md={10} lg={10}>
          <div className="dark:bg-neutral-950 bg-slate-100 p-5 rounded-md space-y-7 shadow-lg">
            <div className="flex justify-between">
              <TextField
                disabled={auth.user._id === group?.user && false}
                value={name}
                placeholder="Untitled"
                variant="outlined"
                fullWidth
                onChange={updateName}
                InputProps={{
                  sx: {
                    "& .MuiOutlinedInput-input": {
                      padding: 0,
                      background:
                        "linear-gradient(to right, purple, pink, blue)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontSize: "3rem",
                      fontWeight: "bold",
                    },
                    "& .MuiOutlinedInput-notchedOutline": { border: "unset" },
                    color: "#7c7c7c",
                  },
                }}
                InputLabelProps={{
                  sx: {
                    color: "#7c7c7c",
                    fontSize: "2rem",
                    fontWeight: "bold",
                    opacity: 1,
                  },
                }}
              />
              <Box>
                {auth.user._id === group?.user ? (
                  <IconButton
                    variant="outlined"
                    color="error"
                    onClick={() => handleActionGroup("delete")}
                  >
                    <MdDelete
                      className="text-red-500 cursor-pointer"
                      size={20}
                    />
                  </IconButton>
                ) : (
                  <IconButton
                    variant="outlined"
                    color="error"
                    onClick={() => handleActionGroup("leave")}
                  >
                    <FiLogOut
                      className="text-red-500 cursor-pointer"
                      size={20}
                    />
                  </IconButton>
                )}
              </Box>
            </div>
            <div className="flex space-x-6">
              <span className="flex pb-5 dark:text-neutral-500">
                # {group?.code}
              </span>
              <span>
                <AiFillCopy
                  size={20}
                  className="cursor-pointer text-sky-500"
                  onClick={() => handleCopyCode(group?.code)}
                />
              </span>
            </div>
            <div className="flex">
              <TextField
                disabled={auth.user._id !== group?.user && true}
                value={link}
                placeholder="URL Link (https://example.com)"
                variant="outlined"
                onChange={updateLink}
                sx={{
                  width: 300,
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
              <a href={link} target="_blank">
                <GoLinkExternal
                  className="mt-4 dark:text-white text-neutral-800"
                  size={15}
                />
              </a>
            </div>
            <TextField
              // disabled={auth.user._id !== group?.user && true}
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
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={2} lg={2}>
          <Grid className="mb-5">
            <button
              className="card shadow-md dark:bg-neutral-900 dark:text-white p-3 rounded-md"
              style={{ width: "100%" }}
              onClick={() => setIsOpenMemberModal(!isOpenMemberModal)}
            >
              <h1>
                Total Member :
                <span className=" pl-3 text-indigo-500">
                  {group ? group?.members?.length : 0}
                </span>
              </h1>
            </button>
          </Grid>
          <SimpleBar
            style={{ maxHeight: "calc(160vh - 240px)", width: "100%" }}
            forceVisible="y"
          >
            <Grid className="mb-5"></Grid>
            <Grid className="mb-5">
              <div className="card shadow-md dark:bg-neutral-900 dark:text-white p-3 rounded-md">
                <TextField
                  value={eventName}
                  name="name"
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Text some event..."
                  variant="outlined"
                  fullWidth
                  sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-notchedOutline": { border: "unset " },
                    input: {
                      color: "#969696",
                      "&::placeholder": {
                        opacity: 1,
                      },
                    },
                    marginBottom: "10px",
                  }}
                />
                <div
                  onClick={() => setIsPick(!isPick)}
                  style={{
                    backgroundColor: `rgba(${r},${g},${b},${a})`,
                    width: 100,
                    height: 50,
                    border: "2px solid white",
                    cursor: "pointer",
                  }}
                ></div>
                {isPick && (
                  <SketchPicker
                    className="absolute z-10"
                    onChange={(color) => {
                      setSketchPickerColor(color.rgb);
                      setColor(color.hex);
                    }}
                    color={sketchPickerColor}
                  />
                )}
                <div className="pt-5 pb-5">
                  <Button variant="contained" onClick={handleCreateEvent}>
                    Add Event
                  </Button>
                </div>
              </div>
            </Grid>
            <div className="mb-5 grid">
              <div className="card shadow-md bg-white dark:bg-neutral-900 dark:text-white p-3 space-y-6">
                <h1 className="text-2xl font-bold">Topics</h1>
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6 pb-4"
                  id="external-event"
                >
                  {topicEvents && topicEvents.length > 0 ? (
                    topicEvents?.map((topic) => (
                      <div
                        key={topic._id}
                        className="flex justify-between pr-2"
                      >
                        <div
                          style={{ background: topic.color }}
                          className="div-event rounded-md"
                          id={topic._id}
                          name={topic.name}
                          color={topic.color}
                        >
                          <div className="card shadow-md text-center p-3 cursor-pointer">
                            <h2 className="text-md font-bold text-white">
                              {topic.name.length > 17
                                ? topic.name.slice(0, 15) + "..."
                                : topic.name}
                            </h2>
                          </div>
                        </div>
                        <div className="pt-3">
                          <MdRemoveCircle
                            onClick={() => handleDeleteTopicEvent(topic._id)}
                            className="text-red-500 cursor-pointer"
                            size={20}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-center uppercase text-neutral-500">
                      - No topic -
                    </p>
                  )}
                </div>
              </div>
            </div>
            <Grid className="mb-5">
              <div className="card shadow-md bg-white dark:bg-neutral-900 dark:text-white p-3 space-y-6">
                <h1 className="text-2xl font-bold">Events</h1>
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6"
                  id="external-event"
                >
                  <Grid>
                    {workList && workList.length > 0 ? (
                      workList?.map((event, index) => (
                        <div
                          className="card shadow-md bg-white dark:bg-neutral-900 dark:text-white mb-5 p-5"
                          key={event._id}
                        >
                          <span className="p-2">
                            ({index + 1}) {event.title}
                          </span>
                          {currentDay ==
                            moment(event.start).format("DD/MM/YYYY") ||
                          (new Date() >= moment(event.start) &&
                            moment(event.end) > new Date()) ? (
                            <Chip
                              className="m-2"
                              label="Today"
                              color="success"
                            />
                          ) : (
                            <Chip
                              className="m-2"
                              color={`${
                                moment(event.end) > new Date()
                                  ? "primary"
                                  : "error"
                              }`}
                              label={moment(event.start).fromNow()}
                            />
                          )}
                          <Divider sx={{ margin: "1.5rem 0" }} />
                          <div className="flex gap-x-3 pb-2 pt-2">
                            <img
                              className="small-avatar"
                              src={event?.author?.avatar}
                              alt="avatar"
                              referrerPolicy="no-referrer"
                            />
                            <span className="text-[14px] text-gray-500">
                              {event.author?.username}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-center uppercase text-neutral-500">
                        - No event -
                      </p>
                    )}
                  </Grid>
                </div>
              </div>
            </Grid>
          </SimpleBar>
        </Grid>
        <Grid item xs={12} md={10} lg={10}>
          <FullCalendarComponent />
        </Grid>
      </Grid>
    </>
  );
};

export default Group;
