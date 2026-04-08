import * as icons from '../../../utils/icons';
import { useTranslatedTexts } from '../../../utils/hooks';
import { usePropStore } from '../../../contexts/PropContext';
import { useBuilderStore } from '../../../contexts/BuilderContext';
import { scrollToTarget } from '../../../utils/functions';

const AddSlideButton = () => {
  const { ADD_SLIDE } = useTranslatedTexts();
  const onPageAdd = usePropStore(state => state.onPageAdd);
  const visiblePageOrder = useBuilderStore(state => state.visiblePageOrder);
  const setVisiblePageOrder = useBuilderStore(state => state.setVisiblePageOrder);

  const onAddItemClick = () => {
    const newPageIndex = visiblePageOrder + 1;
    onPageAdd(newPageIndex);
    scrollToTarget(`pageActions-id-${newPageIndex}`, 350);
    window.setTimeout(() => {
      setVisiblePageOrder(newPageIndex);
    }, 100);
  };

  return (
    <button
      className="slides-navigator-add-item"
      onClick={onAddItemClick}
      title={ADD_SLIDE}
      type="button"
    >
      <icons.plus className="slides-navigator-add-item-icon" />
      <span className="slides-navigator-add-item-text">{ADD_SLIDE}</span>
    </button>
  );
};

export default AddSlideButton;
