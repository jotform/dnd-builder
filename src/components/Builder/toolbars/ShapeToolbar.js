/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import ToolbarButton from './ToolbarButton';
import DocumentResizeModal from './DocumentResizeModal';
import { ColorPickerWithClickOutside } from '../../Settings/ColorPicker';

const ShapeToolbar = ({ activePageItem, onItemChange }) => {
  const { shapeFillColor } = activePageItem;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState(shapeFillColor || '#FFFFFF');
  const bgScaleButtonRef = useRef(null);
  const bgColorButtonRef = useRef(null);

  useEffect(() => {
    setBackgroundColor(shapeFillColor || '#000000');
  }, [shapeFillColor]);

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
    onItemChange(
      { id: activePageItem.id },
      { shapeFillColor: hex },
    );
  };

  const handleColorPickerClose = () => {
    setIsColorPickerOpen(false);
  };

  return (
    <div className="mt-4 flex items-center justify-center toolbar-container">
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
          ref={bgScaleButtonRef}
          icon="bg-scale"
          onClick={handleBgScaleClick}
        />
        <ToolbarButton
          icon="duplicate"
          onClick={() => console.log('duplicate')}
        />
        {isModalOpen && (
          <DocumentResizeModal
            buttonRef={bgScaleButtonRef}
            onClose={handleCloseModal}
            onSettingChange={() => console.log('on item change')}
            settings={{
              reportLayoutHeight: 200,
              reportLayoutWidth: 300,
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

ShapeToolbar.propTypes = {
  activePageItem: PropTypes.shape({}),
  onItemChange: PropTypes.func,
};

ShapeToolbar.defaultProps = {
  activePageItem: {},
  onItemChange: () => {},
};

export default ShapeToolbar;
