/* global Image */
import objectDiff from './object-diff';

export const getCorrectDroppedOffsetValue = (monitor, clientRect, zoom = 1) => {
  const dropTargetPosition = clientRect;

  const { x: finalX, y: finalY } = monitor.getSourceClientOffset();
  const { x: initialX, y: initialY } = monitor.getInitialSourceClientOffset();

  const newYposition = finalY > initialY
    ? (initialY + (finalY - initialY)) - dropTargetPosition.top
    : initialY - (initialY - finalY) - dropTargetPosition.top;

  const newXposition = finalX > initialX
    ? (initialX + (finalX - initialX)) - dropTargetPosition.left
    : initialX - (initialX - finalX) - dropTargetPosition.left;

  return {
    left: newXposition / zoom,
    top: newYposition / zoom,
  };
};

export const getStyles = (left, top, isDragging) => {
  return {
    height: isDragging ? 0 : '',
    left,
    opacity: isDragging ? 0 : 1,
    position: 'absolute',
    top,
  };
};

const isSelected = (id, activeElements) => {
  if (activeElements === null) return id === activeElements;
  return activeElements.indexOf(id) !== -1;
};

export const findItemById = (itemID, pages) => {
  const page = pages.find(p => p.items.find(item => item.id === itemID));
  if (!page) return null;
  return page.items.find(item => item.id === itemID);
};

export const getSelectedItems = (selectedItemsIds, pages) => {
  const page = pages.find(p => p.items.find(item => isSelected(item.id, selectedItemsIds)));
  if (!page) return null;
  return page.items.filter(item => isSelected(item.id, selectedItemsIds));
};

const traverse = (obj, condition) => condition.split('.').reduce((cur, key) => cur[key], obj);

const hideOrShowWhen = (selectedItem, setting, itemAccessor) => {
  if (selectedItem.hideSettings && setting.key !== 'showWarning') {
    return false;
  }

  if (setting.visible) {
    return typeof setting.visible === 'function'
      ? setting.visible({ item: selectedItem, itemAccessor })
      : !!setting.visible;
  }

  if (setting.hideWhen || setting.showWhen) {
    const hideCondition = !!setting.hideWhen === true;
    const conditionType = hideCondition ? 'hideWhen' : 'showWhen';
    const conditions = setting[conditionType];

    return Object.keys(conditions).every(conditionKey => {
      const condition = conditions[conditionKey];
      const conditionOfSelectedItem = conditionKey.split('.').length > 1
        ? traverse(selectedItem, conditionKey) : selectedItem[conditionKey];

      if (Array.isArray(condition)) {
        const returnValue = condition.includes(conditionOfSelectedItem);
        return hideCondition ? !returnValue : returnValue;
      }

      const returnValue = condition === conditionOfSelectedItem;
      return hideCondition ? !returnValue : returnValue;
    });
  }

  return true;
};

export const getTabsWithSettings = (element, selectedItem, itemAccessor) => {
  const settings = element.settings || element;
  return settings.reduce((tabsWithSettings, setting) => {
    const _tabsWithSettings = tabsWithSettings;
    const defaultItem = element.defaultItem || {};
    const item = { ...defaultItem, ...selectedItem };
    if (hideOrShowWhen(item, setting, itemAccessor)) {
      const settingSection = setting.section || 'GENERAL';
      if (!_tabsWithSettings[settingSection]) {
        _tabsWithSettings[settingSection] = [];
      }
      _tabsWithSettings[settingSection].push(setting);
    }
    return _tabsWithSettings;
  }, {});
};

export const getTabsWithElements = leftPanelConfig => {
  return leftPanelConfig.reduce((tabsWithSettings, config) => {
    const _tabsWithSettings = tabsWithSettings;
    const settingSection = config.section || 'GENERAL';
    _tabsWithSettings[settingSection] = config;
    return _tabsWithSettings;
  }, {});
};

export const calculateGuidePositions = (dimensions, axis, zoom = 1) => {
  const isItem = dimensions && dimensions.id;
  if (axis === 'x') {
    const start = dimensions.left;
    const middle = dimensions.left + parseInt(dimensions.width / 2, 10);
    const end = dimensions.left + dimensions.width;
    if (isItem) return [start, middle, end].map(p => p * zoom);
    return [start, middle, end];
  }
  const start = dimensions.top;
  const middle = dimensions.top + parseInt(dimensions.height / 2, 10);
  const end = dimensions.top + dimensions.height;
  if (isItem) return [start, middle, end].map(p => p * zoom);
  return [start, middle, end];
};

export const getAllGuidesForGivenAxisExceptActiveBox = (
  allGuides,
  guidesForActiveBoxAlongGivenAxis,
  axis,
) => {
  const result = Object.keys(allGuides).map(box => {
    const currentBoxGuidesAlongGivenAxis = allGuides[box][axis];
    if (currentBoxGuidesAlongGivenAxis !== guidesForActiveBoxAlongGivenAxis) {
      return currentBoxGuidesAlongGivenAxis;
    }
    return undefined;
  });

  return result.filter(guides => guides !== undefined);
};

export const checkValueProximities = (activeBoxGuidesInOneAxis, allOtherGuidesInOneAxis) => {
  let proximity = null;
  let intersection = null;
  let matchedArray = [];
  const snapThreshold = 5;
  for (let index = 0; index < allOtherGuidesInOneAxis.length; index += 1) {
    let index2 = 0;
    let index3 = 0;

    while (index2 < activeBoxGuidesInOneAxis.length
      && index3 < allOtherGuidesInOneAxis[index].length) {
      const diff = Math.abs(activeBoxGuidesInOneAxis[index2]
        - allOtherGuidesInOneAxis[index][index3]);
      if (diff <= snapThreshold) {
        proximity = { activeBoxIndex: index2, matchedBoxIndex: index3, value: diff };
        matchedArray = allOtherGuidesInOneAxis[index];
        intersection = allOtherGuidesInOneAxis[index][index3];
      }

      if (activeBoxGuidesInOneAxis[index2] < allOtherGuidesInOneAxis[index][index3]) {
        index2 += 1;
      } else {
        index3 += 1;
      }
    }
  }

  return { intersection, matchedArray, proximity };
};

export const proximityListener = (active, allGuides) => {
  const xAxisGuidesForActiveBox = allGuides[active].x;
  const yAxisGuidesForActiveBox = allGuides[active].y;
  const xAxisAllGuides = getAllGuidesForGivenAxisExceptActiveBox(
    allGuides,
    xAxisGuidesForActiveBox,
    'x',
  );
  const yAxisAllGuides = getAllGuidesForGivenAxisExceptActiveBox(
    allGuides,
    yAxisGuidesForActiveBox,
    'y',
  );
  const xAxisMatchedGuides = checkValueProximities(xAxisGuidesForActiveBox, xAxisAllGuides);
  const yAxisMatchedGuides = checkValueProximities(yAxisGuidesForActiveBox, yAxisAllGuides);

  const allMatchedGuides = {};

  if (xAxisMatchedGuides.proximity) {
    allMatchedGuides.x = {
      ...xAxisMatchedGuides,
      activeBoxGuides: xAxisGuidesForActiveBox,
    };
  }

  if (yAxisMatchedGuides.proximity) {
    allMatchedGuides.y = {
      ...yAxisMatchedGuides,
      activeBoxGuides: yAxisGuidesForActiveBox,
    };
  }

  return allMatchedGuides;
};

export const getCorrectDroppedOffsetValueBySnap = (coords, guides, itemID, pages, zoom) => {
  let newItem = findItemById(itemID, pages);
  newItem = { ...newItem, ...coords };
  const pageGuides = guides[newItem.pageID];
  const _guides = {
    ...pageGuides,
    [itemID]: {
      ...pageGuides[itemID],
      x: calculateGuidePositions(newItem, 'x', zoom),
      y: calculateGuidePositions(newItem, 'y', zoom),
    },
  };
  const match = proximityListener(itemID, _guides);
  let newActiveBoxLeft = newItem.left;
  let newActiveBoxTop = newItem.top;
  Object.keys(match).forEach(axis => {
    const { activeBoxGuides, matchedArray, proximity } = match[axis];
    const activeBoxProximityIndex = proximity.activeBoxIndex;
    const matchedBoxProximityIndex = proximity.matchedBoxIndex;
    if (axis === 'x') {
      if (activeBoxGuides[activeBoxProximityIndex] > matchedArray[matchedBoxProximityIndex]) {
        newActiveBoxLeft = newItem.left - proximity.value;
      } else {
        newActiveBoxLeft = newItem.left + proximity.value;
      }
    } else if (activeBoxGuides[activeBoxProximityIndex] > matchedArray[matchedBoxProximityIndex]) {
      newActiveBoxTop = newItem.top - proximity.value;
    } else {
      newActiveBoxTop = newItem.top + proximity.value;
    }
  });
  return {
    left: newActiveBoxLeft,
    top: newActiveBoxTop,
  };
};

export const getPosition = e => {
  var posx = 0;
  var posy = 0;

  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  } else if (e.clientX || e.clientY) {
    posx = e.clientX + document.body.scrollLeft
      + document.documentElement.scrollLeft;
    posy = e.clientY + document.body.scrollTop
      + document.documentElement.scrollTop;
  }

  return {
    x: posx,
    y: posy,
  };
};

export const getContainerPositions = (container, positions) => {
  const windowWidth = global.innerWidth
    || global.document.documentElement.clientWidth
    || global.document.body.clientWidth;

  const windowHeight = global.innerHeight
    || global.document.documentElement.clientHeight
    || global.document.body.clientHeight;

  const newPosition = { ...positions };
  const {
    height: contextHeight,
    width: contextWidth,
  } = container.getBoundingClientRect();

  if (contextWidth + newPosition.x > (windowWidth - 8)) {
    newPosition.x = windowWidth - contextWidth - 5;
  }

  if (contextHeight + newPosition.y > (windowHeight - 8)) {
    newPosition.y = windowHeight - contextHeight - 30;
  }

  const newPositions = {
    x: newPosition.x += 5,
    y: newPosition.y += 3,
  };

  return newPositions;
};

export const moveItemInArrayFromIndexToIndex = (array, fromIndex, toIndex) => {
  if (fromIndex === toIndex) return array;
  const newArray = [...array];
  const target = newArray[fromIndex];
  const inc = toIndex < fromIndex ? -1 : 1;
  for (let i = fromIndex; i !== toIndex; i += inc) {
    newArray[i] = newArray[i + inc];
  }
  newArray[toIndex] = target;
  return newArray;
};

export const findItemsOnPage = (pageID, pages) => {
  const foundPage = pages.find(page => page.id === pageID);
  if (foundPage && foundPage.items) {
    return foundPage.items;
  }
  return [];
};

// https://github.com/unclecheese/react-selectable/blob/master/src/doObjectsCollide.js
const coordsCollide = (aTop, aLeft, bTop, bLeft, aWidth, aHeight, bWidth, bHeight, tolerance) => {
  const toleranceDistance = (typeof tolerance === 'undefined') ? 0 : tolerance;

  return !(
    (((aTop + aHeight) - toleranceDistance) < bTop)
    || ((aTop + toleranceDistance) > (bTop + bHeight))
    || (((aLeft + aWidth) - toleranceDistance) < bLeft)
    || ((aLeft + toleranceDistance) > (bLeft + bWidth))
  );
};

export const collisionCheck = (item, items, startIndex, direction) => {
  let colluded = false;
  let currIndex = startIndex;
  while (!colluded && items[currIndex + direction]) {
    currIndex += direction;
    colluded = coordsCollide(
      item.top,
      item.left,
      items[currIndex].top,
      items[currIndex].left,
      item.width,
      item.height,
      items[currIndex].width,
      items[currIndex].height,
    );
  }

  if (colluded) {
    return currIndex;
  }
  return null;
};

export const moveArrayItem = (array, initialIndex, targetIndex) => {
  // mutates origin array
  array.splice(targetIndex, 0, array.splice(initialIndex, 1)[0]);
};

export const getFileName = (url = '') => {
  return url.split('/').pop().split('?')[0];
};

export const getImageSizes = (url, callback) => {
  const img = new Image();
  img.addEventListener('load', () => callback(img.width, img.height));
  img.src = url;
};

export const getVisibleHeightPx = (element, viewportRect) => {
  const rect = element.getBoundingClientRect();
  const viewportHeight = viewportRect.bottom - viewportRect.top;
  const elRect = {
    bottom: viewportRect.bottom - rect.bottom,
    height: rect.bottom - rect.top,
    top: rect.top - viewportRect.top,
  };
  const visible = {
    bottom: elRect.bottom > 0 && elRect.bottom < viewportHeight,
    top: elRect.top >= 0 && elRect.top < viewportHeight,
  };
  let px = 0;
  if (visible.top && visible.bottom) {
    px = elRect.height;
  } else if (visible.top) {
    px = viewportHeight - elRect.top;
  } else if (visible.bottom) {
    px = elRect.height + elRect.top;
  } else if (elRect.height > viewportHeight && elRect.top < 0) {
    var absTop = Math.abs(elRect.top);
    if (absTop < elRect.height) {
      px = elRect.height - absTop;
    }
  }

  return { ...visible, px };
};

export const getMostVisiblePage = (onlyId = false) => {
  const viewport = document.querySelector('.jfReport-viewport');
  if (viewport) {
    const viewportRect = viewport.getBoundingClientRect();
    const elements = Array.from(document.querySelectorAll('.jfReport-page'));
    const calculations = elements.reduce((acc, element) => {
      acc[element.getAttribute('data-id')] = getVisibleHeightPx(element, viewportRect);
      return acc;
    }, {});
    const pageID = Object.keys(calculations)
      .sort((p, n) => calculations[n].px - calculations[p].px)[0];
    if (onlyId) {
      return pageID;
    }
    return {
      attr: calculations[pageID],
      id: pageID,
    };
  }
  return false;
};

const getAvailableInitialY = (page, attribute, zoom) => {
  const rect = page.getBoundingClientRect();
  const pageHeight = rect.bottom - rect.top;
  if (attribute.top) return 0;
  const originalPageHeight = pageHeight * (1 / zoom);
  const originalVisibleHeight = attribute.px * (1 / zoom);
  return (originalPageHeight - originalVisibleHeight);
};

export const getAvailableCoordinate = (page, zoom) => {
  const isExistsPage = document.querySelector(`.jfReport-page[data-id="${page.id}"]`);
  if (!isExistsPage) return [0, 0];

  // First get initial y for scrolled page
  const initialY = getAvailableInitialY(isExistsPage, page.attr, zoom);

  const pageItems = isExistsPage.querySelectorAll('.reportItemWrapper');
  if (!pageItems.length) return [0, initialY];

  // Then get available space if there any items
  return [...pageItems].reduce((accum, item) => {
    const _accum = accum;
    const { style: { left, top } } = item;
    const coordinate = [parseInt(left, 10), parseInt(top, 10)];
    if (_accum[0] === coordinate[0] && _accum[1] === coordinate[1]) {
      _accum[0] = _accum[0] + 50;
      _accum[1] = _accum[1] + 50;
    }
    return _accum;
  }, [0, initialY]);
};

export function safeJSONParse(str, defVal = {}) {
  if (str) {
    try {
      return JSON.parse(str);
    } catch (ex) {
      return defVal;
    }
  } else {
    return defVal;
  }
}

/* View in fullscreen */
export const openFullscreenHelper = (elem = document.documentElement) => {
  if (elem.requestFullscreen) {
    return elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    return elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    return elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    return elem.msRequestFullscreen();
  }
  return Promise.resolve();
};

/* Close fullscreen */
export const closeFullscreen = () => {
  if (document.fullscreenElement
    || document.webkitFullscreenElement
    || document.mozFullScreenElement) {
    if (document.exitFullscreen) {
      return document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
      return document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
      return document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
      return document.msExitFullscreen();
    }
  }
  return Promise.resolve();
};

export const imageSizeUpdater = (item, { objectURL, url }, updateFunc) => {
  const MAX_WIDTH = 700;
  const MAX_HEIGHT = 600;
  const image = new global.Image();
  image.src = objectURL || url;

  image.onerror = () => {
    updateFunc(item, { url });
  };

  image.onload = () => {
    const { naturalHeight, naturalWidth } = image;
    let _width = naturalWidth;
    let _height = naturalHeight;

    if (naturalWidth > MAX_WIDTH) {
      _height = parseInt((MAX_WIDTH * naturalHeight) / naturalWidth, 10);
      _width = MAX_WIDTH;
    }

    if (_height > MAX_HEIGHT) {
      _width = parseInt((_width * MAX_HEIGHT) / _height, 10);
      _height = MAX_HEIGHT;
    }

    if (objectURL) {
      URL.revokeObjectURL(objectURL);
    }

    updateFunc(
      item, {
        height: _height,
        url: url,
        width: _width,
      },
    );
  };
};

export const onChangeFunction = (
  config,
  updateFunc,
  selectedItem,
  customUpdater,
) => (item, setting) => {
  if (config && config.ifValueEquals) {
    const value = setting[config.key];
    if (config.ifValueEquals[value]) {
      const settingsWillBeChanged = Object.keys(config.ifValueEquals[value])
        .reduce(
          (newSettings,
            settingKey) => {
            const { ifIsEqualPreviousValue } = config.ifValueEquals[value][settingKey];
            const { cast } = config.ifValueEquals[value][settingKey];
            let { value: newSetting } = config.ifValueEquals[value][settingKey];
            const _newSettings = newSettings;
            if (typeof newSetting !== 'string') {
              _newSettings[settingKey] = newSetting;
              return _newSettings;
            }
            const matches = newSetting.match(/{.+?}/g);
            if (matches && matches.length > 0) {
              newSetting = matches.reduce((acc, curr) => {
                let _acc = acc;
                const newValue = selectedItem[
                  curr.replace(/\{|\}/gi, '')
                ];
                _acc = newSetting.replace(curr, newValue);
                if (cast && cast === 'integer') {
                  return parseInt(_acc, 10);
                }
                return _acc;
              }, newSetting);
            }
            if (ifIsEqualPreviousValue && ifIsEqualPreviousValue !== selectedItem[settingKey]) {
              return _newSettings;
            }
            _newSettings[settingKey] = newSetting;
            return _newSettings;
          }, {},
        );
      if (customUpdater) {
        customUpdater(item, {
          ...setting,
          ...settingsWillBeChanged,
        }, updateFunc);
      } else {
        updateFunc(item, {
          ...setting,
          ...settingsWillBeChanged,
        });
      }
    } else if (customUpdater) {
      customUpdater(item, setting, updateFunc);
    } else {
      updateFunc(item, setting);
    }
  } else if (config.useImageSizeUpdate) {
    imageSizeUpdater(item, setting, updateFunc);
  } else if (customUpdater) {
    customUpdater(item, setting, updateFunc);
  } else {
    updateFunc(item, setting);
  }
};

export const exportPagesAsJSON = (acceptedItems, pages) => {
  const newPages = pages.map(page => {
    const items = page.items.map(pageItem => {
      const { details } = acceptedItems[pageItem.itemType];
      return {
        ...objectDiff(details, pageItem),
        type: details.itemType,
      };
    });
    return {
      items,
      type: 'regular',
    };
  });
  return JSON.stringify(newPages, null, 2);
};

export const getExactIconType = iconType => {
  if (iconType.indexOf('_') > -1) {
    const splitIconType = iconType.split('_');
    return splitIconType[0] + splitIconType[1].charAt(0).toUpperCase() + splitIconType[1].slice(1);
  }
  return iconType;
};

export function clipBoardHelper(string = '') {
  const urlElement = document.createElement('textarea');
  urlElement.value = string;
  document.body.appendChild(urlElement);
  urlElement.select();
  document.execCommand('Copy');
  document.body.removeChild(urlElement);
}

const arrayMoveMutate = (array, from, to) => {
  const startIndex = from < 0 ? array.length + from : from;

  if (startIndex >= 0 && startIndex < array.length) {
    const endIndex = to < 0 ? array.length + to : to;

    const [item] = array.splice(from, 1);
    array.splice(endIndex, 0, item);
  }
};

export const arrayMove = (array, from, to) => {
  const newArray = [...array];
  arrayMoveMutate(newArray, from, to);
  return newArray;
};

export const zoomHandler = ({
  handler,
  isFullscreen,
  isModeCustomize,
  limitZoom,
  onLoad,
  settings,
  useFixedPresentationBar,
  useProgressBar,
}) => {
  const { reportLayoutHeight = 794, reportLayoutWidth = 1123 } = settings;

  const { innerHeight, innerWidth } = window;

  let paddingValue = 0;

  if (!isFullscreen) { // We are not using fixed bar in fullscreen
    const padFixedBar = useFixedPresentationBar ? 50 : 0;
    const padProgressBar = useProgressBar ? 3 : 0;

    paddingValue += (padFixedBar + padProgressBar);
  }

  const _innerHeight = innerHeight - paddingValue;

  let newScale = Math.min(
    (innerWidth - (limitZoom ? 400 : 0)) / reportLayoutWidth,
    _innerHeight / reportLayoutHeight,
  );

  if (limitZoom) {
    newScale = Math.floor(newScale * 10) / 10;
  } else {
    // We need this to prevent scrollbars
    newScale = Math.floor(newScale * 100) / 100;
  }

  let newZoom = Number(newScale.toFixed(2));

  if (limitZoom && newZoom < 0.5) newZoom = 0.5;
  if (limitZoom && newZoom > 1) newZoom = 1;

  handler(newZoom, isModeCustomize, reportLayoutWidth, onLoad);

  return newZoom;
};

export const throttle = (fn, delay) => {
  let lastCall = 0;
  return (...args) => {
    const now = (new Date()).getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...args);
  };
};

export const roundForDecimalPart = num => {
  return +(`${Math.round(`${num}e+2`)}e-2`);
};

export const changePage = ({
  action,
  currentPage,
  pageCount,
  setCurrentPage,
}) => () => {
  if (currentPage + action > pageCount) {
    setCurrentPage(1);
  } else if (currentPage + action === 0) {
    setCurrentPage(pageCount);
  } else {
    setCurrentPage(currentPage + action);
  }
};

export const getScaleForPageThumbnail = (width, height) => {
  const [thumbnailMaxHeight, thumbnailMaxWidth] = [110, 156];
  const scale = thumbnailMaxHeight / height;
  if (Math.ceil(width * scale) >= thumbnailMaxWidth) {
    const newScale = thumbnailMaxWidth / width;
    return {
      left: 0,
      scale: newScale,
      top: thumbnailMaxHeight > height * newScale
        ? (thumbnailMaxHeight - (height * newScale)) / 2 : 0,
    };
  }
  return {
    left: thumbnailMaxWidth > width * scale
      ? (thumbnailMaxWidth - (width * scale)) / 2 : 0,
    scale,
    top: 0,
  };
};

export const getScaleForPageThumbnailLarge = (width, height) => {
  const thumbnailMaxHeight = 134;
  const thumbnailMaxWidth = 190;
  const defaultScaleRatio = thumbnailMaxHeight / height;
  if (width * defaultScaleRatio > thumbnailMaxWidth) {
    return thumbnailMaxWidth / width;
  }
  return defaultScaleRatio;
};

export const scrollToTarget = (id, timeout = 0, options = { behavior: 'smooth' }) => {
  setTimeout(() => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView(options);
    }
  }, timeout);
};

export const calculateHeight = (originalHeight, originalWidth, canvasWidth, mode) => {
  if (mode !== 'responsive') {
    return originalHeight;
  }
  let calculatedWidth = originalWidth;

  const ratio = originalHeight / originalWidth;

  if (originalWidth > (canvasWidth - 32)) {
    calculatedWidth = canvasWidth;
  }
  return ratio * (calculatedWidth);
};
