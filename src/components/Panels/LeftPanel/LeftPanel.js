import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Panel from '../../Builder/Panel';
import { useBuilderContext } from '../../../utils/builderContext';
import { leftPanelConfigPropType } from '../../../constants/propTypes';
import Elements from './Elements';
import LeftPanelOpener from './LeftPanelOpener';
import { usePropContext } from '../../../utils/propContext';

const LeftPanel = ({
  leftPanelConfig,
  onItemAdd,
}) => {
  /*
    This context cause additional render but it only renders LeftPanel and Panel components
    If you see Elements Component is rendered unnecessary,
      please get these propContext values from prop.
  */
  const { acceptedItems, onAnEventTrigger } = usePropContext();

  const { isLeftPanelOpen } = useBuilderContext();

  const panelAdditionalClassName = classNames(
    'jfReport-toolbox f-height',
    {
      isIdle: !isLeftPanelOpen,
    },
  );

  return (
    <Panel additionalClassName={panelAdditionalClassName}>
      <LeftPanelOpener />
      <Elements
        acceptedItems={acceptedItems}
        leftPanelConfig={leftPanelConfig}
        onAnEventTrigger={onAnEventTrigger}
        onItemAdd={onItemAdd}
      />
    </Panel>
  );
};

LeftPanel.propTypes = {
  leftPanelConfig: leftPanelConfigPropType,
  onItemAdd: PropTypes.func,
};

LeftPanel.defaultProps = {
  leftPanelConfig: [],
  onItemAdd: () => {},
};

export default memo(LeftPanel);
