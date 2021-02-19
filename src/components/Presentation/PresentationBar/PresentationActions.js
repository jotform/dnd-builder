import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { getDefaultPresentationActions } from '../../../utils/getDefaultPresentationActions';
import * as icons from '../../../utils/icons';

const PresentationActions = ({
  isFullscreen,
  presentationBarActions,
  toggleFullscreen,
}) => {
  const defaultPresentationActions = useMemo(() => getDefaultPresentationActions({
    isFullscreen,
    toggleFullscreen,
  }), [isFullscreen]);

  return (
    <div className="action-container d-flex">
      {presentationBarActions.map(action => {
        if (action.isHidden) {
          return null;
        }

        if (action.handler) {
          const ActionIcon = icons[action.icon] ? icons[action.icon] : icons.pen;
          return (
            <button
              key={action.key}
              aria-label={action.key}
              className={`jfReportButton ${action.className} ${action.icon}`}
              onClick={action.handler}
              title={action.title ? action.title : null}
              type="button"
            >
              <ActionIcon className={`jfReportSVG icon-${action.icon}`} />
              {/* {action.title && <span>{action.title}</span>} */}
            </button>
          );
        }

        if (action.Component) {
          const { Component, props } = action;
          return (
            <Component
              key={action.key}
              {...(props ? props : {})}
            />
          );
        }

        const defaultAction = defaultPresentationActions[action.key];
        if (!defaultAction || defaultAction.isHidden) {
          return null;
        }

        return defaultAction;
      })}
    </div>
  );
};

PresentationActions.propTypes = {
  isFullscreen: PropTypes.bool,
  presentationBarActions: PropTypes.arrayOf(PropTypes.shape({})),
  toggleFullscreen: PropTypes.func,
};

PresentationActions.defaultProps = {
  isFullscreen: false,
  presentationBarActions: [],
  toggleFullscreen: f => f,
};

export default PresentationActions;
