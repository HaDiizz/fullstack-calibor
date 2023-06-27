import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Button,
  IconButton,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';
import {
  lineAuthToken,
  lineRevoke,
  postLineToken,
} from '../redux/actions/authAction';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);
  const [lineToken, setLineToken] = useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSaveLineToken = async () => {
    await dispatch(postLineToken(lineToken, auth.token));
  };

  useEffect(() => {
    if (code) {
      async function authLine() {
        const formData = {
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: import.meta.env.VITE_REDIRECT_URL,
          client_id: import.meta.env.VITE_CLIENT_ID,
          client_secret: import.meta.env.VITE_SECRET_ID,
        };
        const res = await dispatch(lineAuthToken(formData, auth.token));
        if (res?.status === 'OK') {
          navigate('/profile');
        }
      }
      authLine();
    }
  }, []);

  return (
    <div>
      <h1 className='pt-5 pb-[4rem] text-6xl uppercase mb-10 font-bold from-indigo-600 via-pink-500 to-violet-600 bg-gradient-to-b bg-clip-text text-transparent'>
        {t('profile')}
      </h1>
      <Grid>
        <Grid
          item
          sm={12}
          xs={12}
          md={12}
          lg={12}
          className='pb-[5rem] flex justify-center'
        >
          <img
            className='supper-avatar'
            src={auth.user.avatar}
            alt='avatar'
            referrerPolicy='no-referrer'
          />
        </Grid>
        <Grid
          container
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          className='p-10 rounded-lg border-gray-400 border-2 sm:space-y-7 xs:space-y-7 md:space-y-0 lg:space-y-0'
        >
          <Grid className='p-3' item sm={12} xs={12} md={4} lg={4}>
            <span>Email: </span>
            <h1>{auth.user.email}</h1>
          </Grid>
          <Grid className='p-3' item sm={12} xs={12} md={4} lg={4}>
            <span>Username: </span>
            <h1>{auth.user.name}</h1>
          </Grid>
          <Grid className='p-3' item sm={12} xs={12} md={4} lg={4}>
            {/* <OutlinedInput
              id='outlined-adornment-password'
              name='lineToken'
              onChange={(e) => setLineToken(e.target.value)}
              placeholder='Line Token'
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    color='primary'
                    aria-label='toggle password visibility'
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge='end'
                  >
                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </IconButton>
                </InputAdornment>
              }
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-input': { padding: '8px' },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: '1px solid white',
                },
                '& .MuiOutlinedInput-root': {
                  fontSize: '1.5rem',
                  fontWeight: '700',
                },
                input: {
                  color: '#969696',
                  '&::placeholder': {
                    opacity: 1,
                  },
                },
                marginBottom: '10px',
              }}
            /> */}
            <FormHelperText
              className='dark:text-white'
              id='filled-weight-helper-text'
            >
              {auth.user?.lineToken === ''
                ? `No line token`
                : `Your token is ${
                    auth.user?.lineToken.substring(0, 5) +
                    '...'
                  }`}
            </FormHelperText>
            {/* <div className='pt-5'>
              <Button onClick={handleSaveLineToken}>Add Token</Button>
            </div> */}
            <div className='pt-5'>
              {auth?.user?.lineToken === '' ? (
                <a
                  href={`https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=${
                    import.meta.env.VITE_CLIENT_ID
                  }&redirect_uri=${
                    import.meta.env.VITE_REDIRECT_URL
                  }&scope=notify&state=${import.meta.env.VITE_SECRET_ID}`}
                >
                  {t('get_notify')} <span className='text-green-500'>LINE Notify</span>
                </a>
              ) : (
                <button className='text-red-500' onClick={async () => {
                  const res = await dispatch(lineRevoke(auth.token))
                  if(res?.status === 'OK') {
                    dispatch({ type: 'UPDATE_LINE_TOKEN', payload: '' })
                  }
                }}>
                  {t('cancel_notify')} LINE Notify
                </button>
              )}
            </div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;
