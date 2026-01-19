import PropTypes from 'prop-types';
import { useBuilderStore } from '../../../contexts/BuilderContext';
import * as icons from '../../../utils/icons';
import { useTranslatedTexts } from '../../../utils/hooks';

const SlidesPanelToggler = ({ onClosePanel = () => {} }) => {
  const setActiveElement = useBuilderStore(state => state.setActiveElement);
  const setIsSlidesPanelOpen = useBuilderStore(state => state.setIsSlidesPanelOpen);
  const { SLIDES } = useTranslatedTexts();

  return (
    <>
      <button
        className="paneToggler settingsToggle"
        onClick={() => {
          setActiveElement(null);
          setIsSlidesPanelOpen(true);
        }}
        title={SLIDES}
        type="button"
      >
        <icons.slides className="jfReportSVG isTick" />
      </button>
      <button
        className="paneClose p-absolute"
        onClick={onClosePanel}
        type="button"
      >
        <icons.close className="jfReportSVG" />
      </button>
    </>
  );
};

SlidesPanelToggler.propTypes = {
  onClosePanel: PropTypes.func,
};

export default SlidesPanelToggler;
