import { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useBuilderStore } from '../contexts/BuilderContext';
import { usePropStore } from '../contexts/PropContext';

const getModeClass = mode => `${mode}Mode`;

const ReportWrapper = ({
  children = null,
  mode = '',
}) => {
  const theme = usePropStore(state => state.theme);

  const isAllSlidesPanelOpen = useBuilderStore(state => state.isAllSlidesPanelOpen);
  const isLeftPanelOpen = useBuilderStore(state => state.isLeftPanelOpen);
  const isRightPanelOpen = useBuilderStore(state => state.isRightPanelOpen);
  const isSlidesPanelOpen = useBuilderStore(state => state.isSlidesPanelOpen);

  const wrapperClass = classNames(
    'jfReport',
    'f-height',
    'd-flex',
    getModeClass(mode),
    theme,
    {
      allSlidesPaneIsActive: isAllSlidesPanelOpen,
      leftPaneIsActive: isLeftPanelOpen,
      rightPaneIsActive: isRightPanelOpen || isSlidesPanelOpen,
      slidesPaneIsActive: isSlidesPanelOpen,
    },
  );
  return (
    <div
      className={wrapperClass}
    >
      {children}
    </div>
  );
};

ReportWrapper.propTypes = {
  children: PropTypes.node,
  mode: PropTypes.string,
};

export default memo(ReportWrapper);
