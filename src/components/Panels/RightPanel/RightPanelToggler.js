import { memo } from 'react';
import { useBuilderStore } from '../../../contexts/BuilderContext';
import { useIcons } from '../../../hooks/useIcons';
import { useTranslatedTexts } from '../../../utils/hooks';

const RightPanelToggler = () => {
  const setActiveElement = useBuilderStore(state => state.setActiveElement);
  const setIsRightPanelOpen = useBuilderStore(state => state.setIsRightPanelOpen);
  const { LAYOUT_SETTINGS } = useTranslatedTexts();
  const { close: CloseIcon, settingsToggle: SettingsToggleIcon } = useIcons();

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
        <SettingsToggleIcon className="jfReportSVG isTick" />
      </button>
      <button
        className="paneClose p-absolute js-closeRightPanel"
        onClick={() => setIsRightPanelOpen(false)}
        type="button"
      >
        <CloseIcon className="jfReportSVG" />
      </button>
    </>
  );
};

export default memo(RightPanelToggler);
