import {
  memo,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import Section from '../../Builder/Section';
import Element from '../../Builder/Element';
import { leftPanelConfigPropType } from '../../../constants/propTypes';
import LeftPanelCloser from './LeftPanelCloser';
import { useBuilderStore } from '../../../contexts/BuilderContext';
import Tabs from '../../Builder/Tabs';
import { getTabsWithElements } from '../../../utils/functions';
import { useTranslatedTexts } from '../../../utils/hooks';
import SearchInput from '../../Builder/SearchInput';
import { usePropStore } from '../../../contexts/PropContext';

const Elements = () => {
  const leftPanelConfig = usePropStore(state => state.leftPanelConfig);
  const activeTab = useBuilderStore(state => state.activeTab);
  const { ADD_ELEMENT, NO_RESULT } = useTranslatedTexts();

  // Tabs
  const tabDetails = getTabsWithElements(leftPanelConfig);
  const tabs = useMemo(() => {
    return Object.keys(tabDetails);
  }, [tabDetails]);

  const {
    elements = {},
    hasSearch = false,
  } = useMemo(() => {
    return tabDetails[tabs[activeTab.left]] || {};
  }, [activeTab.left, tabDetails, tabs]);

  const elementWillBeUsed = useMemo(() => {
    return Array.isArray(elements) ? elements : [];
  }, [elements]);

  const flatElements = useMemo(() => {
    return elementWillBeUsed.reduce((acc, item) => {
      if (Array.isArray(item.elements)) {
        return acc.concat(item.elements);
      }
      return acc.concat(item);
    }, []);
  }, [elementWillBeUsed]);

  const [searchElements, setSearchElements] = useState(elementWillBeUsed);

  useEffect(() => {
    setSearchElements(elementWillBeUsed);
  }, [elementWillBeUsed]);

  const filterElementsBySearch = useCallback(value => {
    if (value === '') {
      setSearchElements(elementWillBeUsed);
      return;
    }
    const filteredElements = flatElements.filter(element => element.title.toLowerCase().includes(value.toLowerCase()));
    setSearchElements(filteredElements);
  }, [elementWillBeUsed, flatElements]);

  const renderElements = useCallback(items => {
    return items.map((item, index) => {
      if (Array.isArray(item.elements)) {
        return (
          <div
            key={item.section || index}
            className="toolItem-subSection"
          >
            <span className="toolItem-subSection-title">{item.title}</span>
            {item.elements.map((el, elIndex) => (
              <Element
                key={elIndex.toString()}
                {...el}
              />
            ))}
          </div>
        );
      }
      return (
        <Element
          key={index.toString()}
          {...item}
        />
      );
    });
  }, []);

  return (
    <div className="toolItemWrapper f-height d-flex dir-col o-auto p-relative">
      <LeftPanelCloser />
      <Section
        title={ADD_ELEMENT}
      >
        <Tabs
          panel="left"
          tabs={tabs}
        />
        {hasSearch && (
          <SearchInput onSearch={filterElementsBySearch} />
        )}
        <div className="toolItem-tabContent">
          {searchElements.length > 0 ? renderElements(searchElements) : (
            <div className="no-search-result-text">{NO_RESULT}</div>
          )}
        </div>
      </Section>
    </div>
  );
};

Elements.propTypes = {
  acceptedItems: PropTypes.shape({}),
  leftPanelConfig: leftPanelConfigPropType,
  onAnEventTrigger: PropTypes.func,
  onItemAdd: PropTypes.func,
};

export default memo(Elements);
