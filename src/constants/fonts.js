export const fontTypes = {
  googleDisplayFonts: [
    'Bevan',
    'Abril Fatface',
    'Diplomata',
    'Fredoka One',
    'Galada',
    'Lobster',
    'Playball',
    'Sail',
  ],
  googleForeignDisplayFonts: [
    'Noto Serif SC',
    'Katibeh',
    'ZCOOL QingKe HuangYou',
    'Gugi',
  ],
  googleForeignSansSerifFonts: [
    'Noto Sans JP',
    'Harmattan',
    'Noto Sans SC',
    'Noto Sans KR',
  ],
  googleForeignSerifFonts: [
    'Noto Serif SC',
    'Scheherazade',
    'Noto Serif KR',
  ],
  googleSansSerifFonts: [
    'Montserrat',
    'Open Sans',
    'Roboto',
    'Ubuntu',
  ],
  googleSerifFonts: [
    'Bitter',
    'PT Serif',
  ],
  licencedFonts: [
    'Circular',
  ],
  systemDisplayFonts: [
    'Comic Sans MS',
  ],
  systemSansSerifFonts: [
    'Arial',
    'Arial Black',
    'Courier New',
    'Helvetica',
    'Tahoma',
    'Trebuchet MS',
    'Verdana',
    'Impact',
  ],
  systemSerifFonts: [
    'Georgia',
    'Times New Roman',
  ],
};

fontTypes.googleNonforeignFonts = [
  ...fontTypes.googleSerifFonts, ...fontTypes.googleSansSerifFonts,
  ...fontTypes.googleDisplayFonts,
];

fontTypes.completeSystemFonts = [
  ...fontTypes.systemSerifFonts, ...fontTypes.systemSansSerifFonts,
  ...fontTypes.systemDisplayFonts,
];

fontTypes.completeGoogleFonts = [
  ...fontTypes.googleNonforeignFonts, ...fontTypes.googleForeignSerifFonts,
  ...fontTypes.googleForeignSansSerifFonts, ...fontTypes.googleForeignDisplayFonts,
].filter((elem, index, self) => index === self.indexOf(elem));

fontTypes.completeLicencedFonts = [
  ...fontTypes.licencedFonts,
].filter((elem, index, self) => index === self.indexOf(elem));

fontTypes.fonts = [
  ...fontTypes.googleNonforeignFonts,
  ...fontTypes.completeSystemFonts,
  ...fontTypes.completeLicencedFonts].sort();

export const fontSizes = ['6', '7', '8', '9', '10', '11',
  '12', '14', '16', '18', '24', '30', '36', '48', '60', '72', '96', '100'];

export const borderProps = {
  style: [
    {
      label: 'Solid',
      value: 'solid',
    },
    {
      label: 'Dotted',
      value: 'dotted',
    },
    {
      label: 'Dashed',
      value: 'dashed',
    },
  ],
  width: [
    {
      label: 'Thick',
      value: 'thick',
    },
    {
      label: 'Medium',
      value: 'medium',
    },
    {
      label: 'Thin',
      value: 'thin',
    },
  ],
};
