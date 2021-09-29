const ALL_TEXTS = {
  ADD_ELEMENT: 'Add Element',
  ADD_LINK: 'Add Link',
  ADD_NEW_PAGE: 'Add Slide',
  BACKGROUND_COLOR: 'Background Color',
  DELETE: 'Delete',
  DELETE_ITEM: 'Delete Item',
  DUPLICATE_ITEM: 'Duplicate Item',
  DUPLICATE_PAGE: 'Duplicate Page',
  ELEMENTS: 'Elements',
  FIT_TO_PAGE: 'Fit to Page',
  FIT_TO_SCENE: 'Fit to Screen',
  GENERAL: 'General',
  HEIGHT: 'Height',
  ITEM_SETTINGS: 'Item Settings',
  LAYERS: 'Layers',
  LAYOUT_SETTINGS: 'Layout Settings',
  LOCK_ITEM: 'Lock Item',
  MOVE_BACKWARDS: 'Move Backwards',
  MOVE_FORWARDS: 'Move Forwards',
  MOVE_PAGE_DOWNWARDS: 'Move Page Downwards',
  MOVE_PAGE_UPWARDS: 'Move Page Upwards',
  MOVE_TO_BACK: 'Move to Back',
  MOVE_TO_FRONT: 'Move to Front',
  NO_ELEMENT_IN_PAGE: 'There is no element on this page. You can add a new element from side menu.',
  NO_RESULT: 'No result was not found',
  ORIGINAL_SIZE: 'Original Size',
  PAGE_SETTINGS: 'Page Settings',
  PAGE_STYLE: 'Page Style',
  REMOVE_PAGE: 'Remove Slide',
  SEARCH: 'Search',
  SETTINGS: 'Settings',
  SHOW_ALL: 'Show All',
  SLIDES: 'Slides',
  TOGGLE_OFF: 'OFF',
  TOGGLE_ON: 'ON',
  UNLOCK_ITEM: 'Unlock Item',
  WIDTH: 'Width',
  ZOOM_IN: 'Zoom In',
  ZOOM_OUT: 'Zoom Out',
};

class ModuleTexts {
  constructor(allTexts) {
    this._texts = allTexts;
  }

  get Texts() {
    return this._texts;
  }

  setTexts(allTexts) {
    this._texts = allTexts;
  }
}

export const SharingTextsModule = new ModuleTexts(ALL_TEXTS);
export default ALL_TEXTS;
