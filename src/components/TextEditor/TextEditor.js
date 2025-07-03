/* eslint-disable sort-keys */
/* eslint-disable max-len */
/* eslint-disable react/jsx-sort-props */
import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';

const decodeHtml = html => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const TextEditor = ({
  content,
  handleSave,
  isLocked,
  isSelected,
  placeholder,
}) => {
  const textEditorRef = useRef(null);
  const [_content, setContent] = useState(content);

  const [isTextEditorOpen, setIsTextEditorOpen] = useState(false);

  const onClick = useCallback(() => {
    if (isSelected && !isLocked) {
      setIsTextEditorOpen(true);
    }
  }, [isSelected, isLocked]);

  const isNotEmpty = useMemo(() => {
    const el = document.createElement('div');
    el.innerHTML = _content;
    return !!el.innerText;
  }, [_content]);

  useEffect(() => {
    setContent(content);
  }, [content]);

  useEffect(() => {
    if (isTextEditorOpen && !isSelected) {
      if (textEditorRef.current) {
        let textEditorContent = textEditorRef.current.innerHTML;
        textEditorContent = decodeHtml(textEditorContent);
        handleSave(textEditorContent);
      }
      setIsTextEditorOpen(false);
    }
  }, [isSelected, isTextEditorOpen]);

  return (
    <div
      ref={textEditorRef}
      dangerouslySetInnerHTML={{
        __html: isNotEmpty ? _content : placeholder,
      }}
      className={`f-all ql-editor${isNotEmpty ? '' : ' isEmptyTextElement'}`}
      style={{
        minHeight: '60px',
      }}
      contentEditable={isTextEditorOpen && isSelected && !isLocked}
      onClick={onClick}
      onKeyDown={e => {
        if (e.key === 'Escape') {
          setIsTextEditorOpen(false);
        }
        if (e.key === 'Enter') {
          if (handleSave) {
            const textEditorContent = textEditorRef.current.innerHTML;
            handleSave(textEditorContent);
            setIsTextEditorOpen(false);
          }
          setIsTextEditorOpen(false);
        }
        if ((e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') && isTextEditorOpen && isSelected && !isLocked) {
          e.stopPropagation();
        }
      }}
    />
  );
};

TextEditor.propTypes = {
  content: PropTypes.string,
  handleSave: PropTypes.func,
  isLocked: PropTypes.bool,
  isSelected: PropTypes.bool,
  placeholder: PropTypes.string.isRequired,
};

TextEditor.defaultProps = {
  content: '',
  handleSave: () => {},
  isLocked: false,
  isSelected: false,
};

export default TextEditor;
