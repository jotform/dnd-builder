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
  const [_content, setContent] = useState(content);

  const { isTextEditorOpen, setIsTextEditorOpen } = useBuilderContext();

  const onClick = useCallback(() => {
    if (isSelected && !isLocked) {
      setIsTextEditorOpen(true);
    }
  }, [isSelected, isLocked]);

  const isNotEmpty = useMemo(() => {
    const el = document.createElement('div');
    el.innerHTML = domPurify.sanitize(_content);
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
  placeholder: PropTypes.string,
};

TextEditor.defaultProps = {
  content: '',
  handleSave: () => {},
  isLocked: false,
  isSelected: false,
  placeholder: 'Click to edit text',
};

export default TextEditor;
