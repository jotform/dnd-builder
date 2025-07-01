/* eslint-disable react/jsx-sort-props */
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import domPurify from 'dompurify';
import { useBuilderContext } from '../../utils/builderContext';

const TextEditor = ({
  content,
  handleSave,
  isLocked,
  isSelected,
  placeholder,
}) => {
  const [_content, setContent] = useState(domPurify.sanitize(content));

  const { isTextEditorOpen, setIsTextEditorOpen } = useBuilderContext();

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
    if (isTextEditorOpen && !isSelected) {
      handleSave(_content);
      setIsTextEditorOpen(false);
    }
  }, [isSelected, isTextEditorOpen]);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: isNotEmpty ? _content : placeholder,
      }}
      className={`f-all ql-editor${isNotEmpty ? '' : ' isEmptyTextElement'}`}
      style={{
        minHeight: '20px',
      }}
      contentEditable={isTextEditorOpen && isSelected && !isLocked}
      onClick={onClick}
      onKeyDown={e => {
        if (e.key === 'Escape') {
          setIsTextEditorOpen(false);
        }
        if (e.key === 'Enter' && e.ctrlKey) {
          if (handleSave) {
            handleSave(_content);
          }
          setIsTextEditorOpen(false);
        }
        setContent(domPurify.sanitize(e.target.innerHTML));
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
