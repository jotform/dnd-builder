import { memo } from 'react';
import { usePropStore } from '../../contexts/PropContext';
import getMergedItem from '../../utils/getMergedItem';

const getItemComponent = (elementName, Elements) => {
  return Elements[elementName] && Elements[elementName].Component
    ? Elements[elementName].Component
    : Elements.text.Component;
};

const ReportItemRenderer = ({
  children,
  item,
}) => {
  const acceptedItems = usePropStore(state => state.acceptedItems);
  const mergedItem = getMergedItem(item, acceptedItems);
  return children(getItemComponent(item.itemType, acceptedItems), mergedItem);
};

export default memo(ReportItemRenderer);
