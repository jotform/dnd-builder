import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import classNames from 'classnames';
import Panel from '../../Builder/Panel';
import Section from '../../Builder/Section';
import Layout from '../../../constants/reportSettings';
import Page from '../../../constants/pageSettings';
import { useBuilderStore } from '../../../contexts/BuilderContext';
import { usePropStore } from '../../../contexts/PropContext';
import { findItemById, getTabsWithSettings } from '../../../utils/functions';
import { useTranslatedTexts } from '../../../utils/hooks';
import {
  REPORT_SETTINGS_ITEM_TYPE, PAGE_SETTINGS_ITEM_TYPE,
} from '../../../constants/itemTypes';
import Tabs from '../../Builder/Tabs';
import Settings from './Settings';
import RightPanelToggler from './RightPanelToggler';

const exceptionalClasses = [
  'pageSettingSideBtn',
  'paneClose',
  'paneToggler',
  'forZoom',
  'jSheetContextMenu',
  'page-toolbar',
  'report-item-toolbar',
  'zoom-toolbar',
  'controllerItem',
];

const RightPanel = () => {
  const activeTab = useBuilderStore(state => state.activeTab);
  const editedElement = useBuilderStore(state => state.editedElement);
  const isRightPanelOpen = useBuilderStore(state => state.isRightPanelOpen);
  const isSlidesPanelOpen = useBuilderStore(state => state.isSlidesPanelOpen);
  const resetActiveElements = useBuilderStore(state => state.resetActiveElements);
  const setActiveTab = useBuilderStore(state => state.setActiveTab);
  const setIsRightPanelOpen = useBuilderStore(state => state.setIsRightPanelOpen);
  const clickOutsideIgnoreSelectors = useBuilderStore(state => state.clickOutsideIgnoreSelectors);

  const acceptedItems = usePropStore(state => state.acceptedItems);
  const layoutSettings = usePropStore(state => state.settings);
  const onItemChange = usePropStore(state => state.onItemChange);
  const onPageChange = usePropStore(state => state.onPageChange);
  const onSettingChange = usePropStore(state => state.onSettingChange);
  const pages = usePropStore(state => state.pages);
  const itemAccessor = usePropStore(state => state.itemAccessor);

  const panelRef = useRef(null);
  const translatedTexts = useTranslatedTexts();

  const settingMap = useMemo(() => ({
    i_: {
      details: id => {
        const item = findItemById(id, pages);
        return item;
      },
      settings: item => {
        return acceptedItems[item.itemType];
      },
      title: item => {
        const textKey = `${(acceptedItems[item.itemType].title || item.itemType).toLocaleUpperCase()}_SETTINGS`;
        return translatedTexts[textKey] || acceptedItems[item.itemType].title;
      },
      updater: onItemChange,
    },
    l_: {
      details: () => {
        return {
          ...layoutSettings,
          id: REPORT_SETTINGS_ITEM_TYPE,
          itemType: REPORT_SETTINGS_ITEM_TYPE,
        };
      },
      settings: () => {
        return acceptedItems[REPORT_SETTINGS_ITEM_TYPE] || Layout;
      },
      title: () => translatedTexts.LAYOUT_SETTINGS,
      updater: onSettingChange,
    },
    p_: {
      details: id => {
        return {
          backgroundColor: layoutSettings.reportBackgroundColor,
          ...pages.find(page => page.id === id),
          itemType: PAGE_SETTINGS_ITEM_TYPE,
        };
      },
      settings: () => {
        const pageItem = acceptedItems[PAGE_SETTINGS_ITEM_TYPE] || Page;
        return {
          ...pageItem,
          settings: pageItem.settings.map(setting => {
            if (setting.key === 'pageLayer') {
              return { ...setting, updater: onItemChange };
            }
            return setting;
          }) || Page.settings,
        };
      },
      title: () => translatedTexts.PAGE_SETTINGS,
      updater: onPageChange,
    },
  }), [
    acceptedItems,
    layoutSettings,
    onItemChange,
    onPageChange,
    onSettingChange,
    translatedTexts,
    pages,
  ]);

  const editedEl = useMemo(() => {
    return settingMap[editedElement.substr(0, 2)] || settingMap.l_;
  }, [editedElement, settingMap]);

  const {
    element, selectedItem, title, updateFunc,
  } = useMemo(() => {
    const editedElId = editedElement.substr(2);
    const _selectedItem = editedEl.details(editedElId);

    if (!_selectedItem) {
      const fallbackEditedEl = settingMap.l_;
      return {
        element: fallbackEditedEl.settings(),
        selectedItem: fallbackEditedEl.details(),
        title: fallbackEditedEl.title(),
        updateFunc: fallbackEditedEl.updater,
      };
    }

    return {
      element: editedEl.settings(_selectedItem),
      selectedItem: _selectedItem,
      title: editedEl.title(_selectedItem),
      updateFunc: editedEl.updater,
    };
  }, [editedEl, editedElement, settingMap.l_]);

  // Tabs
  const tabsWithSettings = getTabsWithSettings(element, selectedItem, itemAccessor);
  const tabs = Object.keys(tabsWithSettings);

  useEffect(() => {
    const currentTab = tabs[activeTab.right];
    if (!tabsWithSettings[currentTab]) {
      // This is due to conditionaly hiding tabs
      setActiveTab('right', 0);
    }
  }, [activeTab, tabs, tabsWithSettings, setActiveTab]);

  // Panel className
  const panelAdditionalClassName = classNames(
    'jfReport-settings forSettings f-height',
    {
      isIdle: !isRightPanelOpen,
      otherOpened: isSlidesPanelOpen,
    },
  );

  const onClickOutsideForPanel = useCallback(e => {
    const isIgnoredBySelector = clickOutsideIgnoreSelectors.some(selector => selector && e.target.closest(selector));

    if (editedElement.substr(0, 2) === 'i_'
      || panelRef.current.contains(e.target)
      || panelRef.current.contains(document.activeElement)
      || isIgnoredBySelector
      || Array.from(e.target.classList).some(xClass => exceptionalClasses.includes(xClass))
      || exceptionalClasses.some(xClass => e.target.closest(`.${xClass}`))
    ) {
      return;
    }
    setIsRightPanelOpen(false);
    resetActiveElements();
  }, [clickOutsideIgnoreSelectors, editedElement, setIsRightPanelOpen, resetActiveElements]);

  useEffect(() => {
    if (isRightPanelOpen) window.addEventListener('click', onClickOutsideForPanel, false);
    return () => {
      window.removeEventListener('click', onClickOutsideForPanel, false);
    };
  }, [isRightPanelOpen, onClickOutsideForPanel]);

  return (
    <>
      <Panel
        ref={panelRef}
        additionalClassName={panelAdditionalClassName}
      >
        {isSlidesPanelOpen ? null : <RightPanelToggler />}
        <div className="toolItemWrapper f-height d-flex dir-col">
          <Section title={title}>
            <Tabs
              panel="right"
              tabs={tabs}
            />
            <Settings
              key={selectedItem.id}
              element={element}
              item={selectedItem}
              onChange={updateFunc}
              settings={tabsWithSettings}
              tabs={tabs}
            />
          </Section>
        </div>
      </Panel>
    </>
  );
};

export default RightPanel;
