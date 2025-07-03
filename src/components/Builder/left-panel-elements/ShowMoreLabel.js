import React from 'react';

const ShowMoreLabel = ({ title }) => {
  return (
    <div className='flex justify-between items-center font-normal line-height-xs mb-2'>
      <span className='text-sm color-white'>{title}</span>
      <a href='#' className='text-xs font-normal color-gray-100 hover:color-gray-50 duration-200'>Show more</a>
    </div>
  );
};

export default ShowMoreLabel;
