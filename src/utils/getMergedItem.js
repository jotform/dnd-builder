import memoizeOne from 'memoize-one';
import fontFallbackMap from './fontFallbackMap';

const getFallbackFonts = item => {
  const props = Object.keys(item);
  if (!props.some(p => /fontfamily/gi.test(p))) {
    return item;
  }

  const fallbacks = {};

  const fontKeys = props.filter(p => /fontfamily/gi.test(p));
  fontKeys.forEach(fontKey => {
    const initValue = item[fontKey];
    fallbacks[fontKey] = fontFallbackMap[initValue]
      || `"${initValue}", ${fontFallbackMap.default}`;
  });

  return { ...item, ...fallbacks };
};

const getMemoizedFallbackFonts = memoizeOne(getFallbackFonts);

const getMergedItem = (item, acceptedItems) => {
  const { itemType } = item;
  const defaultItem = (
    acceptedItems[itemType] && acceptedItems[itemType].defaultItem
  ) || {};

  const mergedWithFallbackFonts = getMemoizedFallbackFonts({ ...defaultItem, ...item });

  return mergedWithFallbackFonts;
};

export default memoizeOne(getMergedItem);
