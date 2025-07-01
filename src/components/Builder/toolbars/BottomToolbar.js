import React, { useCallback, useEffect, useRef, useState } from 'react';
import IconAiColor from '../../../assets/svg/freecanvas/ai-color.svg'
import IconArrowPointerSimpleFilled from '../../../assets/svg/freecanvas/arrow-pointer-filled.svg'
import IconImageFilled from '../../../assets/svg/freecanvas/image-filled.svg'
import IconLinkDiagonal from '../../../assets/svg/freecanvas/link-diagonal.svg'
import IconSquare from '../../../assets/svg/freecanvas/square.svg'
import IconType from '../../../assets/svg/freecanvas/type.svg'

const BottomToolbar = ({ onAIGenerate, isAiGenerationLoading }) => {
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
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [bottomToolbarRef]);

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
        <div className="freeCanvas-aiPanel freeCanvas-bottomToolbar" ref={bottomToolbarRef}>
          <input
            type="text"
            value={aiPrompt}
            onChange={handleAIPromptChange}
            onKeyPress={handleAIPromptKeyPress}
            placeholder="AI Creator"
            className="freeCanvas-aiInput"
            disabled={isAiGenerationLoading}
          />
          <button
            type="button"
            onClick={handleAIGenerate}
            disabled={isAiGenerationLoading || !aiPrompt.trim()}
            className="freeCanvas-aiButton"
          >
            Generate
          </button>
        </div>
      )}

      {/* Bottom Toolbar */}
      {!isAIPanelOpen && (
        <div className='freeCanvas-bottomToolbar'>
          <button
            type='button'
            onClick={handleAIButtonClick}
            className={`freeCanvas-bottomToolbarItem ${selectedTool === 'ai' ? 'freeCanvas-bottomToolbarItemSelected' : ''}`}
          >
            <IconAiColor />
          </button>
          <button
            type='button'
            onClick={() => handleToolSelect('pointer')}
            className={`freeCanvas-bottomToolbarItem ${selectedTool === 'pointer' ? 'freeCanvas-bottomToolbarItemSelected' : ''}`}
          >
            <IconArrowPointerSimpleFilled />
          </button>
          <button
            type='button'
            onClick={() => handleToolSelect('text')}
            className={`freeCanvas-bottomToolbarItem ${selectedTool === 'text' ? 'freeCanvas-bottomToolbarItemSelected' : ''}`}
          >
            <IconType />
          </button>
          <button
            type='button'
            onClick={() => handleToolSelect('shape')}
            className={`freeCanvas-bottomToolbarItem ${selectedTool === 'shape' ? 'freeCanvas-bottomToolbarItemSelected' : ''}`}
          >
            <IconSquare />
          </button>
          <button
            type='button'
            onClick={() => handleToolSelect('image')}
            className={`freeCanvas-bottomToolbarItem ${selectedTool === 'image' ? 'freeCanvas-bottomToolbarItemSelected' : ''}`}
          >
            <IconImageFilled />
          </button>
          <button
            type='button'
            onClick={() => handleToolSelect('form-field')}
            className={`freeCanvas-bottomToolbarItemFormFields ${selectedTool === 'form-field' ? 'freeCanvas-bottomToolbarItemSelected' : ''}`}
          >
            <IconLinkDiagonal />
            <span>Form Field</span>
          </button>
        </div>
      )}
    </>
  );
};

export default BottomToolbar;
