/* eslint-disable max-len */
const ALL_TEXTS = {
  ADD_ELEMENT: 'Add Element',
  ADD_LINK: 'ADD LINK',
  ADD_NEW_PAGE: 'ADD SLIDE',
  BACKGROUND_COLOR: 'Background Color',
  CHART_ELEMENT: 'Chart Element',
  CHART_SETTINGS: 'Chart Settings',
  CLICK_TO_EDIT_HEADER: 'Click to edit header',
  CLICK_TO_EDIT_TEXT: 'Click to edit text',
  DELETE: 'Delete',
  DELETE_ITEM: 'Delete Item',
  DUPLICATE_ITEM: 'Duplicate Item',
  DUPLICATE_PAGE: 'Duplicate Slide',
  ELEMENTS: 'Elements',
  ERROR_BOUNDARY_DESCRIPTION: 'We\'ve been notified of the issue and aim to fix it shortly. Please try again later.',
  ERROR_BOUNDARY_ITEM_DESCRIPTION: 'Please try removing and re-adding the item.',
  ERROR_BOUNDARY_PAGE_DESCRIPTION: 'An unexpected error occurred on this page.',
  ERROR_BOUNDARY_TITLE: 'Something went wrong!.',
  FIT_TO_PAGE: 'Fit to Slide',
  FIT_TO_SCENE: 'Fit to Screen',
  GENERAL: 'GENERAL',
  GRID_SETTINGS: 'Grid Settings',
  HEADER_SETTINGS: 'Header Settings',
  HEIGHT: 'Height',
  ICON_SETTINGS: 'Icon Settings',
  IMAGE_SETTINGS: 'Image Settings',
  ITEM_SETTINGS: 'Item Settings',
  LAYERS: 'Layers',
  LAYOUT_SETTINGS: 'Layout Settings',
  LOCK_ITEM: 'Lock Item',
  MOVE_BACKWARDS: 'Move Backwards',
  MOVE_FORWARDS: 'Move Forwards',
  MOVE_PAGE_DOWNWARDS: 'Move Slide Downwards',
  MOVE_PAGE_UPWARDS: 'Move Slide Upwards',
  MOVE_TO_BACK: 'Move to Back',
  MOVE_TO_FRONT: 'Move to Front',
  NO_ELEMENT_IN_PAGE: 'There is no element on this slide. You can add a new element from side menu.',
  NO_RESULT: 'No result was found',
  ORIGINAL_SIZE: 'Original Size',
  PAGE_ELEMENT: 'Page Element',
  PAGE_SETTINGS: 'Slide Settings',
  PAGE_STYLE: 'Slide Style',
  RECTANGLE: 'Rectangle',
  REMOVE_PAGE: 'Remove Slide',
  SEARCH: 'Search',
  SETTINGS: 'Settings',
  SHAPES_SETTINGS: 'Shape Settings',
  SHOW_ALL: 'Show All',
  SLIDES: 'Slides',
  TEXT_SETTINGS: 'Text Settings',
  TOGGLE_OFF: 'OFF',
  TOGGLE_ON: 'ON',
  UNLOCK_ITEM: 'Unlock Item',
  VIEW_ERROR_DETAILS: 'View Details',
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
