export const divider = section => {
  return {
    label: '',
    section,
    static: true,
    type: 'divider',
  };
};

export const fieldSet = (section, label) => {
  return {
    key: 'shapeTypeFieldSet',
    label,
    section,
    static: true,
    type: 'fieldSet',
  };
};
