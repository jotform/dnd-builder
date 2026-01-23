import PropTypes from 'prop-types';
import { useIcons } from '../../../hooks/useIcons';

const PageNavigation = ({
  currentPage = 1,
  decrease = () => {},
  increase = () => {},
  pageCount = 1,
}) => {
  const { arrowLeft: ArrowLeftIcon } = useIcons();
  return (
    <div className="forSlide">
      <div className="navigation-container">
        {pageCount !== 1 && (
          <button
            aria-label="Previous Slide"
            className="controllerItem isGray"
            onClick={decrease}
            type="button"
          >
            <ArrowLeftIcon className="jfReportSVG icon-navs" />
          </button>
        )}
        <span className="controllerIndicator">
          {currentPage}
          <span>
            /
            {pageCount}
          </span>
        </span>
        {pageCount !== 1 && (
          <button
            aria-label="Next Slide"
            className="controllerItem isGray"
            onClick={increase}
            type="button"
          >
            <ArrowLeftIcon className="jfReportSVG icon-navs" />
          </button>
        )}
      </div>
    </div>
  );
};

PageNavigation.propTypes = {
  currentPage: PropTypes.number,
  decrease: PropTypes.func,
  increase: PropTypes.func,
  pageCount: PropTypes.number,
};

export default PageNavigation;
