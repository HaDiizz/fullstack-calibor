import React from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Person2Icon from '@mui/icons-material/Person2';
import EmailIcon from '@mui/icons-material/Email';
import Badge from '@mui/material/Badge';
import { useTranslation } from 'react-i18next';

const SidebarItems = ({ open }) => {
  const { t } = useTranslation();
  const dataItems = [
    {
      name: t('home'),
      link: '/',
      icon: <HomeIcon />,
    },
    {
      name: t('my_schedule'),
      link: '/schedule',
      icon: <CalendarMonthIcon />,
    },
    // {
    //   name: 'Notification',
    //   link: '/request',
    //   icon: (
    //     <Badge badgeContent={4} color='secondary' className='animate-pulse'>
    //       <EmailIcon/>
    //     </Badge>
    //   ),
    // },
    {
      name: t('profile'),
      link: '/profile',
      icon: <Person2Icon />,
    },
  ];
  return (
    <>
      {dataItems.map((item, index) => (
        <ListItem key={index} disablePadding sx={{ display: 'block' }}>
          <Link to={item.link} style={{ textDecoration: 'none' }}>
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
                primary={item.name}
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </Link>
        </ListItem>
      ))}
    </>
  );
};

export default SidebarItems;
