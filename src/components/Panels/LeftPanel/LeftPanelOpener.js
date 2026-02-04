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
        <span>{ADD_ELEMENT}</span>
        <icons.plus className="jfReportSVG isWhite" />
      </button>
    </>
  );
};

export default LeftPanelToggler;
