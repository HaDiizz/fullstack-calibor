import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Divider,
  TextField,
  IconButton,
  Card,
} from "@mui/material";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutline";
import { useSelector, useDispatch } from "react-redux";
import {
  createSection,
  deleteSection,
  updateSection,
} from "../redux/actions/sectionAction";
import SimpleBar from "simplebar-react";
import { createTask, updateTaskPosition } from "../redux/actions/taskAction";
import TaskModal from "./TaskModal";

let timer;
const timeout = 500;

const Kanban = ({ sections, borderId, boardUser }) => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);
  const [data, setData] = useState([]);
  const [selectedTask, setSelectedTask] = useState(undefined);

  useEffect(() => {
    setData(sections);
  }, [sections]);

  const onDragEnd = async ({ source, destination }) => {
    if (!destination) return;
    const sourceColIndex = data.findIndex((e) => e._id === source.droppableId);
    const destinationColIndex = data.findIndex(
      (e) => e._id === destination.droppableId
    );
    const sourceCol = data[sourceColIndex];
    const destinationCol = data[destinationColIndex];

    const sourceSectionId = sourceCol._id;
    const destinationSectionId = destinationCol._id;

    const sourceTasks = [...sourceCol.tasks];
    const destinationTasks = [...destinationCol.tasks];

    if (source.droppableId !== destination.droppableId) {
      const [removed] = sourceTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      data[sourceColIndex].tasks = sourceTasks;
      data[destinationColIndex].tasks = destinationTasks;
    } else {
      const [removed] = destinationTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      data[destinationColIndex].tasks = destinationTasks;
    }

    try {
      await dispatch(
        updateTaskPosition(
          {
            resourceList: sourceTasks,
            destinationList: destinationTasks,
            resourceSectionId: sourceSectionId,
            destinationSectionId: destinationSectionId,
          },
          auth.token
        )
      );
      setData(data);
    } catch (err) {
      alert(err);
    }
  };

  const handleCreateSection = async () => {
    try {
      const section = await dispatch(createSection(borderId, auth.token));
      setData([...data, section]);
    } catch (err) {
      alert(err);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      await dispatch(deleteSection(sectionId, auth.token));
      const newData = [...data].filter((e) => e._id !== sectionId);
      setData(newData);
    } catch (err) {
      alert(err);
    }
  };

  const onChangeUpdateTitle = async (e, sectionId) => {
    e.preventDefault();
    clearTimeout(timer);
    const newTitle = e.target.value;
    const newData = [...data];
    const index = newData.findIndex((e) => e._id === sectionId);
    newData[index].title = newTitle;
    setData(newData);
    timer = setTimeout(async () => {
      try {
        await dispatch(
          updateSection({ id: sectionId, title: newTitle }, auth.token)
        );
      } catch (err) {
        alert(err);
      }
    }, timeout);
  };

  const handleCreateTask = async (sectionId) => {
    try {
      const task = await dispatch(
        createTask({ sectionId, id: borderId }, auth.token)
      );
      const newData = [...data];
      const index = newData.findIndex((e) => e._id === sectionId);
      newData[index].tasks.unshift(task);
      setData(newData);
    } catch (err) {
      alert(err);
    }
  };

  const onUpdateTask = (task) => {
    const newData = [...data];
    const sectionIndex = newData.findIndex((e) => e._id === task.section._id);
    const taskIndex = newData[sectionIndex].tasks.findIndex(
      (e) => e._id === task._id
    );
    newData[sectionIndex].tasks[taskIndex] = task;
    setData(newData);
  };

  const onDeleteTask = (task) => {
    const newData = [...data];
    const sectionIndex = newData.findIndex((e) => e._id === task.section._id);
    const taskIndex = newData[sectionIndex].tasks.findIndex(
      (e) => e._id === task._id
    );
    newData[sectionIndex].tasks.splice(taskIndex, 1);
    setData(newData);
  };

  return (
    <>
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {auth.user._id === boardUser._id ? (
            <Button onClick={handleCreateSection}>Add Section</Button>
          ) : (
            <div></div>
          )}
          <Typography variant="body2" fontWeight={"700"}>
            {data.length} Sections
          </Typography>
        </Box>
      </Box>
      <Divider
        sx={{ margin: "10px 0", background: "#626262", opacity: "0.2" }}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <SimpleBar forceVisible="x">
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              width: "calc(100vw - 400px)",
              // overflowX: 'auto',
            }}
          >
            {data.length > 0 &&
              data.map((section) => (
                <div key={section._id} style={{ width: "300px" }}>
                  <Droppable key={section._id} droppableId={section._id}>
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                          width: "300px",
                          padding: "10px",
                          marginRight: "10px",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "10px",
                          }}
                        >
                          <TextField
                            value={section.title}
                            placeholder="Untitled"
                            variant="outlined"
                            onChange={(e) =>
                              onChangeUpdateTitle(e, section._id)
                            }
                            sx={{
                              flexGrow: 1,
                              "& .MuiOutlinedInput-input": { padding: 0 },
                              "& .MuiOutlinedInput-notchedOutline": {
                                border: "unset",
                              },
                              "& .MuiOutlinedInput-root": {
                                fontSize: "1rem",
                                fontWeight: "700",
                              },
                              input: {
                                color: "#969696",
                                "&::placeholder": {
                                  opacity: 1,
                                },
                              },
                            }}
                          />
                          <IconButton
                            variant="outlined"
                            size="small"
                            onClick={() => handleCreateTask(section._id)}
                            sx={{
                              color: "gray",
                              "&:hover": {
                                color: "green",
                              },
                            }}
                          >
                            <AddOutlinedIcon />
                          </IconButton>
                          {auth.user._id === boardUser?._id && (
                            <IconButton
                              variant="outlined"
                              size="small"
                              sx={{
                                color: "gray",
                                "&:hover": {
                                  color: "red",
                                },
                              }}
                              onClick={() => handleDeleteSection(section._id)}
                            >
                              <DeleteOutlinedIcon />
                            </IconButton>
                          )}
                        </Box>
                        {/* Tasks */}
                        {section?.tasks.map((task, index) => (
                          <Draggable
                            key={task?._id}
                            draggableId={task?._id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <Card
                                className="dark:bg-neutral-800 dark:text-white"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  padding: "10px",
                                  marginBottom: "10px",
                                  cursor: snapshot.isDragging
                                    ? "grab"
                                    : "pointer!important",
                                }}
                                onClick={() => setSelectedTask(task)}
                              >
                                <div className="flex gap-x-3 pb-2 pt-2">
                                  <img
                                    className="small-avatar"
                                    src={task.user.avatar}
                                    alt=""
                                    referrerPolicy="no-referrer"
                                  />
                                  <span className="text-[14px] text-gray-500">
                                    {task.user.username}
                                  </span>
                                </div>
                                <Divider
                                  sx={{
                                    margin: "10px 0",
                                    background: "#626262",
                                    opacity: "0.2",
                                  }}
                                />
                                <Typography className="pt-2">
                                  {task.title === "" ? "Untitled" : task.title}
                                </Typography>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </div>
              ))}
          </Box>
        </SimpleBar>
      </DragDropContext>
      <TaskModal
        task={selectedTask}
        borderId={borderId}
        onClose={() => setSelectedTask(undefined)}
        onUpdate={onUpdateTask}
        onDelete={onDeleteTask}
      />
    </>
  );
};

export default Kanban;
