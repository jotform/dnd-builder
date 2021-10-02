/* eslint max-len: ["error", { "code": 120 }] */
import { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ITEM_TYPE = 'image';

const imageWrapperStyle = {
  height: 'inherit',
  width: 'inherit',
};

const imageStyle = {
  height: '100%',
  width: '100%',
};

const settings = [
  {
    hideWhen: {
      url: '',
    },
    ifValueEquals: {
      '': {
        height: {
          cast: 'integer',
          value: 400,
        },
        width: {
          cast: 'integer',
          value: 400,
        },
      },
    },
    key: 'url',
    label: 'IMAGE UPLOAD',
    section: 'General',
    type: 'imageThumbnailWithDelete',
  },
  {
    hideWhen: {
      url: '',
    },
    key: 'sizeSettings',
    label: 'Size',
    section: 'General',
    type: 'sizeSettings',
    value: (_, { height, width }) => `${width}x${height}`,
  },
  {
    hideWhen: {
      url: '',
    },
    key: 'roundedCorners',
    label: 'Rounded Corners',
    range: [0, 30],
    section: 'General',
    showWhen: {
      shapeType: 'rectangle',
    },
    simple: true,
    type: 'slider',
  },
  {
    hideWhen: {
      url: '',
    },
    key: 'opacity',
    label: 'Opacity',
    range: [0, 100],
    section: 'General',
    type: 'slider',
  },
  {
    key: 'url',
    section: 'ENTER URL',
    showWhen: { url: '' },
    type: 'enterImageURL',
    useImageSizeUpdate: true,
  },
];

export const ImageElement = ({
  item: {
    defaultURL,
    opacity,
    roundedCorners,
    url,
  },
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isErrored, setIsErrored] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsErrored(false);
  }, [url, setIsLoading, setIsErrored]);

  // TODO :: do we want to show a loading placeholder?

  return (
    <>
      <div
        style={{
          ...imageWrapperStyle,
          display: isLoading || isErrored ? 'none' : 'block',
        }}
      >
        <img
          alt="reportImage"
          onError={() => {
            setIsLoading(false);
            setIsErrored(true);
          }}
          onLoad={() => setIsLoading(false)}
          src={url || defaultURL}
          style={{
            ...imageStyle,
            borderRadius: `${roundedCorners}px`,
            display: isErrored ? 'none' : '',
            opacity: parseFloat(opacity),
          }}
        />
      </div>
      {isErrored && (
        <div
          style={{
            ...imageWrapperStyle,
            background: '#fafafa',
            paddingTop: '40%',
            textAlign: 'center',
          }}
        >
          Image was not loaded!
        </div>
      )}
    </>
  );
};

ImageElement.propTypes = {
  item: PropTypes.shape({
    defaultURL: PropTypes.string,
    height: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    id: PropTypes.string,
    opacity: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    roundedCorners: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    url: PropTypes.string,
    width: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  }),
};

ImageElement.defaultProps = {
  item: {
    opacity: 1,
  },
};

const details = {
  defaultURL: 'https://www.jotform.com/resources/assets/icon/jotform-logomark-transparent-400x400.png',
  height: 400,
  itemType: ITEM_TYPE,
  opacity: 1,
  roundedCorners: 0,
  url: '',
  width: 400,
};

export default {
  Component: memo(ImageElement),
  details,
  itemType: ITEM_TYPE,
  settings,
};
