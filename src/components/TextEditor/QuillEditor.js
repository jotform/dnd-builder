import { useEffect, useRef, useCallback } from 'react';
import ReactQuill from 'react-quill';
import PropTypes from 'prop-types';
import withClickOutside from '../withClickOutside';
import { formats, modules } from './textEditorConstants';
import { fontSizes } from '../../constants/fonts';
import 'react-quill/dist/quill.snow.css';

const Size = ReactQuill.Quill.import('attributors/style/size');
Size.whitelist = fontSizes.map(s => `${s}px`);
ReactQuill.Quill.register(Size, true);

const QuillEditor = ({
  content,
  handleSave,
  placeholder,
  setIsTextEditorOpen,
}) => {
  const quill = useRef(null);
  const saveAndQuit = () => {
    if (quill.current === null) return;
    const editor = quill.current.getEditor();
    const unprivilegedEditor = quill.current.makeUnprivilegedEditor(editor);
    handleSave(unprivilegedEditor.getHTML());
    setIsTextEditorOpen(false);
  };

  useEffect(() => {
    if (quill.current !== null) {
      const editor = quill.current.getEditor();
      editor.setSelection(0, content.length);
    }
    return saveAndQuit;
  }, []);

  const handleKeyDown = useCallback(e => {
    e.stopPropagation();
    if (e.keyCode === 27) {
      saveAndQuit();
    }
  }, []);

  return (
    <div
      className="f-all"
      onKeyDown={handleKeyDown}
    >
      <ReactQuill
        ref={quill}
        defaultValue={content}
        formats={QuillEditor.formats}
        modules={QuillEditor.modules}
        placeholder={placeholder}
        preserveWhitespace
      />
    </div>
  );
};

QuillEditor.modules = modules;
QuillEditor.formats = formats;

QuillEditor.propTypes = {
  content: PropTypes.string,
  handleSave: PropTypes.func,
  placeholder: PropTypes.string,
  setIsTextEditorOpen: PropTypes.func,
};

QuillEditor.defaultProps = {
  content: '',
  handleSave: () => {},
  placeholder: 'Click to edit text',
  setIsTextEditorOpen: {},
};

export default withClickOutside(QuillEditor);
