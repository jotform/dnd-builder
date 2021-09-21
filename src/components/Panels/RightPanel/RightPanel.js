import {
  memo,
  useEffect,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Panel from '../../Builder/Panel';
import Section from '../../Builder/Section';
import Layout from '../../../constants/reportSettings';
import Page from '../../../constants/pageSettings';
import { useBuilderContext } from '../../../utils/builderContext';
import { usePropContext } from '../../../utils/propContext';
import { findItemById, getTabsWithSettings } from '../../../utils/functions';
import { useTranslatedTexts } from '../../../utils/hooks';
import {
  REPORT_SETTINGS_ITEM_TYPE, PAGE_SETTINGS_ITEM_TYPE,
} from '../../../constants/itemTypes';
import SettingTabs from './SettingTabs';
import Settings from './Settings';
import RightPanelToggler from './RightPanelToggler';
import { capitalize } from '../../../utils/string';

const exceptionalClasses = [
  'pageSettingSideBtn', 'paneClose', 'paneToggler', 'forZoom', 'jSheetContextMenu',
];

const RightPanel = ({
  itemAccessor,
  onItemChange,
  onPageChange,
  onSettingChange,
  pages,
}) => {
  const {
    activeTab,
    editedElement,
    isRightPanelOpen,
    isSlidesPanelOpen,
    setActiveElement,
    setActiveTab,
    setIsRightPanelOpen,
  } = useBuilderContext();
  const { acceptedItems, settings: layoutSettings } = usePropContext();
  const panelRef = useRef(null);
  const { LAYOUT_SETTINGS, PAGE_SETTINGS, SETTINGS } = useTranslatedTexts();
  const settingMap = {
    i_: {
      details: id => {
        const item = findItemById(id, pages);
        return item;
      },
      settings: item => {
        return acceptedItems[item.itemType];
      },
      title: item => {
        return `${capitalize(acceptedItems[item.itemType].title || item.itemType)} ${SETTINGS}`;
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
      title: () => LAYOUT_SETTINGS,
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
              return { ...setting, setActiveElement, updater: onItemChange };
            }
            return setting;
          }) || Page.settings,
        };
      },
      title: () => PAGE_SETTINGS,
      updater: onPageChange,
    },
  };

  let editedEl;
  let editedElId;
  let selectedItem;
  let element;
  let updateFunc;
  let title;

  const panelConfig = () => {
    selectedItem = editedEl.details(editedElId);
    element = editedEl.settings(selectedItem);
    updateFunc = editedEl.updater;
    title = editedEl.title(selectedItem);
  };

  const fallback = () => {
    setActiveElement(null);
    editedEl = settingMap.l_;
    editedElId = editedElement.substr(2);
    panelConfig();
  };

  try {
    editedEl = settingMap[editedElement.substr(0, 2)];
    editedElId = editedElement.substr(2);
    const checkSelectedItem = editedEl.details(editedElId);
    if (Object.keys(checkSelectedItem).length === 0) {
      fallback();
    } else {
      panelConfig();
    }
  } catch (e) {
    fallback();
  }

  // Tabs
  const tabsWithSettings = getTabsWithSettings(element, selectedItem, itemAccessor);
  const tabs = Object.keys(tabsWithSettings);

  useEffect(() => {
    const currentTab = tabs[activeTab];
    if (!tabsWithSettings[currentTab]) {
      // This is due to conditionaly hiding tabs
      setActiveTab(0);
    }
  }, [activeTab, tabs]);

  // Panel className
  const panelAdditionalClassName = classNames(
    'jfReport-settings forSettings f-height',
    {
      isIdle: !isRightPanelOpen,
      otherOpened: isSlidesPanelOpen,
    },
  );

  const onClickOutsideForPanel = e => {
    if (editedElement.substr(0, 2) === 'i_'
      || panelRef.current.contains(e.target)
      || panelRef.current.contains(document.activeElement)
      || Array.from(e.target.classList).some(xClass => exceptionalClasses.includes(xClass))
      || exceptionalClasses.some(xClass => e.target.closest(`.${xClass}`))
    ) {
      return;
    }
    setIsRightPanelOpen(false);
    setActiveElement(null);
  };

  useEffect(() => {
    if (isRightPanelOpen) window.addEventListener('click', onClickOutsideForPanel, false);
    return () => {
      window.removeEventListener('click', onClickOutsideForPanel, false);
    };
  }, [isRightPanelOpen]);

  return (
    <>
      <Panel
        ref={panelRef}
        additionalClassName={panelAdditionalClassName}
      >
        <RightPanelToggler />
        <div className="toolItemWrapper f-height d-flex dir-col">
          <Section title={title}>
            <SettingTabs tabs={tabs} />
            <Settings
              key={selectedItem.id}
              element={element}
              item={selectedItem}
              itemAccessor={itemAccessor}
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

RightPanel.propTypes = {
  itemAccessor: PropTypes.func,
  onItemChange: PropTypes.func,
  onPageChange: PropTypes.func,
  onSettingChange: PropTypes.func,
  pages: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
};

RightPanel.defaultProps = {
  itemAccessor: () => {},
  onItemChange: () => {},
  onPageChange: () => {},
  onSettingChange: () => {},
  pages: [],
};

export default memo(RightPanel);
