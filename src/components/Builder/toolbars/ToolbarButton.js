/* eslint-disable max-len */
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import Tooltip from './Tooltip';
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconLinkHorizontal,
  IconTextCenter,
  IconListBullets,
  IconListNumbers,
  IconBgImage,
  IconBgScale,
  IconDuplicate,
  IconPlus,
  IconBgColor,
} from './icons';

const getIcon = (icon, iconProps = {}) => {
  switch (icon) {
    case 'bold':
      return IconBold;
    case 'italic':
      return IconItalic;
    case 'underline':
      return IconUnderline;
    case 'link':
      return IconLinkHorizontal;
    case 'text-center':
      return IconTextCenter;
    case 'list-bullets':
      return IconListBullets;
    case 'list-numbers':
      return IconListNumbers;
    case 'bg-image':
      return IconBgImage;
    case 'bg-scale':
      return IconBgScale;
    case 'duplicate':
      return IconDuplicate;
    case 'plus':
      return IconPlus;
    case 'bg-color':
      return (props) => <IconBgColor {...iconProps} {...props} />;
    default:
      return null;
  }
};

const ToolbarButton = forwardRef(({ icon = 'bold', onClick, tooltip, tooltipPlacement = 'bottom', iconProps = {}, className }, ref) => {
  const IconComponent = getIcon(icon, iconProps);

  const button = (
    <button
      ref={ref}
      className={`magnet-button inline-flex shrink-0 justify-center items-center font-medium duration-300 outline-2 outline-transparent outline-offset-0 focus:outline-opacity-50 px-2 radius border-0 cursor-pointer bg-transparent color-navy-500 hover:bg-navy-25 focus:outline-navy-50 toolbar-button ${iconProps ? 'bgColor' : ''}`}
      onClick={onClick}
      type="button"
    >
      {IconComponent && <IconComponent />}
    </button>
  );

  if (tooltip) {
    return (
      <Tooltip
        content={tooltip}
        placement={tooltipPlacement}
      >
        {button}
      </Tooltip>
    );
  }

  return button;
});

export default ToolbarButton;

ToolbarButton.propTypes = {
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  tooltipPlacement: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  iconProps: PropTypes.object,
};

ToolbarButton.defaultProps = {
  onClick: () => { },
  tooltip: null,
  tooltipPlacement: 'bottom',
  iconProps: {},
};
