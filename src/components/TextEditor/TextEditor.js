import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import domPurify from 'dompurify';
import QuillEditor from './QuillEditor';
import { useBuilderStore } from '../../contexts/BuilderContext';
import { usePropState } from '../../utils/hooks';

const TextEditor = ({
  content = '',
  handleSave = () => {},
  isLocked = false,
  isSelected = false,
  placeholder,
}) => {
  const [_content, setContent] = usePropState(content, domPurify.sanitize);

  const isTextEditorOpen = useBuilderStore(state => state.isTextEditorOpen);
  const setIsTextEditorOpen = useBuilderStore(state => state.setIsTextEditorOpen);

  const onClick = useCallback(() => {
    if (isSelected && !isLocked) {
      setIsTextEditorOpen(true);
    }
  }, [isSelected, isLocked, setIsTextEditorOpen]);

  const onClose = useCallback(() => {
    setIsTextEditorOpen(false);
  }, [setIsTextEditorOpen]);

  const isNotEmpty = useMemo(() => {
    const el = document.createElement('div');
    el.innerHTML = _content;
    return !!el.innerText;
  }, [_content]);

  return isSelected && isTextEditorOpen ? (
    <QuillEditor
      content={_content}
      handleSave={handleSave}
      onClose={onClose}
      placeholder={placeholder}
      setContent={setContent}
    />
  ) : (
    <div
      className={`f-all ql-editor${isNotEmpty ? '' : ' isEmptyTextElement'}`}
      dangerouslySetInnerHTML={{
        __html: isNotEmpty ? _content : placeholder,
      }}
      onClick={onClick}
      onKeyDown={() => {}}
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

export default TextEditor;
