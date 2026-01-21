import {
  memo, useState, useEffect,
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
  const tabs = Object.keys(tabDetails);

  const [searchElements, setSearchElements] = useState([]);
  const [currentTabInfo, setCurrentTabInfo] = useState({});

  useEffect(() => {
    setCurrentTabInfo(tabDetails[tabs[activeTab.left]]);
  }, [activeTab.left]);

  const {
    elements = {},
    hasSearch = false,
    searchKeys,
  } = currentTabInfo || {};

  const elementWillBeUsed = hasSearch ? searchElements : elements;
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
          <SearchInput
            elements={elements}
            searchKeys={searchKeys}
            setElements={setSearchElements}
          />
        ) }
        <div className="toolItem-tabContent">
          { (searchElements === 'noResult' && hasSearch)
            && <div className="no-search-result-text">{NO_RESULT}</div>}
          {Array.isArray(elementWillBeUsed) && elementWillBeUsed.map((element, index) => (
            <Element
              key={index.toString()}
              {...element}
            />
          ))}
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
