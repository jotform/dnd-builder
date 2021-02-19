import React from 'react';
import PropTypes from 'prop-types';
import * as icons from '../../../utils/icons';

const PageNavigation = ({
  currentPage,
  decrease,
  increase,
  pageCount,
}) => {
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
            <icons.arrowLeft className="jfReportSVG icon-navs" />
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
            <icons.arrowLeft className="jfReportSVG icon-navs" />
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

PageNavigation.defaultProps = {
  currentPage: 1,
  decrease: () => {},
  increase: () => {},
  pageCount: 1,
};

export default PageNavigation;
