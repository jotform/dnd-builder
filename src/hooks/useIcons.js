import { useState, useEffect } from 'react';
import { usePropStore } from '../contexts/PropContext';
import { ICONS } from '../utils/icons';

const prepareIcons = iconSetConfig => {
  const mergedIcons = {};

  Object.keys(ICONS).forEach(categoryKey => {
    if (iconSetConfig && iconSetConfig[categoryKey]) {
      const configCategory = iconSetConfig[categoryKey];
      const staticCategory = ICONS[categoryKey];

      mergedIcons[categoryKey] = {
        ...staticCategory,
        ...configCategory,
      };
    } else {
      mergedIcons[categoryKey] = ICONS[categoryKey];
    }
  });

  const mergedAllIcons = {};
  Object.keys(mergedIcons).forEach(categoryKey => {
    Object.assign(mergedAllIcons, mergedIcons[categoryKey]);
  });

  Object.keys(mergedIcons).forEach(categoryKey => {
    delete mergedIcons[categoryKey];
  });

  Object.assign(mergedIcons, mergedAllIcons);
  return mergedIcons;
};

export const useIcons = () => {
  const iconSetConfig = usePropStore(state => state.iconSetConfig);
  const [icons, setIcons] = useState(() => prepareIcons(iconSetConfig));

  useEffect(() => {
    setIcons(prepareIcons(iconSetConfig));
  }, [iconSetConfig]);

  return icons;
};
