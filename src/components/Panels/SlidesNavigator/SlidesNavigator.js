import { useBuilderStore } from '../../../contexts/BuilderContext';
import { useTranslatedTexts } from '../../../utils/hooks';
import SlideItemsList from './SlideItemsList';
import * as icons from '../../../utils/icons';
import { usePropStore } from '../../../contexts/PropContext';
import { scrollToTarget } from '../../../utils/functions';

const SlidesNavigator = () => {
  const isSlidesNavigatorOpen = useBuilderStore(state => state.isSlidesNavigatorOpen);
  const visiblePageOrder = useBuilderStore(state => state.visiblePageOrder);
  const { ADD_SLIDE } = useTranslatedTexts();
  const onPageAdd = usePropStore(state => state.onPageAdd);

  const onAddItemClick = () => {
    const newPageIndex = visiblePageOrder + 1;
    onPageAdd(newPageIndex);
    scrollToTarget(`pageActions-id-${newPageIndex}`, 350);
  };

  if (!isSlidesNavigatorOpen) {
    return null;
  }

  return (
    <aside className="slides-navigator">
      <button
        className="slides-navigator-add-item"
        onClick={onAddItemClick}
        title={ADD_SLIDE}
        type="button"
      >
        <icons.plus className="slides-navigator-add-item-icon" />
        <span className="slides-navigator-add-item-text">{ADD_SLIDE}</span>
      </button>
      <SlideItemsList />
    </aside>
  );
};

export default SlidesNavigator;
