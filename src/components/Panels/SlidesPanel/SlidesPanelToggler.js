import PropTypes from 'prop-types';
import { useBuilderStore } from '../../../contexts/BuilderContext';
import * as icons from '../../../utils/icons';
import { useTranslatedTexts } from '../../../utils/hooks';

const SlidesPanelToggler = ({ onClosePanel = () => {} }) => {
  const resetActiveElements = useBuilderStore(state => state.resetActiveElements);
  const setIsSlidesPanelOpen = useBuilderStore(state => state.setIsSlidesPanelOpen);
  const { SLIDES } = useTranslatedTexts();

  const onOpenSlidesPanel = () => {
    resetActiveElements();
    setIsSlidesPanelOpen(true);
  };

  return (
    <>
      <button
        className="paneToggler settingsToggle"
        onClick={onOpenSlidesPanel}
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
