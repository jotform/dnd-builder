/* eslint-disable max-len */
import PropTypes from 'prop-types';
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
} from './icons';

const getIcon = icon => {
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
    default:
      return null;
  }
};

const ToolbarButton = ({ icon = 'bold' }) => {
  const IconComponent = getIcon(icon);
  return (
    <button
      className="magnet-button inline-flex shrink-0 justify-center items-center font-medium duration-300 outline-2 outline-transparent outline-offset-0 focus:outline-opacity-50 h-8 px-2.5 radius border-0 cursor-pointer bg-transparent color-navy-500 hover:bg-navy-25 focus:outline-navy-50 toolbar-button"
      type="button"
    >
      {IconComponent && <IconComponent />}
    </button>
  );
};

export default ToolbarButton;

ToolbarButton.propTypes = {
  icon: PropTypes.string.isRequired,
};
