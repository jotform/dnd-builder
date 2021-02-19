import React from 'react';
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend-cjs';
import { DndProvider } from 'react-dnd-cjs';
import MultiBackend, { TouchTransition, MouseTransition } from 'react-dnd-multi-backend';
import TouchBackend from 'react-dnd-touch-backend-cjs';

const HTML5toTouch = {
  backends: [
    {
      backend: HTML5Backend,
      transition: MouseTransition,
    },
    {
      backend: TouchBackend,
      options: {
        delayTouchStart: 135,
        enableMouseEvents: true,
      },
      preview: true,
      transition: TouchTransition,
    },
  ],
};

const DndWrapper = ({ children }) => {
  if (!children) return null;

  return (
    <DndProvider
      backend={MultiBackend}
      options={HTML5toTouch}
    >
      {children}
    </DndProvider>
  );
};

DndWrapper.propTypes = {
  children: PropTypes.node,
};

DndWrapper.defaultProps = {
  children: null,
};

export default DndWrapper;
