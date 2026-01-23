import PropTypes from 'prop-types';
import { useBuilderStore } from '../../../contexts/BuilderContext';
import { useTranslatedTexts } from '../../../utils/hooks';
import { useIcons } from '../../../hooks/useIcons';

const SlidesPanelToggler = ({ onClosePanel = () => {} }) => {
  const setActiveElement = useBuilderStore(state => state.setActiveElement);
  const setIsSlidesPanelOpen = useBuilderStore(state => state.setIsSlidesPanelOpen);
  const { SLIDES } = useTranslatedTexts();
  const { close: CloseIcon, slides: SlidesIcon } = useIcons();
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
        <SlidesIcon className="jfReportSVG isTick" />
      </button>
      <button
        className="paneClose p-absolute"
        onClick={onClosePanel}
        type="button"
      >
        <CloseIcon className="jfReportSVG" />
      </button>
    </>
  );
};

SlidesPanelToggler.propTypes = {
  onClosePanel: PropTypes.func,
};

export default SlidesPanelToggler;
