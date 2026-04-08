import { useBuilderStore } from '../../../contexts/BuilderContext';
import SlideItemsList from './SlideItemsList';
import AddSlideButton from './AddSlideButton';

const SlidesNavigator = () => {
  const isSlidesNavigatorOpen = useBuilderStore(state => state.isSlidesNavigatorOpen);

  if (!isSlidesNavigatorOpen) {
    return null;
  }

  return (
    <aside className="slides-navigator">
      <AddSlideButton />
      <SlideItemsList />
    </aside>
  );
};

export default SlidesNavigator;
