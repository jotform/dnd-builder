import { memo } from 'react';
import PropTypes from 'prop-types';
import CustomToolbar from './CustomToolbar';

// This wrapper is needed to prevent the re-render
// of the toolbar id div since it breaks the editor
const CustomToolbarWrapper = ({
  isTextEditorOpen = false,
  itemWidth = 0,
}) => isTextEditorOpen && (
  <div
    id="toolbar"
    style={{
      pointerEvents: 'auto',
      position: 'absolute',
      top: '100%',
    }}
  >
    <CustomToolbar itemWidth={itemWidth} />
  </div>
);

CustomToolbarWrapper.propTypes = {
  isTextEditorOpen: PropTypes.bool,
  itemWidth: PropTypes.number,
};

export default memo(CustomToolbarWrapper);
