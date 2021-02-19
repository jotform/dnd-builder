export const pageSize = ({
  reportLayout,
  reportLayoutHeight,
  reportLayoutWidth,
}) => {
  let size = reportLayout.indexOf('Portrait') > -1
    ? reportLayout.toLowerCase()
    : `${reportLayoutWidth}px ${reportLayoutHeight}px`;
  if (reportLayout === 'A5 Portrait') {
    size = '147mm 210mm'; // A5 Portrait quick fix
  }
  return size;
};
