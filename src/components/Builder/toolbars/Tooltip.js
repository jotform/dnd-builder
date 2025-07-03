import PropTypes from 'prop-types';
import { useState, useRef } from 'react';

const Tooltip = ({ children, content, placement = 'bottom' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  const showTooltip = () => {
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  const getTooltipClasses = () => {
    const baseClasses = 'absolute z-50 px-2 py-1 text-xs font-normal text-white bg-navy-600 rounded shadow-lg whitespace-nowrap pointer-events-none';
    const placementClasses = {
      bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-3 radius-lg py-2 px-3 color-navy-50',
      top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-3 radius-lg py-2 px-3 color-navy-50',
      left: 'right-full top-1/2 transform -translate-y-1/2 mr-3 radius-lg py-2 px-3 color-navy-50',
      right: 'left-full top-1/2 transform -translate-y-1/2 ml-3 radius-lg py-2 px-3 color-navy-50',
    };

    return `${baseClasses} ${placementClasses[placement]}`;
  };

  const getArrowClasses = () => {
    const baseClasses = 'absolute w-0 h-0';
    const arrowClasses = {
      bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-navy-600',
      top: 'top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-navy-600',
      left: 'left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-navy-600',
      right: 'right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-navy-600',
    };

    return `${baseClasses} ${arrowClasses[placement]}`;
  };

  if (!content) {
    return children;
  }

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={getTooltipClasses()}
          role="tooltip"
        >
          <div className={getArrowClasses()} />
          {content}
        </div>
      )}
    </div>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  placement: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  delay: PropTypes.number,
};

Tooltip.defaultProps = {
  content: '',
  placement: 'bottom',
  delay: 500,
};

export default Tooltip; 