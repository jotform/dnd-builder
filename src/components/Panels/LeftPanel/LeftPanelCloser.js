import { memo } from 'react';
import { useBuilderContext } from '../../../utils/builderContext';
import * as icons from '../../../utils/icons';

const LeftPanelToggler = () => {
  const { setIsLeftPanelOpen } = useBuilderContext();
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

export default memo(LeftPanelToggler);
