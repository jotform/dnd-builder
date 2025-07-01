import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import ToolbarTextInput from './ToolbarTextInput';

const DocumentResizeModal = ({ buttonRef, onClose }) => {
  const [position, setPosition] = useState({ left: 0, top: 0, width: 0 });
  const modalRef = useRef(null);

  useEffect(() => {
    if (buttonRef?.current) {
      const button = buttonRef.current;
      const parentContainer = button.closest('.relative');
      if (parentContainer) {
        const containerRect = parentContainer.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();

        setPosition({
          left: -8,
          right: -8,
          top: buttonRect.bottom - containerRect.top + 8,
        });
      } else {
        // Fallback if no relative parent found
        const fallbackPosition = {
          left: button.offsetLeft - 8,
          top: button.offsetTop + button.offsetHeight - 8,
        };
        setPosition(fallbackPosition);
      }
    }
  }, [buttonRef]);

  useEffect(() => {
    const handleClickOutside = event => {
      if (modalRef.current && !modalRef.current.contains(event.target)
        && buttonRef.current && !buttonRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, buttonRef]);

  const handleSave = () => {
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div
      ref={modalRef}
      className="absolute bg-white border border-navy-50 outline outline-offset-0 outline-blue-500
      radius"
      style={{
        left: position.left,
        minWidth: '238px',
        right: position.right,
        top: position.top,
      }}
    >
      <div className="p-4 flex flex-col gap-3">
        <div className="font-circular font-bold text-md line-heigt-lg color-navy-700">
          Document Resize
        </div>
        <div className="flex justify-between gap-2">
          <ToolbarTextInput
            prefix="W"
            suffix="px"
          />
          <ToolbarTextInput
            prefix="H"
            suffix="px"
          />
        </div>
      </div>
      <div className="px-4 py-3 flex justify-between bg-navy-25">
        <button
          className="magnet-btn magnet-btn-secondary"
          onClick={handleCancel}
          type="button"
        >
          <span>Cancel</span>
        </button>
        <button
          className="magnet-btn magnet-btn-primary"
          onClick={handleSave}
          type="button"
        >
          <span>Apply</span>
        </button>
      </div>
    </div>
  );
};

DocumentResizeModal.defaultProps = {
  buttonRef: null,
};

DocumentResizeModal.propTypes = {
  buttonRef: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default DocumentResizeModal;
