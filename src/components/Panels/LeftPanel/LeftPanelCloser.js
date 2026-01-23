import { memo } from 'react';
import { useBuilderStore } from '../../../contexts/BuilderContext';
import { useIcons } from '../../../hooks/useIcons';

const LeftPanelToggler = () => {
  const setIsLeftPanelOpen = useBuilderStore(state => state.setIsLeftPanelOpen);
  const { close: CloseIcon } = useIcons();
  return (
    <>
      <button
        className="paneClose p-absolute"
        onClick={() => { setIsLeftPanelOpen(false); }}
        type="button"
      >
        <CloseIcon className="jfReportSVG" />
      </button>
    </>
  );
};

export default memo(LeftPanelToggler);
