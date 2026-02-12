import { useBuilderStore } from '../../../contexts/BuilderContext';
import * as icons from '../../../utils/icons';

const LeftPanelToggler = () => {
  const setIsLeftPanelOpen = useBuilderStore(state => state.setIsLeftPanelOpen);
  return (
    <>
      <button
        className="paneClose p-absolute"
        onClick={() => { setIsLeftPanelOpen(false); }}
        type="button"
      >
        <icons.close className="jfReportSVG" />
      </button>
    </>
  );
};

export default LeftPanelToggler;
