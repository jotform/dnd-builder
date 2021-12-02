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
  showDelete: '.search-delete',
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
    HEADER: [
      {
        key: 'headerFontFamily',
        label: 'Font Family',
        options: ['Abril Fatface', 'Arial'],
        section: 'HEADER',
        type: 'dropdown',
      },
      {
        key: 'headerFontSize',
        label: 'Font Size',
        options: ['6', '7', '8'],
        section: 'HEADER',
        type: 'dropdown',
        unit: 'pt',
        wrapperClass: 'isHalf',
      },
    ],
    LINE: [
      {
        key: 'headerLineShow',
        label: 'Show Line',
        section: 'LINE',
        type: 'toggle',
        wrapperClass: 'isOneLine',
      },
      {
        label: '',
        section: 'LINE',
        static: true,
        type: 'divider',
      },
    ],
    SUBHEADER: [
      {
        key: 'subHeaderShow',
        label: 'Show Subheader',
        section: 'SUBHEADER',
        type: 'toggle',
        wrapperClass: 'isOneLine',
      },
    ],
  },
  imageSettings: {
    'ENTER URL': [
      {
        key: 'url',
        section: 'ENTER URL',
        type: 'enterImageURL',
        useImageSizeUpdate: true,
      },
    ],
    'MY IMAGES': [
      {
        key: 'url',
        section: 'MY IMAGES',
        useImageSizeUpdate: true,
      },
    ],
    UPLOAD: [
      {
        accept: 'image/*',
        key: 'url',
        label: 'IMAGE UPLOAD',
        section: 'UPLOAD',
        useImageSizeUpdate: true,
      },
    ],
  },
  layoutSettings: {
    GENERAL: [
      {
        key: 'shapeTypeFieldSet',
        label: 'SIZE',
        section: 'GENERAL',
        static: true,
        type: 'fieldSet',
      },
      {
        key: 'shapeTypeFieldSet',
        label: 'STYLE',
        section: 'GENERAL',
        static: true,
        type: 'fieldSet',
      },
      {
        key: 'showBranding',
        label: 'Show Jotform Branding',
        section: 'GENERAL',
        wrapperClass: 'isOneLine',
      },
      {
        key: 'showBranding',
        section: 'GENERAL',
      },
    ],
  },
};
