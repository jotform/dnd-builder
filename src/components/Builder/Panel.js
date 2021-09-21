/* global Element */
import { forwardRef, memo } from 'react';
import PropTypes from 'prop-types';

const Panel = ({
  additionalClassName, children, innerRef, onAnimationEnd,
}) => {
  return (
    <aside
      ref={innerRef}
      className={`jfReport-col jfReport-pane ${additionalClassName}`}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </aside>
  );
};

Panel.propTypes = {
  additionalClassName: PropTypes.string,
  children: PropTypes.any,
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  onAnimationEnd: PropTypes.func,
};

Panel.defaultProps = {
  additionalClassName: '',
  children: null,
  innerRef: null,
  onAnimationEnd: () => {},
};

const MemoizedPanel = memo(Panel);

export default forwardRef((props, ref) => (
  <MemoizedPanel
    innerRef={ref}
    {...props}
  />
));
