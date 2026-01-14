import PropTypes from 'prop-types';
import * as icons from '../../../utils/icons';

const AllSlidesPanelToggler = ({ onClosePanel = () => {} }) => (
  <button
    className="paneClose p-absolute"
    onClick={onClosePanel}
    type="button"
  >
    <icons.arrowLeft className="jfReportSVG" />
  </button>
);

AllSlidesPanelToggler.propTypes = {
  onClosePanel: PropTypes.func,
};

export default AllSlidesPanelToggler;
