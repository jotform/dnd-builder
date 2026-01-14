import { memo } from 'react';
import PropTypes from 'prop-types';
import SortablePageItem from './SortablePageItem';

const SortablePageItemRenderer = ({
  data = {}, id, index, style,
}) => {
  const {
    pageContainerStyle, pageGetter, ...otherData
  } = data;
  const page = pageGetter(index);
  if (!page) return null;

  const pageContainerLastStyle = {
    ...pageContainerStyle,
    ...page.backgroundColor ? { backgroundColor: page.backgroundColor } : {},
  };
  return (
    <SortablePageItem
      key={`page-${index}-${page.id}`}
      id={id}
      index={index}
      order={page.order}
      page={page}
      pageContainerStyle={pageContainerLastStyle}
      style={style}
      {...otherData}
    />
  );
};

SortablePageItemRenderer.propTypes = {
  data: PropTypes.shape({
    pageContainerStyle: PropTypes.shape({
      backgroundColor: PropTypes.string,
    }),
    pageGetter: PropTypes.func,
    selectedPageIndex: PropTypes.number,
  }),
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  style: PropTypes.shape({
    top: PropTypes.number,
  }).isRequired,
};

export default memo(SortablePageItemRenderer);
