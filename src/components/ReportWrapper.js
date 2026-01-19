import { memo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useBuilderStore } from '../contexts/BuilderContext';
import { useFitZoom } from '../utils/hooks';
import { usePropContext } from '../contexts/PropContext';

const getModeClass = mode => `${mode}Mode`;

const ReportWrapper = ({
  children = null,
  mode = '',
  pageCount = 0,
  theme = 'lightMode',
}) => {
  const isAllSlidesPanelOpen = useBuilderStore(state => state.isAllSlidesPanelOpen);
  const isLeftPanelOpen = useBuilderStore(state => state.isLeftPanelOpen);
  const isRightPanelOpen = useBuilderStore(state => state.isRightPanelOpen);
  const isSlidesPanelOpen = useBuilderStore(state => state.isSlidesPanelOpen);
  const setIsLeftPanelOpen = useBuilderStore(state => state.setIsLeftPanelOpen);
  const setIsSlidesPanelOpen = useBuilderStore(state => state.setIsSlidesPanelOpen);
  const setZoom = useBuilderStore(state => state.setZoom);
  const { settings } = usePropContext();
  const decidedWhichPanelToOpen = useRef(false);

  useFitZoom({
    handler: setZoom,
    isModeCustomize: mode === 'customize',
    settings,
  });

  useEffect(() => {
    if (mode !== 'customize' || decidedWhichPanelToOpen.current) {
      return;
    }

    if (pageCount > 1) {
      if (isLeftPanelOpen) {
        setIsLeftPanelOpen(false);
      }
      setIsSlidesPanelOpen(true);
    } else {
      if (isSlidesPanelOpen) {
        setIsSlidesPanelOpen(false);
      }
      setIsLeftPanelOpen(true);
    }

    decidedWhichPanelToOpen.current = true;
  }, [
    mode,
    pageCount,
    isLeftPanelOpen,
    isSlidesPanelOpen,
    setIsLeftPanelOpen,
    setIsSlidesPanelOpen,
  ]);

  const wrapperClass = classNames(
    'jfReport',
    'f-height',
    'd-flex',
    getModeClass(mode),
    isLeftPanelOpen === true ? 'leftPaneIsActive' : '',
    isRightPanelOpen === true || isSlidesPanelOpen === true ? 'rightPaneIsActive' : '',
    isSlidesPanelOpen === true ? 'slidesPaneIsActive' : '',
    isAllSlidesPanelOpen === true ? 'allSlidesPaneIsActive' : '',
    theme,
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
  pageCount: PropTypes.number,
  theme: PropTypes.oneOf(['lightMode', 'darkMode']),
};

export default memo(ReportWrapper);
