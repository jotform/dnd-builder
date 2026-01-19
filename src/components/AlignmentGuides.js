import { memo } from 'react';
import PropTypes from 'prop-types';
import { useBuilderStore } from '../contexts/BuilderContext';

const AlignmentGuides = ({
  axis,
  guides = {},
  matches = {},
  show = false,
}) => {
  const zoom = useBuilderStore(state => state.zoom);
  if (Object.keys(matches).length === 0) return null;
  const styleKey = axis === 'x' ? 'left' : 'top';

  return Object.keys(guides).reduce((result, box) => {
    const guideClassNames = show ? `guide ${axis}Axis active` : `guide ${axis}Axis`;
    const yAxisGuidesForCurrentBox = guides[box][axis].map((position, index) => {
      if (
        show
        && matches
        && matches[axis]
        && matches[axis].intersection
        && matches[axis].intersection === position
      ) {
        return (
          <div
            key={`${position}-${index.toString()}-${box}`}
            className={guideClassNames}
            style={{ [styleKey]: position / zoom }}
          />
        );
      }
      return null;
    });

    return result.concat(yAxisGuidesForCurrentBox);
  }, []);
};

AlignmentGuides.propTypes = {
  axis: PropTypes.oneOf(['x', 'y']).isRequired,
  guides: PropTypes.shape({}),
  matches: PropTypes.shape({}),
  show: PropTypes.bool,
};

export default memo(AlignmentGuides);
