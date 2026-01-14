import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { sortableContainer } from 'react-sortable-hoc';
import { arrayMove } from '../../../utils/functions';
import LayerItem from './LayerItem';
import { elementIcons } from '../../../constants/elementIcons';
import { useTranslatedTexts } from '../../../utils/hooks';

const SortableContainer = sortableContainer(({ children, onScroll }) => {
  return (
    <ul
      className="jfReportSelectOption-list withDnd forPageLayer"
      onScroll={onScroll}
    >
      {children}
    </ul>
  );
});

const PageLayer = ({
  config = {},
  item: page = {},
  onItemChange = () => {},
}) => {
  const onSortEnd = useCallback(({ newIndex, oldIndex }) => {
    const newItems = arrayMove([...page.items].reverse(), oldIndex, newIndex).map(i => i.id);
    onItemChange({
      id: page.id,
    }, { items: JSON.stringify([...newItems].reverse()) });
  }, [page.id, onItemChange, page.items]);
  const { NO_ELEMENT_IN_PAGE } = useTranslatedTexts();
  return (
    page.items.length > 0 ? (
      <SortableContainer
        helperClass="forHelper withDnd"
        lockAxis="y"
        onSortEnd={onSortEnd}
        useDragHandle
      >
        {page.items && [...page.items].reverse().map((item, index) => {
          const icon = elementIcons[item.itemType]
            ? elementIcons[item.itemType]
            : elementIcons.default;
          return (
            <LayerItem
              key={item.id}
              icon={icon}
              index={index}
              item={item}
              onItemChange={config.updater}
              optionKey={index}
              setActiveElement={config.setActiveElement}
            />
          );
        })}
      </SortableContainer>
    ) : (
      <div
        className="toolSection-notifier"
      >
        {NO_ELEMENT_IN_PAGE}
      </div>
    )
  );
};

PageLayer.propTypes = {
  config: PropTypes.shape({
    setActiveElement: PropTypes.func,
    updater: PropTypes.func,
  }),
  item: PropTypes.shape({
    id: PropTypes.string,
    isVisible: PropTypes.bool,
    itemType: PropTypes.string,
  }),
  onItemChange: PropTypes.func,
};

export default PageLayer;
