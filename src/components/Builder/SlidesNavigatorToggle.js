import { useBuilderStore } from '../../contexts/BuilderContext';
import { useTranslatedTexts } from '../../utils/hooks';
import * as icons from '../../utils/icons';

const SlidesNavigatorToggle = () => {
  const setIsSlidesNavigatorOpen = useBuilderStore(state => state.setIsSlidesNavigatorOpen);
  const isSlidesNavigatorOpen = useBuilderStore(state => state.isSlidesNavigatorOpen);
  const { SLIDES_NAVIGATOR_TOGGLE } = useTranslatedTexts();

  const slidesNavigatorToggleHandler = () => {
    setIsSlidesNavigatorOpen(!isSlidesNavigatorOpen);
  };

  return (
    <div className="floatingController slides-navigator-toggle">
      <div className="floatingController-container">
        <button
          className="controllerItem"
          onClick={slidesNavigatorToggleHandler}
          title={SLIDES_NAVIGATOR_TOGGLE}
          type="button"
        >
          {isSlidesNavigatorOpen ? <icons.anglesLeft className="toolbar-icon angles-left" /> : <icons.slides className="toolbar-icon slides" />}
        </button>
      </div>
    </div>
  );
};

export default SlidesNavigatorToggle;
