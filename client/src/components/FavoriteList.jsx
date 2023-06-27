import React, { useEffect, useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getFavorites, updateFavoritePosition } from '../redux/actions/favoriteAction';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FavoriteList = ({ open }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch();
  const { favorites, auth } = useSelector((state) => state);
  const [activeIndex, setActiveIndex] = useState(0);
  const location = useLocation();
  const borderId = location.pathname.split('/')[2];

  useEffect(() => {
    const getBoards = async () => {
      try {
        await dispatch(getFavorites(auth.token));
      } catch (err) {
        alert(err);
      }
    };
    getBoards();
  }, [auth.token]);

  const onDragEnd = async ({ source, destination }) => {
    const newList = [...favorites];
    const [removed] = newList.splice(source.index, 1);
    newList.splice(destination.index, 0, removed);

    const activeItem = newList.findIndex((e) => e._id === borderId);
    setActiveIndex(activeItem);
    dispatch({ type: 'GET_FAVORITES', payload: newList });

    try {
      await dispatch(updateFavoritePosition(newList, auth.token));
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    if (favorites) {
      const index = favorites.findIndex((e) => e._id === borderId);
      setActiveIndex(index);
    }
  }, [favorites, borderId]);

  return (
    <div className='pb-5'>
      <ListItem disablePadding sx={{ display: 'block' }}>
        <Box
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
            color: '#7c7c7c',
            paddingTop: '10px',
            textTransform: 'uppercase'
          }}
        >
          <ListItemText primary={t('favorites')} sx={{ opacity: open ? 1 : 0 }} />
        </Box>
      </ListItem>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          key={'list-board-droppable-key'}
          droppableId={'list-board-droppable'}
        >
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {favorites &&
                favorites.map((item, index) => (
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
                            ? 'grab'
                            : 'pointer!important',
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                          color: 'white',
                          display: 'block',
                        }}
                      >
                        <ListItemButton
                          sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                            color: 'white',
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: open ? 3 : 'auto',
                              justifyContent: 'center',
                              color: 'white',
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
    </div>
  );
};

export default FavoriteList;
