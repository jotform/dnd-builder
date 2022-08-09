const handleKeyDown = e => {
  e.stopPropagation();
};

export const modules = {
  clipboard: {
    matchVisual: false,
  },
  toolbar: {
    container: '#toolbar',
    handlers: {
      link: function customLink(value) {
        const input = document.querySelector('.ql-tooltip [data-link]');
        if (value) {
          const range = this.quill.getSelection();
          if (range === null || range.length === 0) {
            return;
          }
          const { tooltip } = this.quill.theme;
          const toolbar = document.getElementById('toolbar');
          toolbar.appendChild(tooltip.root);
          tooltip.edit('link', this.quill.getText(range));
          input.setAttribute('placeholder', 'Enter a link');
          input.addEventListener('keydown', handleKeyDown);
        } else {
          input.removeEventListener('keydown', handleKeyDown);
          this.quill.format('link', false);
        }
      },
    },
  },
};

export const formats = [
  'align',
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'color',
];
