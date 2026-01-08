import PropTypes from 'prop-types';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { MouseTransition, TouchTransition, MultiBackend } from 'react-dnd-multi-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

const MultiBackendOptions = {
  backends: [
    {
      backend: HTML5Backend,
      id: 'html5',
      transition: MouseTransition,
    },
    {
      backend: TouchBackend,
      id: 'touch',
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
      options={MultiBackendOptions}
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
