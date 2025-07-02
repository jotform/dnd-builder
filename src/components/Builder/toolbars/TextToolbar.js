/* eslint-disable max-len */
/* eslint-disable sort-keys */
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import ToolbarButton from './ToolbarButton';
import ToolbarDropdown from './ToolbarDropdown';

const FONT_FAMILY_OPTIONS = [
  'Abril Fatface',
  'Arial',
  'Arial Black',
  'Bevan',
  'Bitter',
  'Circular',
  'Comic Sans MS',
  'Courier New',
  'Diplomata',
  'Fredoka One',
  'Galada',
  'Georgia',
  'Helvetica',
  'Impact',
  'Lobster',
  'Montserrat',
  'Open Sans',
  'PT Serif',
  'Playball',
  'Roboto',
  'Sail',
  'Tahoma',
  'Times New Roman',
  'Trebuchet MS',
  'Ubuntu',
  'Verdana',
];

const TextToolbar = ({ activePageItem, onItemChange }) => {
  const textValue = activePageItem?.value || activePageItem?.content || '';

  const [fontSize, setFontSize] = useState(16);

  // Parse font-size from HTML
  const getFontSizeFromHTML = htmlString => {
    const fontSizeMatch = htmlString.match(/font-size:\s*(\d+)px/);
    return fontSizeMatch ? parseInt(fontSizeMatch[1], 10) : 22;
  };

  const setFontSizeInHTML = (htmlString, newFontSize) => {
    const cleanedHTML = htmlString.replace(/style="[^"]*font-size:[^;"]*;?[^"]*"/g, match => {
      return match.replace(/font-size:[^;"]*;?/g, '').replace(/style=""/g, '');
    });

    if (!cleanedHTML.includes('style=')) {
      return `<span style="font-size: ${newFontSize}px">${cleanedHTML}</span>`;
    }

    const newHTML = cleanedHTML.replace(/style="([^"]*)"/, `style="$1; font-size: ${newFontSize}px"`);
    return newHTML;
  };

  useEffect(() => {
    if (activePageItem && textValue) {
      const currentFontSize = getFontSizeFromHTML(textValue);
      setFontSize(currentFontSize);
    }
  }, [activePageItem]);

  const isBold = () => {
    return textValue.includes('<strong>') || textValue.includes('<b>');
  };

  const isItalic = () => {
    return textValue.includes('<em>') || textValue.includes('<i>');
  };

  const handleBold = () => {
    let newValue;
    if (isBold()) {
      newValue = textValue.replace(/<\/?strong>/g, '');
    } else {
      newValue = `<strong>${textValue}</strong>`;
    }

    onItemChange(
      { id: activePageItem.id },
      { value: newValue },
    );
  };

  const handleItalic = () => {
    let newValue;
    if (isItalic()) {
      newValue = textValue.replace(/<\/?em>/g, '');
    } else {
      newValue = `<em>${textValue}</em>`;
    }

    onItemChange(
      { id: activePageItem.id },
      { value: newValue },
    );
  };

  const handleUnderline = () => {
    // console.log('underline clicked', textValue);
  };

  const handleFontsizeChange = value => {
    const newFontSize = parseInt(value, 10);
    setFontSize(newFontSize);
    if (!Number.isNaN(newFontSize) && newFontSize > 0) {
      const newValue = setFontSizeInHTML(textValue, newFontSize);
      onItemChange(
        { id: activePageItem.id },
        { value: newValue },
      );
    }
  };

  const handleFontFamilyChange = value => {
    onItemChange(
      { id: activePageItem.id },
      { fontFamily: value },
    );
  };

  return (
    <div className="mt-4 flex items-center justify-center">
      <div
        className="relative z-4 flex items-center gap-3 px-2 py-2 bg-white  border border-navy-50
       radius-lg"
      >
        <ToolbarDropdown
          onChange={handleFontFamilyChange}
          options={FONT_FAMILY_OPTIONS}
          value={activePageItem?.fontFamily || 'Circular'}
        />
        <div className="h-6 w-px bg-navy-50" />
        <ToolbarDropdown
          onChange={handleFontsizeChange}
          options={['12', '14', '16', '18', '20', '22', '24', '26', '28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50']}
          value={fontSize}
        />
        <div className="h-6 w-px bg-navy-50" />
        <div className="flex items-center justify-center">
          <ToolbarButton
            icon="bold"
            onClick={handleBold}
          />
          <ToolbarButton
            icon="italic"
            onClick={handleItalic}
          />
          <ToolbarButton
            icon="underline"
            onClick={handleUnderline}
          />
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
    fontFamily: PropTypes.string,
    value: PropTypes.string,
  }),
  onItemChange: PropTypes.func,
};

TextToolbar.defaultProps = {
  activePageItem: {},
  onItemChange: () => {},
};

export default TextToolbar;
