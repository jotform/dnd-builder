import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import domPurify from 'dompurify';
import QuillEditor from './QuillEditor';
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

  return isSelected && isTextEditorOpen ? (
    <QuillEditor
      content={_content}
      handleSave={handleSave}
      placeholder={placeholder}
      setContent={setContent}
      setIsTextEditorOpen={setIsTextEditorOpen}
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

TextEditor.defaultProps = {
  content: '',
  handleSave: () => {},
  isLocked: false,
  isSelected: false,
};

export default TextEditor;
