import { memo } from 'react';
import { useBuilderContext } from '../../../contexts/BuilderContext';
import * as icons from '../../../utils/icons';
import { useTranslatedTexts } from '../../../utils/hooks';

const RightPanelToggler = () => {
  const {
    setActiveElement,
    setIsRightPanelOpen,
  } = useBuilderContext();
  const { LAYOUT_SETTINGS } = useTranslatedTexts();

  return (
    <>
      <button
        className="paneToggler js-openRightPanel settingsToggle"
        onClick={() => {
          setActiveElement(null);
          setIsRightPanelOpen(true);
        }}
        title={LAYOUT_SETTINGS}
        type="button"
      >
        <icons.settingsToggle className="jfReportSVG isTick" />
      </button>
      <button
        className="paneClose p-absolute js-closeRightPanel"
        onClick={() => setIsRightPanelOpen(false)}
        type="button"
      >
        <icons.close className="jfReportSVG" />
      </button>
    </>
  );
};

export default memo(RightPanelToggler);
