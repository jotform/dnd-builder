export const selectors = {
  controllerIndicator: '.controllerIndicator',
  controllerItem: '.controllerItem',
  disabled: '.disabled', 
  forSlide: '.forSlide',
  hasAdditional: '.hasAdditional',
  hasInnerScroll: '.hasInnerScroll',
  hidden: '.hidden',
  isAccent: '.isAccent',
  isGray: '.isGray',
  itemLabel: '.js-ItemLabel',
  jfReportHider: '.jfReport-hider',
  paneClose: '.paneClose',
  paneToggler: '.paneToggler',
  progressBar: '.jfPresentation-progressBar',
  reportCanvas: '.jfReport-canvas',
  rightPanelClose: '.js-closeRightPanel',
  rightPanelOpen: '.js-openRightPanel',
  showDelete: '.showDelete',
  tabLabel: '.js-tabLabel',
  titleIcon: '.titleIcon',
  titleName: '.js-titleName',
  toolItem: '.js-toolItem',
  toolItemName: '.js-toolItemName',
  toolItemTitle: '.js-title',
  toolTabsTab: '.toolTabs-tab',
  toolTitle: '.js-toolTitle',
};

export const settings = {
  headerSettings: {
    Header: [
      {
        key: 'headerFontFamily',
        label: 'Font Family',
        options: ['Abril Fatface', 'Arial'],
        section: 'Header',
        type: 'dropdown',
      },
      {
        key: 'headerFontSize',
        label: 'Font Size',
        options: ['6', '7', '8'],
        section: 'Header',
        type: 'dropdown',
        unit: 'pt',
        wrapperClass: 'isHalf',
      },
    ],
    Line: [
      {
        key: 'headerLineShow',
        label: 'Show Line',
        section: 'Line',
        type: 'toggle',
        wrapperClass: 'isOneLine',
      },
      {
        label: '',
        section: 'Line',
        static: true,
        type: 'divider',
      },
    ],
    Subheader: [
      {
        key: 'subHeaderShow',
        label: 'Show Subheader',
        section: 'Subheader',
        type: 'toggle',
        wrapperClass: 'isOneLine',
      },
    ],
  },
  imageSettings: {
    'Enter URL': [
      {
        key: 'url',
        label: 'Enter URL',
        section: 'Enter URL',
        type: 'enterImageURL',
        useImageSizeUpdate: true,
      },
    ],
    'My Images': [
      {
        key: 'url',
        label: 'Pick an image',
        section: 'My Images',
        useImageSizeUpdate: true,
      },
    ],
    Upload: [
      {
        accept: 'image/*',
        key: 'url',
        label: 'Image Upload',
        section: 'Upload',
        useImageSizeUpdate: true,
      },
    ],
  },
  layoutSettings: {
    General: [
      {
        key: 'shapeTypeFieldSet',
        label: 'SIZE',
        section: 'General',
        static: true,
        type: 'fieldSet',
      },
      {
        key: 'shapeTypeFieldSet',
        label: 'STYLE',
        section: 'General',
        static: true,
        type: 'fieldSet',
      },
      {
        key: 'showBranding',
        label: 'Show JotForm Branding',
        section: 'General',
        wrapperClass: 'isOneLine',
      },
      {
        key: 'showBranding',
        section: 'General',
      },
    ],
  },
};
