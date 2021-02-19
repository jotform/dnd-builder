import React, { memo } from 'react';
import PropTypes from 'prop-types';
import * as icons from '../../utils/icons';
import { divider } from '../../utils/staticSettings';

const ITEM_TYPE = 'shapes';

const defaultSizes = {
  height: {
    cast: 'integer',
    value: '{width}',
  },
  shapeBorderShow: {
    cast: 'string',
    value: 'on',
  },
  shapeFillShow: {
    cast: 'string',
    value: 'on',
  },
  width: {
    cast: 'integer',
    value: '{width}',
  },
};

const settings = [
  {
    ifValueEquals: {
      ellipse: defaultSizes,
      line: {
        height: {
          cast: 'integer',
          value: 30,
        },
        shapeBorderShow: {
          cast: 'string',
          value: 'off',
        },
        shapeFillShow: {
          cast: 'string',
          value: 'off',
        },
        width: {
          cast: 'integer',
          value: '{width}',
        },
      },
      rectangle: defaultSizes,
      star: defaultSizes,
      triangle: defaultSizes,
    },
    key: 'shapeType',
    label: 'Shape Type',
    options: [
      {
        icon: icons.rectangleIcon,
        name: 'rectangle',
        title: 'Rectangle',
      },
      {
        icon: icons.ellipseIcon,
        name: 'ellipse',
        title: 'Ellipse',
      },
      {
        icon: icons.lineIcon,
        name: 'line',
        title: 'Line',
      },
      {
        icon: icons.triangleIcon,
        name: 'triangle',
        title: 'Triangle',
      },
      {
        icon: icons.starIcon,
        name: 'star',
        title: 'Star',
      },
    ],
    section: 'General',
    type: 'selectBox',
  },
  {
    ...divider('General'),
  },
  {
    key: 'lineType',
    label: 'Style',
    options: [
      { label: 'Solid', value: 'solid' },
      { label: 'Dashed', value: 'dashed' },
      { label: 'Dotted', value: 'dotted' },
    ],
    section: 'General',
    showWhen: {
      shapeType: 'line',
    },
    type: 'dropdown',
  },
  {
    key: 'lineSize',
    label: 'Size',
    options: [
      { label: 'Thin', value: 'thin' },
      { label: 'Medium', value: 'medium' },
      { label: 'Thick', value: 'thick' },
    ],
    section: 'General',
    showWhen: {
      shapeType: 'line',
    },
    type: 'dropdown',
  },
  {
    ifValueEquals: {
      horizontal: {
        height: {
          cast: 'integer',
          value: '{width}',
        },
        width: {
          cast: 'integer',
          value: '{height}',
        },
      },
      vertical: {
        height: {
          cast: 'integer',
          value: '{width}',
        },
        width: {
          cast: 'integer',
          value: '{height}',
        },
      },
    },
    key: 'lineDirection',
    label: 'Direction',
    options: [
      { label: 'Horizontal', value: 'horizontal' },
      { label: 'Vertical', value: 'vertical' },
    ],
    section: 'General',
    showWhen: {
      shapeType: 'line',
    },
    type: 'dropdown',

  },
  {
    hideWhen: {
      shapeType: 'line',
    },
    ifValueEquals: {
      off: {
        shapeBorderShow: {
          cast: 'string',
          value: 'on',
        },
      },
    },
    key: 'shapeFillShow',
    label: 'Fill',
    section: 'General',
    type: 'toggle',
    wrapperClass: 'isOneLine',
  },
  {
    key: 'shapeFillColor',
    label: 'Color',
    section: 'General',
    showWhen: {
      shapeType: 'line',
    },
    type: 'colorPicker',
  },
  {
    key: 'shapeFillColor',
    label: 'Fill Color',
    section: 'General',
    showWhen: {
      shapeFillShow: 'on',
    },
    type: 'colorPicker',
  },
  {
    key: 'opacity',
    label: 'Opacity',
    range: [0, 100],
    section: 'General',
    showWhen: {
      shapeType: 'line',
    },
    type: 'slider',
  },
  {
    key: 'opacity',
    label: 'Fill Opacity',
    range: [0, 100],
    section: 'General',
    showWhen: {
      shapeFillShow: 'on',
    },
    type: 'slider',
  },
  {
    ...divider('General'),
  },
  {
    hideWhen: {
      shapeType: 'line',
    },
    ifValueEquals: {
      off: {
        shapeFillShow: {
          cast: 'string',
          value: 'on',
        },
      },
    },
    key: 'shapeBorderShow',
    label: 'Border',
    section: 'General',
    type: 'toggle',
    wrapperClass: 'isOneLine',
  },
  {
    key: 'shapeBorderColor',
    label: 'Border Color',
    section: 'General',
    showWhen: {
      shapeBorderShow: 'on',
    },
    type: 'colorPicker',
  },
  {
    key: 'shapeBorderWidth',
    label: 'Border Size',
    options: [
      { label: 'Thin', value: '2px' },
      { label: 'Medium', value: '4px' },
      { label: 'Thick', value: '6px' },
    ],
    section: 'General',
    showWhen: {
      shapeBorderShow: 'on',
    },
    type: 'dropdown',
  },
  {
    ...divider('General'),
  },
  {
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
      shapeType: 'line',
    },
    key: 'sizeSettings',
    label: 'Size',
    section: 'General',
    type: 'sizeSettings',
    value: (_, { height, width }) => `${width}x${height}`,
  },
];

const
  getSVG = (
    shapeType,
    shapeBorderColor,
    shapeBorderShow,
    shapeBorderWidth,
    shapeFillColor,
    shapeFillShow,
    opacity,
    roundedCorners,
  ) => {
    const commonShapeProps = {
      fill: shapeFillShow === 'on' || shapeFillShow === undefined ? shapeFillColor : 'none',
      fillOpacity: opacity,
      stroke: shapeBorderShow === 'on' || shapeBorderShow === undefined ? shapeBorderColor : 'none',
      strokeWidth: shapeBorderShow === 'on' ? shapeBorderWidth : '0',
    };
    // const commonShapeStyles = {
    //   outline: `${shapeBorderWidth} ${shapeBorderStyle} ${shapeBorderColor}`,
    //   outlineOffset: `-${shapeBorderWidth}`,
    // };
    switch (shapeType) {
      case 'rectangle':
      case 'square': {
        return (
          <rect
            height="100%"
            rx={`${roundedCorners || 0}px`}
            ry={`${roundedCorners || 0}px`}
            width="100%"
            x="0"
            y="0"
            {...commonShapeProps}
          />
        );
      }
      case 'ellipse':
      case 'circle': {
        return (
          <ellipse
            cx="50%"
            cy="50%"
            rx="50%"
            ry="50%"
            x="0"
            y="0"
            {...commonShapeProps}
          />
        );
      }
      case 'star': {
        return (
          <path
            d="M100.145,0.74 L131.042518,66.5812528 L200.145,77.1420881
             L150.151365,128.380209 L161.952766,200.74 L100.145,166.581253 L38.3372342,200.74
              L50.1386346,128.380209 L0.145,77.1420881 L69.2474825,66.5678678 L100.145,0.74 Z"
            {...commonShapeProps}
          />
        );
      }
      case 'triangle': {
        return (
          <polygon
            points="100,0 0,200 200,200"
            {...commonShapeProps}
          />
        );
      }
      default: {
        return (
          <rect
            height="100%"
            width="100%"
            x="0"
            y="0"
            {...commonShapeProps}
          />
        );
      }
    }
  };

const defaultItem = {
  height: 200,
  lineDirection: 'horizontal',
  lineSize: 'thin',
  lineType: 'solid',
  opacity: 1,
  roundedCorners: 0,
  shapeBorderColor: '#999999',
  shapeBorderShow: 'off',
  shapeBorderWidth: '2px',
  shapeFillColor: '#000000',
  shapeFillShow: 'on',
  shapeType: 'rectangle',
  width: 200,
};

export const ShapeElement = ({
  item: {
    height,
    lineDirection,
    lineSize,
    lineType,
    opacity,
    roundedCorners,
    shapeBorderColor,
    shapeBorderShow,
    shapeBorderWidth,
    shapeFillColor,
    shapeFillShow,
    shapeType,
    width,
  },
}) => {
  if (shapeType === 'line') {
    return (
      <div className="d-flex j-center a-center f-all">
        <div
          className="reportItem-line"
          style={lineDirection === 'horizontal'
            ? {
              borderBottomStyle: lineType,
              borderBottomWidth: lineSize,
              borderColor: shapeFillColor,
              height: '0',
              opacity,
              width: '100%',
            }
            : {
              borderColor: shapeFillColor,
              borderRightStyle: lineType,
              borderRightWidth: lineSize,
              height: '100%',
              opacity,
              width: '0',
            }}
        />
      </div>
    );
  }
  return (
    <svg
      className={shapeBorderShow === 'on'
        ? `fitFor-${shapeBorderWidth}${shapeType === 'star' ? ' forStar' : ''}` : 'f-all'}
      overflow="visible"
      preserveAspectRatio={shapeType === 'triangle' ? 'none' : null}
      version="1.1"
      viewBox={shapeType === 'star' || shapeType === 'triangle' ? '0 0 200 200' : null}
      xmlns="http://www.w3.org/2000/svg"
    >
      {getSVG(
        shapeType,
        shapeBorderColor,
        shapeBorderShow,
        shapeBorderWidth,
        shapeFillColor,
        shapeFillShow,
        opacity,
        roundedCorners,
        height,
        width,
      )}
    </svg>
  );
};

ShapeElement.propTypes = {
  item: PropTypes.shape({
    height: PropTypes.number,
    lineDirection: PropTypes.string,
    lineSize: PropTypes.string,
    lineType: PropTypes.string,
    opacity: PropTypes.number,
    roundedCorners: PropTypes.number,
    shapeBorderColor: PropTypes.string,
    shapeBorderShow: PropTypes.string,
    shapeBorderWidth: PropTypes.string,
    shapeFillColor: PropTypes.string,
    shapeFillShow: PropTypes.string,
    shapeType: PropTypes.string,
    width: PropTypes.number,
  }),
};

ShapeElement.defaultProps = {
  item: {
    ...defaultItem,
  },
};

const details = {
  height: 200,
  itemType: ITEM_TYPE,
  width: 200,
};

export default {
  Component: memo(ShapeElement),
  defaultItem,
  details,
  itemType: ITEM_TYPE,
  settings,
};
