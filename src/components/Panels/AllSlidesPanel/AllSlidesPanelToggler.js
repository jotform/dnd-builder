import PropTypes from 'prop-types';
import { useIcons } from '../../../hooks/useIcons';

const AllSlidesPanelToggler = ({ onClosePanel = () => {} }) => {
  const { arrowLeft: ArrowLeftIcon } = useIcons();
  return (
    <button
      className="paneClose p-absolute"
      onClick={onClosePanel}
      type="button"
    >
      <ArrowLeftIcon className="jfReportSVG" />
    </button>
  );
};

AllSlidesPanelToggler.propTypes = {
  onClosePanel: PropTypes.func,
};

export default AllSlidesPanelToggler;
