import { memo } from 'react';
import PropTypes from 'prop-types';
import { useBuilderStore } from '../contexts/BuilderContext';

const AlignmentGuides = ({
  axis,
  guides = {},
  matches = {},
}) => {
  const zoom = useBuilderStore(state => state.zoom);
  const styleKey = axis === 'x' ? 'left' : 'top';

  return Object.entries(guides).reduce((accum, [box, positions]) => {
    const shownGuides = positions[axis].reduce((acc, position, index) => {
      if (matches.intersection === position) {
        acc.push(
          <div
            key={`${position}-${index.toString()}-${box}`}
            className={`guide ${axis}Axis active`}
            style={{ [styleKey]: position / zoom }}
          />,
        );
      }
      return acc;
    }, []);

    return accum.concat(shownGuides);
  }, []);
};

AlignmentGuides.propTypes = {
  axis: PropTypes.oneOf(['x', 'y']).isRequired,
  guides: PropTypes.shape({}),
  matches: PropTypes.shape({}),
};

export default memo(AlignmentGuides);
