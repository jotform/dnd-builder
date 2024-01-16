import { memo } from 'react';
import PropTypes from 'prop-types';
import { areEqual } from 'react-window';
import SortablePageItem from './SortablePageItem';

const SortablePageItemRenderer = ({ data, index, style }) => {
  const {
    pageContainerStyle, pageGetter, ...otherData
  } = data;
  const page = pageGetter(index);
  const pageContainerLastStyle = {
    ...pageContainerStyle,
    ...page.backgroundColor ? { backgroundColor: page.backgroundColor } : {},
  };
  return (
    <SortablePageItem
      key={`page-${index}-${page.id}`}
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
  index: PropTypes.number.isRequired,
  style: PropTypes.shape({
    top: PropTypes.number,
  }).isRequired,
};

SortablePageItemRenderer.defaultProps = {
  data: {},
};

export default memo(SortablePageItemRenderer, areEqual);
