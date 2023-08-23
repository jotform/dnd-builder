/* eslint max-len: ["error", { "code": 120 }] */
import { memo, useState, useEffect } from 'react';
import {
  func,
  number,
  oneOfType,
  shape,
  string,
} from 'prop-types';

const ITEM_TYPE = 'image';

const DEFAULT_LOGO_SRC = 'https://www.jotform.com/resources/assets/icon/jotform-logomark-transparent-400x400.png';

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
    section: 'GENERAL',
    type: 'imageThumbnailWithDelete',
  },
  {
    hideWhen: {
      url: '',
    },
    key: 'sizeSettings',
    label: 'Size',
    section: 'GENERAL',
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
    section: 'GENERAL',
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
    section: 'GENERAL',
    type: 'slider',
  },
  {
    key: 'url',
    label: 'Enter URL',
    section: 'ENTER URL',
    showWhen: { url: '' },
    type: 'enterImageURL',
    useImageSizeUpdate: true,
  },
];

export const ImageElement = ({ item, itemAccessor }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isErrored, setIsErrored] = useState(false);

  const {
    opacity,
    roundedCorners,
    url,
  } = item;

  const additionalProps = itemAccessor(item);
  const defaultURL = additionalProps?.defaultURL || DEFAULT_LOGO_SRC;

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
  item: shape({
    defaultURL: string,
    height: oneOfType([
      number,
      string,
    ]),
    id: string,
    opacity: oneOfType([
      number,
      string,
    ]),
    roundedCorners: oneOfType([
      number,
      string,
    ]),
    url: string,
    width: oneOfType([
      number,
      string,
    ]),
  }),
  itemAccessor: func,
};

ImageElement.defaultProps = {
  item: {
    opacity: 1,
  },
  itemAccessor: () => {},
};

const details = {
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
