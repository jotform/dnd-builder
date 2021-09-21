import { memo } from 'react';
import PropTypes from 'prop-types';

const MAX_WIDTH = 700;
const MAX_HEIGHT = 600;

const ImageUrl = ({
  config,
  item,
  onItemChange,
  value,
}) => {
  const onBlur = e => {
    if (e.target.value !== value) {
      const _value = e.target.value;
      const image = new global.Image();
      image.src = e.target.value;
      image.onload = () => {
        const { naturalHeight, naturalWidth } = image;
        let _width = naturalWidth;
        let _height = naturalHeight;

        if (naturalWidth > MAX_WIDTH) {
          _height = parseInt((MAX_WIDTH * naturalHeight) / naturalWidth, 10);
          _width = MAX_WIDTH;
        }

        if (_height > MAX_HEIGHT) {
          _width = parseInt((_width * MAX_HEIGHT) / _height, 10);
          _height = MAX_HEIGHT;
        }

        onItemChange(
          { id: item.id },
          {
            [config.key]: _value,
            height: _height,
            width: _width,
          },
        );
      };
    }
  };

  return (
    <input
      className="toolSection-input"
      defaultValue={value}
      onBlur={onBlur}
      type="text"
    />
  );
};

ImageUrl.propTypes = {
  config: PropTypes.shape({
    key: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.any),
  }),
  item: PropTypes.shape({
    id: PropTypes.string,
  }),
  onItemChange: PropTypes.func,
  value: PropTypes.string,
};

ImageUrl.defaultProps = {
  config: [],
  item: {},
  onItemChange: () => {},
  value: '',
};

export default memo(ImageUrl);
