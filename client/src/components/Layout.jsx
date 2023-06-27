import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar children={children} />
    </>
  );
};

export default Layout;
