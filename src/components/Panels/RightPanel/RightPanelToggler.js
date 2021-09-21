import { memo } from 'react';
import { useBuilderContext } from '../../../utils/builderContext';
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
        className="paneToggler js-openRightPanel"
        onClick={() => {
          setActiveElement(null);
          setIsRightPanelOpen(true);
        }}
        title={LAYOUT_SETTINGS}
        type="button"
      >
        <icons.settings className="jfReportSVG isWhite isTick" />
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
