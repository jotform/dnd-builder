import { memo } from 'react';
import { useBuilderStore } from '../../../contexts/BuilderContext';
import { useIcons } from '../../../hooks/useIcons';
import { useTranslatedTexts } from '../../../utils/hooks';

const LeftPanelToggler = () => {
  const setIsLeftPanelOpen = useBuilderStore(state => state.setIsLeftPanelOpen);
  const { ADD_ELEMENT } = useTranslatedTexts();
  const { plus: PlusIcon } = useIcons();
  return (
    <>
      <button
        className="paneToggler addElementToggle"
        onClick={() => { setIsLeftPanelOpen(true); }}
        title={ADD_ELEMENT}
        type="button"
      >
        <span>{ADD_ELEMENT}</span>
        <PlusIcon className="jfReportSVG isWhite" />
      </button>
    </>
  );
};

export default memo(LeftPanelToggler);
