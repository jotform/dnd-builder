import { memo } from 'react';
import { useBuilderContext } from '../../../utils/builderContext';
import * as icons from '../../../utils/icons';
import { useTranslatedTexts } from '../../../utils/hooks';

const LeftPanelToggler = () => {
  const { setIsLeftPanelOpen } = useBuilderContext();
  const { ADD_ELEMENT } = useTranslatedTexts();
  return (
    <>
      <button
        className="paneToggler addElementToggle"
        onClick={() => { setIsLeftPanelOpen(true); }}
        title={ADD_ELEMENT}
        type="button"
      >
        <span>{ADD_ELEMENT}</span>
        <icons.plus className="jfReportSVG isWhite" />
      </button>
    </>
  );
};

export default memo(LeftPanelToggler);
