import React from 'react';
import * as icons from './icons';

export const getDefaultPresentationActions = ({
  isFullscreen,
  toggleFullscreen,
}) => ({
  present: (
    <button
      key="present"
      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      className="jfReportButton isAccent"
      onClick={toggleFullscreen(!isFullscreen)}
      type="button"
    >
      {isFullscreen ? (
        <icons.exitFullscreen className="jfReportSVG icon-fullscreen" />
      ) : (
        <icons.enterFullscreen className="jfReportSVG icon-fullscreen" />
      )}
    </button>
  ),
  print: (
    <button
      key="print"
      aria-label="Print"
      className="jfReportButton isAccent print"
      onClick={() => window.print()}
      type="button"
    >
      <icons.print className="jfReportSVG icon-print" />
    </button>
  ),
});
