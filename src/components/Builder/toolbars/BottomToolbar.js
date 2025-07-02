/* eslint-disable sort-keys */
/* eslint-disable max-len */
import PropTypes from 'prop-types';
import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import IconAiColor from '../../../assets/svg/freecanvas/ai-color.svg';
import IconArrowPointerSimpleFilled from '../../../assets/svg/freecanvas/arrow-pointer-filled.svg';
import IconImageFilled from '../../../assets/svg/freecanvas/image-filled.svg';
import IconLinkDiagonal from '../../../assets/svg/freecanvas/link-diagonal.svg';
import IconSquare from '../../../assets/svg/freecanvas/square.svg';
import IconType from '../../../assets/svg/freecanvas/type.svg';
import generateId from '../../../utils/generateId';
import { useBuilderContext } from '../../../utils/builderContext';
import IconLoading from '../../../assets/svg/freecanvas/ai-generation-loading.svg';

const BottomToolbar = ({
  isAiGenerationLoading,
  onAIGenerate,
  onItemAdd,
}) => {
  const { setActiveElement } = useBuilderContext();
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState('pointer');
  const [aiPrompt, setAiPrompt] = useState('');
  const bottomToolbarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (bottomToolbarRef.current && !bottomToolbarRef.current.contains(event.target)) {
        setIsAIPanelOpen(false);
        setSelectedTool('pointer');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [bottomToolbarRef]);

  /* useEffect(() => {
    if (!areArraysEqual(previousActiveElement.current, activeElement)) {
      setSelectedTool('pointer');
    }
    previousActiveElement.current = activeElement;
  }, [activeElement]); */

  const handleAIButtonClick = () => {
    if (isAIPanelOpen) {
      setIsAIPanelOpen(false);
      setSelectedTool('pointer');
    } else {
      setIsAIPanelOpen(true);
      setSelectedTool('ai');
    }
  };

  const handleToolSelect = toolName => {
    setSelectedTool('text');
    if (toolName === 'text') {
      const itemID = generateId();
      onItemAdd({
        id: generateId(),
        itemType: 'text',
        left: 0,
        pageID: '1',
        top: 0,
        height: 65,
        width: 350,
      });
      setActiveElement(itemID);
      return;
    }

    if (toolName === 'image') {
      const itemID = generateId();
      onItemAdd({
        id: generateId(),
        itemType: 'image',
        left: 0,
        pageID: '1',
        top: 0,
        height: 400,
        width: 400,
        opacity: 1,
        roundedCorners: 0,
        url: '',
      });
      setActiveElement(itemID);
      return;
    }

    if (toolName === 'shapes') {
      const itemID = generateId();
      onItemAdd({
        id: itemID,
        itemType: 'shapes',
        left: 100,
        pageID: '1',
        top: 100,
        height: 200,
        width: 200,
      });
      setActiveElement(itemID);
      return;
    }

    setSelectedTool(toolName);
    if (toolName !== 'ai') {
      setIsAIPanelOpen(false);
    }
  };

  const handleAIPromptChange = useCallback(event => {
    setAiPrompt(event.target.value);
  }, []);

  const handleAIPromptKeyPress = useCallback(event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (aiPrompt.trim() && onAIGenerate) {
        onAIGenerate(aiPrompt.trim());
      }
    }
  }, [aiPrompt, onAIGenerate]);

  const handleAIGenerate = useCallback(() => {
    if (aiPrompt.trim() && onAIGenerate) {
      onAIGenerate(aiPrompt.trim());
    }
  }, [aiPrompt, onAIGenerate]);

  return (
    <>
      {/* AI Generation Panel */}
      {isAIPanelOpen && (
        <div
          ref={bottomToolbarRef}
          className="freeCanvas-aiPanel freeCanvas-bottomToolbar"
        >
          <input
            className="freeCanvas-aiInput"
            onChange={handleAIPromptChange}
            onKeyPress={handleAIPromptKeyPress}
            placeholder="AI Creator"
            type="text"
            value={aiPrompt}
          />
          <button
            className="freeCanvas-aiButton"
            disabled={isAiGenerationLoading || !aiPrompt.trim()}
            onClick={handleAIGenerate}
            type="button"
          >
            <span className={isAiGenerationLoading ? 'freeCanvas-aiButtonLoading' : ''}>
              {isAiGenerationLoading ? <IconLoading /> : 'Generate'}
            </span>
          </button>
        </div>
      )}

      {/* Bottom Toolbar */}
      {!isAIPanelOpen && (
        <div className="freeCanvas-bottomToolbar">
          <button
            className={`freeCanvas-bottomToolbarItem ${selectedTool === 'ai' ? 'freeCanvas-bottomToolbarItemSelected' : ''}`}
            onClick={handleAIButtonClick}
            type="button"
          >
            <IconAiColor />
          </button>
          <button
            className={`freeCanvas-bottomToolbarItem ${selectedTool === 'pointer' ? 'freeCanvas-bottomToolbarItemSelected' : ''}`}
            onClick={() => handleToolSelect('pointer')}
            type="button"
          >
            <IconArrowPointerSimpleFilled />
          </button>
          <button
            className={`freeCanvas-bottomToolbarItem ${selectedTool === 'text' ? 'freeCanvas-bottomToolbarItemSelected' : ''}`}
            onClick={() => handleToolSelect('text')}
            type="button"
          >
            <IconType />
          </button>
          <button
            className={`freeCanvas-bottomToolbarItem ${selectedTool === 'shapes' ? 'freeCanvas-bottomToolbarItemSelected' : ''}`}
            onClick={() => handleToolSelect('shapes')}
            type="button"
          >
            <IconSquare />
          </button>
          <button
            className={`freeCanvas-bottomToolbarItem ${selectedTool === 'image' ? 'freeCanvas-bottomToolbarItemSelected' : ''}`}
            onClick={() => handleToolSelect('image')}
            type="button"
          >
            <IconImageFilled />
          </button>
          <button
            className={`freeCanvas-bottomToolbarItemFormFields ${selectedTool === 'form-field' ? 'freeCanvas-bottomToolbarItemSelected' : ''}`}
            onClick={() => handleToolSelect('form-field')}
            type="button"
          >
            <IconLinkDiagonal />
            <span>Form Field</span>
          </button>
        </div>
      )}
    </>
  );
};

BottomToolbar.propTypes = {
  isAiGenerationLoading: PropTypes.bool,
  onAIGenerate: PropTypes.func,
  onItemAdd: PropTypes.func,
};

BottomToolbar.defaultProps = {
  isAiGenerationLoading: false,
  onAIGenerate: () => {},
  onItemAdd: () => {},
};

export default BottomToolbar;
