import React from 'react';
import PropTypes from 'prop-types';
import { SortableContainer } from 'react-sortable-hoc';
import memoize from 'memoize-one';
import SortablePageItemRenderer from './SortablePageItemRenderer';

const createItemData = memoize((
  acceptedItems,
  additionalPageItems,
  disableInteraction,
  hashCode,
  itemAccessor,
  onAnEventTrigger,
  onPageAdd,
  onPageClick,
  onPageDuplicate,
  onPageRemove,
  pageContainerStyle,
  pageGetter,
  selectedPageIndex,
) => ({
  acceptedItems,
  additionalPageItems,
  disableInteraction,
  hashCode,
  itemAccessor,
  onAnEventTrigger,
  onPageAdd,
  onPageClick,
  onPageDuplicate,
  onPageRemove,
  pageContainerStyle,
  pageGetter,
  selectedPageIndex,
}));

const SortablePageList = Component => {
  class ReactWindowList extends React.PureComponent {
    constructor(props) {
      super(props);

      this.sortablePageListRef = React.createRef();
      this.sortableOuterRef = React.createRef();
    }

    get itemData() {
      const {
        acceptedItems,
        additionalPageItems,
        disableInteraction,
        hashCode,
        itemAccessor,
        onAnEventTrigger,
        onPageAdd,
        onPageClick,
        onPageDuplicate,
        onPageRemove,
        pageContainerStyle,
        pageGetter,
        selectedPageIndex,
      } = this.props;
      return createItemData(
        acceptedItems,
        additionalPageItems,
        disableInteraction,
        hashCode,
        itemAccessor,
        onAnEventTrigger,
        onPageAdd,
        onPageClick,
        onPageDuplicate,
        onPageRemove,
        pageContainerStyle,
        pageGetter,
        selectedPageIndex,
      );
    }

    render() {
      const { height, pageCount, width } = this.props;

      return (
        <Component
          ref={this.sortablePageListRef}
          height={height}
          itemCount={pageCount}
          itemData={this.itemData}
          itemSize={127}
          outerRef={this.sortableOuterRef}
          width={width}
        >
          {SortablePageItemRenderer}
        </Component>
      );
    }
  }

  ReactWindowList.propTypes = {
    acceptedItems: PropTypes.shape({}),
    additionalPageItems: PropTypes.arrayOf(PropTypes.node),
    disableInteraction: PropTypes.arrayOf(PropTypes.string),
    hashCode: PropTypes.string,
    height: PropTypes.number,
    itemAccessor: PropTypes.func,
    onAnEventTrigger: PropTypes.func,
    onPageAdd: PropTypes.func,
    onPageClick: PropTypes.func,
    onPageDuplicate: PropTypes.func,
    onPageRemove: PropTypes.func,
    pageContainerStyle: PropTypes.shape({}),
    pageCount: PropTypes.number,
    pageGetter: PropTypes.func,
    selectedPageIndex: PropTypes.number,
    width: PropTypes.number,
  };

  ReactWindowList.defaultProps = {
    acceptedItems: {},
    additionalPageItems: [],
    disableInteraction: [],
    hashCode: '',
    height: 0,
    itemAccessor: () => {},
    onAnEventTrigger: () => {},
    onPageAdd: () => {},
    onPageClick: () => {},
    onPageDuplicate: () => {},
    onPageRemove: () => {},
    pageContainerStyle: {},
    pageCount: 0,
    pageGetter: () => {},
    selectedPageIndex: 1,
    width: 0,
  };

  return SortableContainer(ReactWindowList, { withRef: true });
};

export default memoize(SortablePageList);
