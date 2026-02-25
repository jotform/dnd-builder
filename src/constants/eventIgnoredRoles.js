/**
 * If an HTML Tag has its role attribute set as one of the
 * members of this array, events that originate from it
 * should be ignored by event handlers.
 */
export const EVENT_IGNORED_ROLES = [
  'dialog',
];

export const EVENT_IGNORED_FIELDS = [
  'combobox',
  'listbox',
  'input',
  'textarea',
  'select',
  '[contenteditable="true"]',
  '[role="combobox"]',
  '[role="listbox"]',
  '[aria-haspopup="listbox"]',
  'input[type="color"]',
  'input[type="number"]',
];
