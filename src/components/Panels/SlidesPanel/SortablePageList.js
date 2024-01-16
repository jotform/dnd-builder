import { PureComponent, createRef } from 'react';
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
}));

const SortablePageList = Component => {
  class ReactWindowList extends PureComponent {
    constructor(props) {
      super(props);

      this.sortablePageListRef = createRef();
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
    width: 0,
  };

  return SortableContainer(ReactWindowList, { withRef: true });
};

export default memoize(SortablePageList);
