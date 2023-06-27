import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import CalenderModal from "../components/CalenderModal";
import { useSelector, useDispatch } from "react-redux";
import {
  createCalendar,
  createEvent,
  deleteCalendarEvent,
  deleteEventsTopic,
  getCurrentMonth,
  getEventsCalendar,
  getEventsTopic,
  updateCalendarEvent,
} from "../redux/actions/calendarAction";
import { SketchPicker } from "react-color";
import { MdRemoveCircle } from "react-icons/md";
import moment from "moment";
import DeleteEventModal from "../components/DeleteEventModal";
import SimpleBar from "simplebar-react";
import { useTranslation } from "react-i18next";

const Schedule = () => {
  const { t } = useTranslation();
  const currentDay = moment(new Date()).format("DD/MM/YYYY");
  const { auth, events, topics } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isPick, setIsPick] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [eventName, setEventName] = useState("");
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [formatCurrentMonth, setFormatCurrentMonth] = useState("");
  const [eventsList, setEventsList] = useState([]);
  const [color, setColor] = useState("#8C04F9");
  const [sketchPickerColor, setSketchPickerColor] = useState({
    r: "140",
    g: "4",
    b: "249",
    a: "1",
  });
  const { r, g, b, a } = sketchPickerColor;
  const [data, setData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    color: "",
  });

  useEffect(() => {
    dispatch(getEventsCalendar(auth.token));
    dispatch(getEventsTopic(auth.token));
    dragEvent();
  }, []);

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
    };
    await dispatch(createCalendar(value, auth.token));
    await dispatch(getEventsCalendar(auth.token));
    const res = await dispatch(
      getCurrentMonth({ formatMonth: formatCurrentMonth }, auth.token)
    );
    setEventsList(res);
  };

  const handleCreate = async () => {
    if (data?.title === "" || !data?.title) return;
    await dispatch(createCalendar(data, auth.token));
    await dispatch(getEventsCalendar(auth.token));
    const res = await dispatch(
      getCurrentMonth({ formatMonth: formatCurrentMonth }, auth.token)
    );
    setEventsList(res);
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
    await dispatch(createEvent({ name: eventName, color }, auth.token));
    await dispatch(getEventsTopic(auth.token));
    setEventName("");
  };
  const handleDeleteTopicEvent = async (id) => {
    await dispatch(deleteEventsTopic(id, auth.token));
    await dispatch(getEventsTopic(auth.token));
  };
  const currentMonth = async (info) => {
    const { currentDate } = info.view.calendar.currentDataManager.data;
    const formatMonth = moment(currentDate).format("M");
    setFormatCurrentMonth(formatMonth);
    const res = await dispatch(getCurrentMonth({ formatMonth }, auth.token));
    setEventsList(res);
  };
  const handleEventChange = async (info) => {
    const { startStr, endStr } = info.event;
    const { _id } = info.event._def.extendedProps;
    const values = {
      start: startStr,
      end: endStr,
    };
    await dispatch(updateCalendarEvent(values, _id, auth.token));
  };
  const handleClick = (info) => {
    setIsOpenDeleteModal(!isOpenDeleteModal);
    const id = info.event._def.extendedProps._id;
    const topic = info.event._def.title;
    setId(id);
    setTitle(topic);
  };

  const handleDeleteModal = async () => {
    await dispatch(deleteCalendarEvent(id, auth.token));
    await dispatch(getEventsCalendar(auth.token));
    const updateEventList = eventsList.filter((item) => item._id !== id);
    setEventsList(updateEventList);
    setIsOpenDeleteModal(false);
  };

  return (
    <>
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
      />
      <h1 className="text-center text-5xl uppercase mb-10 font-bold from-purple-600 via-pink-600 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent">
        {t("my_schedule")}
      </h1>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={2} lg={2}>
          <SimpleBar
            style={{ maxHeight: "calc(160vh - 240px)", width: "100%" }}
            forceVisible="y"
          >
            <Grid className="mb-5">
              <div className="card shadow-md dark:bg-neutral-900 dark:text-white p-3 rounded-md">
                <TextField
                  value={eventName}
                  name="name"
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder={t("text_topic")}
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
                <h1 className="text-2xl font-bold">{t("topics")}</h1>
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6 pb-4"
                  id="external-event"
                >
                  {topics && topics.length > 0 ? (
                    topics?.map((topic) => (
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
                      - {t("no_topic")} -
                    </p>
                  )}
                </div>
              </div>
            </div>
            <Grid className="mb-5">
              <div className="card shadow-md bg-white dark:bg-neutral-900 dark:text-white p-3 space-y-6">
                <h1 className="text-2xl font-bold">{t("events")}</h1>
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6"
                  id="external-event"
                >
                  <Grid>
                    {eventsList && eventsList.length > 0 ? (
                      eventsList?.map((event, index) => (
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
                          {/* <Divider sx={{ margin: '1.5rem 0' }} /> */}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-center uppercase text-neutral-500">
                        - {t("no_event")} -
                      </p>
                    )}
                  </Grid>
                </div>
              </div>
            </Grid>
          </SimpleBar>
        </Grid>
        <Grid item xs={12} md={10} lg={10}>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
            headerToolbar={{
              left: "prev next today",
              center: "title",
              right: "dayGridMonth",
              // right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            events={events}
            selectable={true}
            select={handleSelect}
            drop={handleReceive}
            datesSet={currentMonth}
            editable={true}
            eventChange={handleEventChange}
            eventClick={handleClick}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Schedule;
