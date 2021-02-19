import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getImageSizes, roundForDecimalPart } from '../../utils/functions';
import { useTranslatedTexts } from '../../utils/hooks';
import * as icons from '../../utils/icons';

const SizeSettings = ({ item, onItemChange }) => {
  const initialAspect = useRef();
  const [stackSize, setStackSize] = useState({ height: item.height, width: item.width });
  const [aspectLock, setAspectLock] = useState(true);
  const imageRefForMeta = useRef(null);
  const { HEIGHT, ORIGINAL_SIZE, WIDTH } = useTranslatedTexts();

  useEffect(() => {
    setStackSize({ height: item.height, width: item.width });
  }, [item.height, item.width]);

  useEffect(() => {
    if (aspectLock) {
      initialAspect.current = stackSize.width / stackSize.height;
    }
  }, [aspectLock]);

  const sizeSetter = ({ height, width }) => {
    const sizes = { height: Number(height), width: Number(width) };
    setStackSize(sizes);
    onItemChange({ id: item.id }, sizes);
  };

  const sizeSetterHelper = ({ height, width }) => {
    let exactWidth = Number(width);
    let exactHeight = Number(height);
    if (aspectLock) {
      if (item.width !== stackSize.width) {
        exactHeight = stackSize.width / initialAspect.current;
      } else {
        exactWidth = stackSize.height * initialAspect.current;
      }
    }

    sizeSetter({ height: Math.max(exactHeight, 5), width: Math.max(exactWidth, 5) });
  };

  const handleBlur = () => {
    sizeSetterHelper(stackSize);
  };

  const handleChangeSize = (type = 'width', prevValue) => e => {
    if (e.stopPropagation) e.stopPropagation();

    const { value } = e.target;
    if (Number(value) !== Number(prevValue)) {
      setStackSize({ ...stackSize, [type]: Number(value) || 0 });
    }
  };

  const setOriginalSizes = () => {
    // For Shapes
    if (item.shapeType) {
      return sizeSetter({
        height: 200,
        width: 200,
      });
    }
    // For Images
    if (!imageRefForMeta.current) {
      getImageSizes(item.url, (imageWidth, imageHeight) => {
        imageRefForMeta.current = {
          imageHeight,
          imageWidth,
        };
        sizeSetter({
          height: imageHeight,
          width: imageWidth,
        });
      });
    } else {
      const { imageHeight, imageWidth } = imageRefForMeta.current;
      sizeSetter({
        height: imageHeight,
        width: imageWidth,
      });
    }
  };

  const handleKeyDown = (type, currValue) => event => {
    event.stopPropagation();
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      const ref = event.shiftKey ? 10 : 1;
      const diff = event.key === 'ArrowUp' ? ref : -ref;
      handleChangeSize(type, currValue)({
        target: {
          value: Number(currValue) + diff,
        },
      });
    } else if (event.key === 'Tab') {
      event.preventDefault();
      const input = type === 'width' ? 'height-input' : 'width-input';
      document.getElementById(input).focus();
      document.getElementById(input).select();
    } else if (event.key === 'Enter') {
      sizeSetterHelper(stackSize);
    }
  };

  return (
    <>
      <div className="toolSection-wrapper d-flex">
        <div className="toolSection-subItem">
          <label
            className="d-flex dir-col hasUnit isPixel"
            htmlFor="width-input"
          >
            <input
              className="toolSection-input"
              id="width-input"
              onBlur={handleBlur}
              onChange={handleChangeSize('width', stackSize.width)}
              onKeyDown={handleKeyDown('width', stackSize.width)}
              pattern="[0-9]*"
              tabIndex={0}
              value={roundForDecimalPart(stackSize.width)}
            />
            <span className="toolSection-subLabel">{WIDTH}</span>
          </label>
        </div>
        <div className="toolSection-subItem hasAspect">
          <button
            className="p-relative forAspect"
            onClick={() => setAspectLock(!aspectLock)}
            type="button"
          >
            {aspectLock
              ? <icons.lock className="jfReportSVG icon-aspectLock" />
              : <icons.unlock className="jfReportSVG icon-aspectUnlock" />}
          </button>
        </div>
        <div className="toolSection-subItem">
          <label
            className="d-flex dir-col hasUnit isPixel"
            htmlFor="width-input"
          >
            <input
              className="toolSection-input"
              id="height-input"
              onBlur={handleBlur}
              onChange={handleChangeSize('height', stackSize.height)}
              onKeyDown={handleKeyDown('height', stackSize.height)}
              pattern="[0-9]*"
              value={roundForDecimalPart(stackSize.height)}
            />
            <span className="toolSection-subLabel">{HEIGHT}</span>
          </label>
        </div>
      </div>
      {(item.url || item.shapeType)
        && (
          <div className="toolSection-wrapper">
            <button
              className="jfReportButton isOutline forDimension f-width"
              onClick={setOriginalSizes}
              type="button"
            >
              {ORIGINAL_SIZE}
            </button>
          </div>
        )}
    </>
  );
};

SizeSettings.propTypes = {
  item: PropTypes.shape({
    height: PropTypes.number,
    id: PropTypes.string,
    shapeType: PropTypes.string,
    url: PropTypes.string,
    width: PropTypes.number,
  }),
  onItemChange: PropTypes.func,
};

SizeSettings.defaultProps = {
  item: {},
  onItemChange: () => {},
};

export default SizeSettings;
