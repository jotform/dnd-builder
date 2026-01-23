import { useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import PageNavigation from './PageNavigation';
import PresentationActions from './PresentationActions';
import SelectZoom from './SelectZoom';
import { changePage } from '../../../utils/functions';
import { useBuilderStore } from '../../../contexts/BuilderContext';
import { usePresentationStore } from '../../../contexts/PresentationContext';

const PresentationBar = ({
  isVisible = true,
}) => {
  const currentPage = usePresentationStore(state => state.currentPage);
  const setCurrentPage = usePresentationStore(state => state.setCurrentPage);
  const fittedZoom = usePresentationStore(state => state.fittedZoom);
  const pageCount = usePresentationStore(state => state.pageCount);
  const setZoom = useBuilderStore(state => state.setZoom);
  const zoom = useBuilderStore(state => state.zoom);

  const pageChanger = action => changePage({
    action,
    currentPage,
    pageCount,
    setCurrentPage,
  });

  useLayoutEffect(() => {
    // Hi, this is a horrible solution to a horrible Chromium bug.
    // It is temporary, and once chromium crew solves the
    // https://bugs.chromium.org/p/chromium/issues/detail?id=1440024
    // we will be able to remove it, the idea itself comes from
    // them, btw https://bugs.chromium.org/p/chromium/issues/detail?id=1440024#c3
    if (window.chrome) {
      // Detaching and re-attaching to dom likely forces a re-draw
      // of the svg.
      document.querySelectorAll('svg.recharts-surface').forEach(domNode => {
        const parent = domNode.parentElement;
        parent.removeChild(domNode);
        parent.appendChild(domNode);
      });
    }
  });

  const handleZoomChange = e => {
    setZoom(e.target.value / 100);
    e.target.blur(); // prevent mixup with other keyboard shortcuts
  };

  return (
    <div className="jfPresentation-barContainer d-flex j-center f-width">
      <div
        className={`
          floatingController p-relative d-flex a-center j-between w-fit forBar
          ${isVisible ? '' : ' hidden'}
        `}
      >
        <div className="toolSection-dropdownWrapper isDark">
          <SelectZoom
            fittedZoom={fittedZoom}
            handleZoomChange={handleZoomChange}
            zoom={zoom}
          />
        </div>
        {pageCount > 1 && (
          <>
            <div className="divider" />
            <PageNavigation
              currentPage={currentPage}
              decrease={pageChanger(-1)}
              increase={pageChanger(1)}
              isVisible={pageCount > 1}
              pageCount={pageCount}
            />
            <div className="divider" />
          </>
        )}
        <PresentationActions />
      </div>
    </div>
  );
};

PresentationBar.propTypes = {
  isVisible: PropTypes.bool,
};

export default PresentationBar;
