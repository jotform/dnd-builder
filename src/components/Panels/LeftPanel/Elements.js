import React, { memo } from 'react';
import PropTypes from 'prop-types';
import SectionWithSearch from '../../Builder/SectionWithSearch';
import Element from '../../Builder/Element';
import { leftPanelConfigPropType } from '../../../constants/propTypes';
import LeftPanelCloser from './LeftPanelCloser';
import { useBuilderContext } from '../../../utils/builderContext';

const Elements = ({
  acceptedItems,
  leftPanelConfig,
  onAnEventTrigger,
  onItemAdd,
}) => {
  const {
    setActiveElement,
    setIsRightPanelOpen,
    zoom,
  } = useBuilderContext();

  return (
    <div className="toolItemWrapper f-height d-flex dir-col o-auto p-relative">
      <LeftPanelCloser />
      {leftPanelConfig.map(section => (
        <SectionWithSearch
          key={section.title}
          elements={section.elements}
          hasSearch={section.hasSearch}
          searchKeys={section.searchKeys}
          title={section.title}
        >
          {elements => elements.map((element, index) => (
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
        </SectionWithSearch>
      ))}
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
