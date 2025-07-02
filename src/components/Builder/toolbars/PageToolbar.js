import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import ToolbarButton from './ToolbarButton';
import DocumentResizeModal from './DocumentResizeModal';

const PageToolbar = ({ onSettingChange, settings }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const bgScaleButtonRef = useRef(null);

  const handleBgScaleClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="mt-4 flex items-center justify-center">
      <div
        className="relative z-4 flex items-center gap-3 px-3 py-2 bg-white border border-navy-50
    radius-lg"
      >
        <button
          className="w-8 h-8 flex items-center justify-center"
          type="button"
        >
          <div className="w-4 h-4 bg-white radius border border-navy-100" />
        </button>
        <ToolbarButton
          icon="bg-image"
          onClick={() => console.log('bg image')}
        />
        <ToolbarButton
          ref={bgScaleButtonRef}
          icon="bg-scale"
          onClick={handleBgScaleClick}
        />
        <ToolbarButton
          icon="duplicate"
          onClick={() => console.log('duplicate')}
        />
        <ToolbarButton
          icon="plus"
          onClick={() => console.log('plus')}
        />
        {isModalOpen && (
          <DocumentResizeModal
            buttonRef={bgScaleButtonRef}
            onClose={handleCloseModal}
            onSettingChange={onSettingChange}
            settings={{
              reportLayoutHeight: settings.reportLayoutHeight || 1080,
              reportLayoutWidth: settings.reportLayoutWidth || 1920,
            }}
          />
        )}
      </div>
    </div>
  );
};

PageToolbar.propTypes = {
  onSettingChange: PropTypes.func,
  page: PropTypes.shape({}),
  settings: PropTypes.shape({
    reportLayoutHeight: PropTypes.number,
    reportLayoutWidth: PropTypes.number,
  }),
};

PageToolbar.defaultProps = {
  onSettingChange: () => { },
  page: {},
  settings: {},
};

export default PageToolbar;
