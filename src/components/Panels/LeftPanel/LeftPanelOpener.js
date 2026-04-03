import { useBuilderStore } from '../../../contexts/BuilderContext';
import * as icons from '../../../utils/icons';
import { useTranslatedTexts } from '../../../utils/hooks';

const LeftPanelToggler = () => {
  const setIsLeftPanelOpen = useBuilderStore(state => state.setIsLeftPanelOpen);
  const { ADD_ELEMENT } = useTranslatedTexts();

  const onOpenLeftPanel = () => {
    setIsLeftPanelOpen(true);
  };

  return (
    <>
      <button
        className="paneToggler addElementToggle"
        onClick={onOpenLeftPanel}
        title={ADD_ELEMENT}
        type="button"
      >
        <icons.plus className="jfReportSVG isWhite plus-icon" />
      </button>
    </>
  );
};

export default LeftPanelToggler;
