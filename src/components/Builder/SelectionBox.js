import PropTypes from 'prop-types';

const SelectionBox = ({ isSelecting, selectionBox }) => {
  if (!isSelecting || !selectionBox) {
    return null;
  }

  const {
    endX, endY, startX, startY,
  } = selectionBox;

  const left = Math.min(startX, endX);
  const top = Math.min(startY, endY);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);

  const style = {
    backgroundColor: '#0099FF4A',
    border: '2px solid #0066C3',
    borderRadius: '2px',
    height,
    left,
    pointerEvents: 'none',
    position: 'absolute',
    top,
    width,
    zIndex: 100000,
  };

  return (
    <div
      className="selection-box"
      style={style}
    />
  );
};

SelectionBox.propTypes = {
  isSelecting: PropTypes.bool,
  selectionBox: PropTypes.shape({
    endX: PropTypes.number,
    endY: PropTypes.number,
    startX: PropTypes.number,
    startY: PropTypes.number,
  }),
};

export default SelectionBox;
