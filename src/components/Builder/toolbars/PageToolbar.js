import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import ToolbarButton from './ToolbarButton';
import DocumentResizeModal from './DocumentResizeModal';
import { ColorPickerWithClickOutside } from '../../Settings/ColorPicker';

const PageToolbar = ({ onSettingChange, settings }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const bgScaleButtonRef = useRef(null);
  const bgColorButtonRef = useRef(null);

  const handleBgScaleClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleBgColorClick = () => {
    setIsColorPickerOpen(!isColorPickerOpen);
  };

  const handleColorChange = ({ hex }) => {
    setBackgroundColor(hex);
    onSettingChange({ id: '__layout__' }, {
      reportBackgroundColor: hex,
      reportBackgroundGradientEnabled: 'off',
    });
  };

  const handleColorPickerClose = () => {
    setIsColorPickerOpen(false);
  };

  return (
    <div className="mt-4 flex items-center justify-center">
      <div
        className="relative z-4 flex items-center gap-3 px-3 py-2 bg-white border border-navy-50
    radius-lg"
      >
        <button
          ref={bgColorButtonRef}
          className="w-8 h-8 flex items-center justify-center"
          onClick={handleBgColorClick}
          type="button"
        >
          <div
            className="w-4 h-4 radius border border-navy-100"
            style={{ backgroundColor }}
          />
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
        {isColorPickerOpen && (
          <div
            className="absolute top-12 left-0 z-10"
            onKeyDown={e => e.stopPropagation()}
          >
            <ColorPickerWithClickOutside
              color={backgroundColor}
              disableAlpha={true}
              exceptionalClasses={['bg-color-button']}
              onChange={handleColorChange}
              onChangeComplete={handleColorChange}
              onClickOutside={handleColorPickerClose}
              presetColors={[
                '#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505',
                '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000',
                '#4A4A4A', '#9B9B9B', '#FFFFFF',
              ]}
              withClickOutsideWrapperClass="colorPicker-holder"
            />
          </div>
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
