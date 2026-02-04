import { useBuilderStore } from '../../../contexts/BuilderContext';
import * as icons from '../../../utils/icons';
import { useTranslatedTexts } from '../../../utils/hooks';

const RightPanelToggler = () => {
  const resetActiveElements = useBuilderStore(state => state.resetActiveElements);
  const setIsRightPanelOpen = useBuilderStore(state => state.setIsRightPanelOpen);
  const { LAYOUT_SETTINGS } = useTranslatedTexts();

  const onOpenRightPanel = () => {
    resetActiveElements();
    setIsRightPanelOpen(true);
  };

  return (
    <>
      <button
        className="paneToggler js-openRightPanel settingsToggle"
        onClick={onOpenRightPanel}
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

export default RightPanelToggler;
