import { memo, Fragment } from 'react';
import PropTypes from 'prop-types';
import Section from '../../Builder/Section';
import SectionWithSearch from '../../Builder/SectionWithSearch';
import Element from '../../Builder/Element';
import { leftPanelConfigPropType } from '../../../constants/propTypes';
import LeftPanelCloser from './LeftPanelCloser';
import { useBuilderContext } from '../../../utils/builderContext';
import Tabs from '../../Builder/Tabs';
import { getTabsWithElements } from '../../../utils/functions';
import { useTranslatedTexts } from '../../../utils/hooks';

const Elements = ({
  acceptedItems,
  leftPanelConfig,
  onAnEventTrigger,
  onItemAdd,
}) => {
  const {
    activeTab,
    setActiveElement,
    setIsRightPanelOpen,
    zoom,
  } = useBuilderContext();
  const { ADD_ELEMENT } = useTranslatedTexts();

  // Tabs
  const tabDetails = getTabsWithElements(leftPanelConfig);
  const tabs = Object.keys(tabDetails);

  let tabsWithElements = [];
  let hasSearch = false;
  let searchKeys = [];

  if (tabs.length > 0) {
    const {
      elements: _elements,
      hasSearch: _hasSearch,
      searchKeys: _searchKeys,
    } = tabDetails[tabs[activeTab.left]];
    [tabsWithElements, hasSearch, searchKeys] = [_elements, _hasSearch, _searchKeys];
  }

  const WrapperSection = hasSearch ? SectionWithSearch : Section;
  const wrapperProps = hasSearch ? {
    elements: tabsWithElements,
    hasSearch,
    searchKeys,
  } : {};

  const getElements = (elements, Search = Fragment) => {
    const _elements = !hasSearch ? tabsWithElements : elements;
    return (
      <>
        <Tabs
          panel="left"
          tabs={tabs}
        />
        {Search}
        {Array.isArray(_elements) && _elements.map((element, index) => (
          <Element
            key={index.toString()}
            acceptedItems={acceptedItems}
            onAnEventTrigger={onAnEventTrigger}
            onItemAdd={onItemAdd}
            setActiveElement={setActiveElement}
            setIsRightPanelOpen={setIsRightPanelOpen}
            zoom={zoom}
            {...element}
          />
        ))}
      </>
    );
  };

  return (
    <div className="toolItemWrapper f-height d-flex dir-col o-auto p-relative">
      <LeftPanelCloser />
      <WrapperSection
        title={ADD_ELEMENT}
        {...wrapperProps}
      >
        {!hasSearch ? getElements() : getElements}
      </WrapperSection>
    </div>
  );
};

Elements.propTypes = {
  acceptedItems: PropTypes.shape({}),
  leftPanelConfig: leftPanelConfigPropType,
  onAnEventTrigger: PropTypes.func,
  onItemAdd: PropTypes.func,
};

Elements.defaultProps = {
  acceptedItems: {},
  leftPanelConfig: [],
  onAnEventTrigger: () => { },
  onItemAdd: () => {},
};

export default memo(Elements);
