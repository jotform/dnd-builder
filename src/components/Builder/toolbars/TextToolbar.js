/* eslint-disable sort-keys */
import PropTypes from 'prop-types';

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
    <div
      className="text-toolbar"
      style={{
        backgroundColor: '#f5f5f5',
        border: '1px solid #ddd',
        borderRadius: '4px',
        display: 'flex',
        gap: '8px',
        margin: '0 auto',
        padding: '8px',
        width: 'fit-content',
        position: 'relative',
        zIndex: 1000,
      }}
    >
      <button
        onClick={handleBold}
        style={{
          backgroundColor: isBold() ? '#007bff' : 'transparent',
          border: '1px solid #ccc',
          borderRadius: '3px',
          color: isBold() ? 'white' : '#333',
          cursor: 'pointer',
          fontWeight: 'bold',
          padding: '6px 12px',
        }}
        type="button"
      >
        B
      </button>
      <button
        onClick={handleItalic}
        style={{
          backgroundColor: isItalic() ? '#007bff' : 'transparent',
          border: '1px solid #ccc',
          borderRadius: '3px',
          color: isItalic() ? 'white' : '#333',
          cursor: 'pointer',
          fontStyle: 'italic',
          padding: '6px 12px',
        }}
        type="button"
      >
        I
      </button>
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
