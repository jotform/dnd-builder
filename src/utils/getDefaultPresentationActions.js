import { useMemo, useCallback } from 'react';
import { useIcons } from '../hooks/useIcons';

export const useGetDefaultPresentationActions = ({
  isFullscreen,
  toggleFullscreen,
}) => {
  const { enterFullscreen: EnterFullscreenIcon, exitFullscreen: ExitFullscreenIcon, print: PrintIcon } = useIcons();

  const handleToggleFullscreen = useCallback(
    () => toggleFullscreen(!isFullscreen),
    [isFullscreen, toggleFullscreen],
  );

  const actions = useMemo(() => ({
    present: (
      <button
        key="present"
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        className="jfReportButton isAccent"
        onClick={handleToggleFullscreen}
        type="button"
      >
        {isFullscreen ? (
          <ExitFullscreenIcon className="jfReportSVG icon-fullscreen" />
        ) : (
          <EnterFullscreenIcon className="jfReportSVG icon-fullscreen" />
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
        <PrintIcon className="jfReportSVG icon-print" />
      </button>
    ),
  }), [isFullscreen, handleToggleFullscreen]);

  return actions;
};
