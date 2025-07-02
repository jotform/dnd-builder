import PropTypes from 'prop-types';
import { useBuilderContext } from '../../../utils/builderContext';
import PageToolbar from './PageToolbar';
import TextToolbar from './TextToolbar';
import ImageToolbar from './ImageToolbar';

const ToolbarRenderer = ({
  onItemChange, onSettingChange, pages, settings,
}) => {
  const {
    activeElement,
  } = useBuilderContext();

  const getActivePageItem = () => {
    const page = pages && Array.isArray(pages) && pages[0];
    const { items } = page;
    if (!activeElement || (Array.isArray(activeElement) && activeElement.length > 1)) return null;
    return items.find(item => item.id === activeElement[0]);
  };

  const activePageItem = getActivePageItem();
  const activePageItemType = activePageItem && activePageItem?.itemType;

  switch (true) {
    case activePageItemType === 'text':
      return (
        <TextToolbar
          activePageItem={activePageItem}
          onItemChange={onItemChange}
        />
      );
    case activePageItemType === 'image':
      return (
        <ImageToolbar
          activePageItem={activePageItem}
          onItemChange={onItemChange}
        />
      );
    default:
      return (
        <PageToolbar
          onSettingChange={onSettingChange}
          settings={settings}
        />
      );
  }
};

ToolbarRenderer.propTypes = {
  onItemChange: PropTypes.func,
  onSettingChange: PropTypes.func,
  pages: PropTypes.arrayOf(PropTypes.shape({})),
  settings: PropTypes.shape({}),
};

ToolbarRenderer.defaultProps = {
  onItemChange: () => {},
  onSettingChange: () => {},
  pages: [],
  settings: {},
};

export default ToolbarRenderer;
