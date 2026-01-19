import { memo } from 'react';
import { usePropContext } from '../../contexts/PropContext';

const getItemComponent = (elementName, Elements) => {
  return Elements[elementName] && Elements[elementName].Component
    ? Elements[elementName].Component
    : Elements.text.Component;
};

const ReportItemRenderer = ({
  children,
  item,
}) => {
  const { acceptedItems } = usePropContext();
  return children(getItemComponent(item.itemType, acceptedItems), item);
};

export default memo(ReportItemRenderer);
