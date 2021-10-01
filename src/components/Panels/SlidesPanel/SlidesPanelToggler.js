import PropTypes from 'prop-types';
import { useBuilderContext } from '../../../utils/builderContext';
import * as icons from '../../../utils/icons';
import { useTranslatedTexts } from '../../../utils/hooks';

const SlidesPanelToggler = ({ onClosePanel }) => {
  const {
    setActiveElement,
    setIsSlidesPanelOpen,
  } = useBuilderContext();
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
        <icons.slides className="jfReportSVG isWhite isTick" />
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

SlidesPanelToggler.defaultProps = {
  onClosePanel: () => {},
};

export default SlidesPanelToggler;
