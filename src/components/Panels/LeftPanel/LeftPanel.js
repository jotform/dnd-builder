import classNames from 'classnames';
import Panel from '../../Builder/Panel';
import { useBuilderStore } from '../../../contexts/BuilderContext';
import Elements from './Elements';
import LeftPanelOpener from './LeftPanelOpener';

const LeftPanel = () => {
  const isLeftPanelOpen = useBuilderStore(state => state.isLeftPanelOpen);

  const panelAdditionalClassName = classNames(
    'jfReport-toolbox f-height',
    {
      isIdle: !isLeftPanelOpen,
    },
  );

  return (
    <Panel additionalClassName={panelAdditionalClassName}>
      <LeftPanelOpener />
      <Elements />
    </Panel>
  );
};

export default LeftPanel;
