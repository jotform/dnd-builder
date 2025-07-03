import React from 'react';

const Searchbox = ({ type }) => {
  return (
    <input type="text" placeholder={`Search ${type}`} className='w-full bg-gray-500 radius p-3 pl-11 text-sm line-height-xs font-normal color-white mb-4 leftPanel-searchBox' />
  );
};

export default Searchbox;
