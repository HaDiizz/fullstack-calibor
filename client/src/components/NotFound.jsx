import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="not-found">
      <h1 className='text-indigo-700 font-semibold'>404 Not Found</h1>
      <p>The page you requested could not be found.</p>
      <Link className='text-indigo-500 mb-5' to="/">Go back to the homepage</Link>
    </div>
  );
}

export default NotFound;