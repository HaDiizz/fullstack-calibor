import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import 'simplebar-react/dist/simplebar.min.css';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CreateTaskModal from '../components/CreateTaskModal';
import { Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { getCurrentDate } from '../redux/actions/calendarAction';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const Home = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);
  const { theme } = useSelector((state) => state.theme);
  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const [activities, setActivities] = useState([]);
  const { t } = useTranslation()

  // const useStyles = makeStyles({
  //   root: {
  //     maxWidth: 345,
  //     margin: 'auto',
  //   },
  //   cardContent: {
  //     color: theme === 'dark' ? '#ffffff' : '#373737',
  //     textAlign: 'center',
  //     backgroundColor: theme === 'dark' ? '#2f2f2f' : '#fff',
  //     borderRadius: '2rem',
  //   },
  // });

  // const classes = useStyles();

  const handleOpenModal = () => setIsOpenModal(true);
  const handleCloseModal = () => setIsOpenModal(false);

  useEffect(() => {
    async function loadDataActivities() {
      const res = await dispatch(getCurrentDate(auth.token));
      setActivities(res);
    }
    loadDataActivities();
  }, []);

  return (
    <div className='container max-w-7xl mx-auto mt-12'>
      <CreateTaskModal
        isOpenModal={isOpenModal}
        handleCloseModal={handleCloseModal}
      />
      <div className='flex flex-col items-center gap-6'>
        <div className='max-w-7xl mx-auto'>
          <div className='relative group'>
            <div className='absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse' />
            <div
              onClick={handleOpenModal}
              className='cursor-pointer relative px-7 py-6 bg-white dark:bg-neutral-950 ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6'
            >
              <AddCircleOutlineIcon
                className='text-indigo-500 animate-bounce'
                style={{ fontSize: '1.8rem' }}
              />
              <div className='space-y-2'>
                <h1 className='text-slate-800 dark:text-white text-4xl'>
                  {t('make_own_board')}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h1 className='pt-[5rem] pb-10 uppercase text-3xl font-bold from-purple-500 via-pink-600 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent'>
        {t('today_plan')}
      </h1>
      <Divider
        sx={{ margin: '10px 0', background: '#626262', opacity: '0.2' }}
      />
      <Grid className='pt-5' container justifyContent='center' spacing={5}>
        {activities.length > 0 &&
          activities.map((item) => (
            <Grid key={item._id} item xs={12} sm={10} md={4} lg={4}>
              <Link to={`/schedule`}>
                <div className='shadow-lg rounded-md cards dark:bg-neutral-800 transform transition duration-500 hover:scale-110 hover:text-indigo-500'>
                  <div className='p-5 text-center'>
                    <Typography variant='h5' component='h2' gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant='body1' component='p'>
                      {moment(item.start).format('DD/MM/YY')} -{' '}
                      {moment(item.end).format('DD/MM/YY')}
                    </Typography>
                  </div>
                </div>
              </Link>
            </Grid>
          ))}
        {activities.length === 0 && (
          <div className='pt-[4rem]'>
            <h1 className='uppercase text-neutral-500'>- No data -</h1>
          </div>
        )}
      </Grid>
    </div>
  );
};

export default Home;
