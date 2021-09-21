import PropTypes from 'prop-types';
import {
  getFileName,
} from '../../../utils/functions';

const ImageSettings = ({
  config,
  item,
  onItemChange,
}) => {
  return (
    <div className="imageUpload-wrapper d-flex a-center">
      <img
        alt="Thumbnail"
        src={item.url}
      />
      <div className="imageUpload-info">
        <span>{getFileName(item.url)}</span>
        <button
          className="isDanger"
          onClick={() => onItemChange(
            { id: item.id },
            { [config.key]: '' },
          )}
          type="button"
        >
          Remove Image
        </button>
      </div>
    </div>
  );
};

ImageSettings.propTypes = {
  config: PropTypes.shape({
    key: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.any),
  }),
  item: PropTypes.shape({
    id: PropTypes.string,
    url: PropTypes.string,
  }),
  onItemChange: PropTypes.func,
};

ImageSettings.defaultProps = {
  config: [],
  item: {},
  onItemChange: () => {},
};

export default ImageSettings;
