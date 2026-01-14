import PropTypes from 'prop-types';

const SelectZoom = ({
  fittedZoom = 1,
  handleZoomChange = f => f,
  zoom = 1,
}) => {
  return (
    <select
      aria-label="Zoom selection"
      className="toolSection-dropdown controllerItem"
      onChange={handleZoomChange}
      value={Math.round(zoom * 100)}
    >
      <option
        key="fitZoom"
        value={fittedZoom * 100}
      >
        Fit
      </option>
      {Array.from({ length: 16 },
        (v, k) => (k * 10) + 50).map(opt => (
          <option
            key={opt}
            value={opt}
          >
            {`${opt}%`}
          </option>
      ))}
    </select>
  );
};

SelectZoom.propTypes = {
  fittedZoom: PropTypes.number,
  handleZoomChange: PropTypes.func,
  zoom: PropTypes.number,
};

export default SelectZoom;
