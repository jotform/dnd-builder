/* eslint-disable sort-keys */
import PropTypes from 'prop-types';
import ToolbarDropdown from './ToolbarDropdown';
import ToolbarButton from './ToolbarButton';
import ToolbarInput from './ToolbarInput';

const TextToolbar = ({ activePageItem, onItemChange }) => {
  const textValue = activePageItem?.value || activePageItem?.content || '';

  const isBold = () => {
    return textValue.includes('<strong>') || textValue.includes('<b>');
  };

  const isItalic = () => {
    return textValue.includes('<em>') || textValue.includes('<i>');
  };

  const handleBold = () => {
    console.log('bold clicked', textValue);
    let newValue;
    if (isBold()) {
      // Remove bold tags
      newValue = textValue.replace(/<\/?strong>/g, '');
    } else {
      // Add bold tags
      newValue = `<strong>${textValue}</strong>`;
    }

    console.log('newValue', newValue);

    onItemChange(
      { id: activePageItem.id },
      { value: newValue },
    );
  };

  const handleItalic = () => {
    let newValue;
    if (isItalic()) {
      // Remove italic tags
      newValue = textValue.replace(/<\/?em>/g, '');
    } else {
      // Add italic tags
      newValue = `<em>${textValue}</em>`;
    }

    onItemChange(
      { id: activePageItem.id },
      { value: newValue },
    );
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative z-4 flex items-center gap-3 p-3 bg-white radius">
        <ToolbarDropdown />
        <div className="h-6 w-px bg-navy-50" />
        <ToolbarInput />
        <div className="h-6 w-px bg-navy-50" />
        <div className="flex items-center justify-center">
          <ToolbarButton icon="bold" onClick={handleBold} />
          <ToolbarButton icon="italic" onClick={handleItalic} />
          <ToolbarButton icon="underline" onClick={console.log('underline')} />
        </div>
        <div className="h-6 w-px bg-navy-50" />
        {/* link */}
        <div>
          <ToolbarButton icon="link" />
        </div>
        <div className="h-6 w-px bg-navy-50" />
        <div>
          <ToolbarButton icon="text-center" />
        </div>
        <div className="h-6 w-px bg-navy-50" />
        <ToolbarButton icon="list-bullets" />
        <ToolbarButton icon="list-numbers" />
      </div>
    </div>
  );
};

TextToolbar.propTypes = {
  activePageItem: PropTypes.shape({
    content: PropTypes.string,
    id: PropTypes.string,
    value: PropTypes.string,
  }),
  onItemChange: PropTypes.func,
};

TextToolbar.defaultProps = {
  activePageItem: {},
  onItemChange: () => {},
};

export default TextToolbar;
