import { useState } from 'react';
import PropTypes from 'prop-types';
import * as icons from '../../utils/icons';
import { roundForDecimalPart } from '../../utils/functions';
import { useTranslatedTexts } from '../../utils/hooks';

const LayoutSizeSettings = ({ config, item, onItemChange }) => {
  const [aspectLock, setAspectLock] = useState(true);
  const { HEIGHT, WIDTH } = useTranslatedTexts();

  const { reportLayoutHeight: layoutHeight, reportLayoutWidth: layoutWidth } = item;

  const initialWidth = parseInt(layoutWidth, 10);
  const initialHeight = parseInt(layoutHeight, 10);

  const [sizes, setSizes] = useState({
    height: initialHeight,
    width: initialWidth,
  });

  const initialAspect = initialWidth / initialHeight;

  const onChange = e => {
    const property = e.target.getAttribute('name');
    const newValue = e.target.value;
    if (aspectLock) {
      if (property === 'width') {
        setSizes({
          ...sizes,
          height: Number(newValue / initialAspect),
          [property]: parseInt(newValue, 10),
        });
      } else {
        setSizes({
          ...sizes,
          [property]: parseInt(newValue, 10),
          width: Number(newValue * initialAspect),
        });
      }
    } else {
      setSizes({
        ...sizes,
        [property]: parseInt(newValue, 10),
      });
    }
  };

  const onBlur = () => {
    const newWidth = sizes.width < 200 ? 200 : sizes.width;
    const newHeight = sizes.height < 100 ? 100 : sizes.height;
    setSizes({
      height: newHeight,
      width: newWidth,
    });
    onItemChange(
      { id: item.id },
      {
        [config.key]: `${roundForDecimalPart(newWidth)}x${roundForDecimalPart(newHeight)}`,
      },
    );
  };

  const onKeyDown = e => {
    if (e.keyCode === 13) {
      onBlur();
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
              name="width"
              onBlur={onBlur}
              onChange={onChange}
              onKeyDown={onKeyDown}
              step="any"
              type="number"
              value={roundForDecimalPart(sizes.width)}
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
              name="height"
              onBlur={onBlur}
              onChange={onChange}
              onKeyDown={onKeyDown}
              step="any"
              type="number"
              value={roundForDecimalPart(sizes.height)}
            />
            <span className="toolSection-subLabel">{HEIGHT}</span>
          </label>
        </div>
      </div>
    </>
  );
};

LayoutSizeSettings.propTypes = {
  config: PropTypes.shape({
    key: PropTypes.string,
  }).isRequired,
  item: PropTypes.shape({
    height: PropTypes.number,
    id: PropTypes.string,
    reportLayout: PropTypes.string,
    reportLayoutHeight: PropTypes.string,
    reportLayoutWidth: PropTypes.string,
    shapeType: PropTypes.string,
    url: PropTypes.string,
    width: PropTypes.number,
  }),
  onItemChange: PropTypes.func,
};

LayoutSizeSettings.defaultProps = {
  item: {},
  onItemChange: () => {},
};

export default LayoutSizeSettings;
