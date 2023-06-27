import React from 'react';
import { useSelector } from 'react-redux';
import DocumentationTabs from '../components/DocumentationTabs';
import Paragraph from '../components/Paragraph';
import 'simplebar-react/dist/simplebar.min.css'

const Document = () => {

  return (
    <div className='container max-w-7xl mx-auto mt-12'>
      <div className='flex flex-col items-center gap-6'>
        <Paragraph></Paragraph>
        <DocumentationTabs />
      </div>
    </div>
  );
};

export default Document;
