import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import QuillEditor from './QuillEditor';
import { useBuilderContext } from '../../utils/builderContext';

const TextEditor = ({
  content,
  handleSave,
  isLocked,
  isSelected,
  placeholder,
}) => {
  const { isTextEditorOpen, setIsTextEditorOpen } = useBuilderContext();

  const onClick = useCallback(() => {
    if (isSelected && !isLocked) {
      setIsTextEditorOpen(true);
    }
  }, [isSelected, isLocked]);

  const isNotEmpty = useMemo(() => {
    const el = document.createElement('div');
    el.innerHTML = content;
    return !!el.innerText;
  }, [content]);

  const onClickOutside = useCallback(() => {
    setTimeout(() => setIsTextEditorOpen(false), 1000);
  }, [isTextEditorOpen]);

  return isSelected && isTextEditorOpen ? (
    <QuillEditor
      content={content}
      exceptionalClasses={['ql-toolbar']}
      handleSave={handleSave}
      onClickOutside={onClickOutside}
      placeholder={placeholder}
      setIsTextEditorOpen={setIsTextEditorOpen}
      withClickOutsideWrapperClass="textEditorWrapper f-all"
    />
  ) : (
    <div
      className={`f-all ql-editor${isNotEmpty ? '' : ' isEmptyTextElement'}`}
      dangerouslySetInnerHTML={{
        __html: isNotEmpty ? content : placeholder,
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
