import {
  useState, useCallback, useLayoutEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { fontSizes } from '../../../constants/fonts';

const SELECT_WIDTH = 70;
const BUTTON_WIDTH = 26;
const BAR_WIDTH = SELECT_WIDTH + (BUTTON_WIDTH * 8);

const CustomToolbar = ({ itemWidth }) => {
  const overflow = BAR_WIDTH > itemWidth;
  const [isOpened, setIsOpened] = useState(overflow ? false : true);
  const onClickMore = useCallback(() => setIsOpened(true), []);
  const wrapper = useRef();

  function getVisibleClass(limit) {
    return overflow && itemWidth < limit ? ' hiddenVisibility' : '';
  }

  useLayoutEffect(() => {
    if (!isOpened || wrapper.current === null) return;
    Array.from(wrapper.current.children).forEach(el => el.classList.remove('hiddenVisibility'));
  }, [isOpened]);

  return (
    <div
      ref={wrapper}
      className={classNames('toolbarWrapper p-absolute d-flex', { isOpened })}
      style={{
        maxWidth: isOpened ? 'none' : '100%',
        minWidth: `${itemWidth}px`,
      }}
    >
      <select
        aria-label="Size"
        className="ql-size ql-select ql-textselect"
        defaultValue="16px"
        onChange={e => e.persist()}
      >
        {fontSizes.map(size => (
          <option
            key={size}
            value={`${size}px`}
          >
            {size}
            px
          </option>
        ))}
      </select>
      <div className="ql-divider" />
      <button
        aria-label="Bold"
        className={`ql-bold ql-button${getVisibleClass(SELECT_WIDTH + BUTTON_WIDTH)}`}
        type="button"
      />
      <button
        aria-label="Italic"
        className={`ql-italic ql-button${getVisibleClass(SELECT_WIDTH + (BUTTON_WIDTH * 2))}`}
        type="button"
      />
      <button
        aria-label="Underline"
        className={`ql-underline ql-button${getVisibleClass(SELECT_WIDTH + (BUTTON_WIDTH * 3))}`}
        type="button"
      />
      <select
        aria-label="Text Color"
        className={`ql-color ql-select${getVisibleClass(SELECT_WIDTH + (BUTTON_WIDTH * 4))}`}
        defaultValue=""
        onChange={e => e.persist()}
      />
      <div className="ql-divider" />
      <select
        aria-label="Alignment"
        className={`ql-align ql-select${getVisibleClass(SELECT_WIDTH + (BUTTON_WIDTH * 5))}`}
        defaultValue=""
        onChange={e => e.persist()}
      />
      <button
        aria-label="Ordered List"
        className={`ql-list ql-button${getVisibleClass(SELECT_WIDTH + (BUTTON_WIDTH * 6))}`}
        type="button"
        value="ordered"
      />
      <button
        aria-label="Bullet List"
        className={`ql-list ql-button${getVisibleClass(SELECT_WIDTH + (BUTTON_WIDTH * 7))}`}
        type="button"
        value="bullet"
      />
      <button
        aria-label="Link"
        className={`ql-link ql-button${getVisibleClass(SELECT_WIDTH + (BUTTON_WIDTH * 8))}`}
        type="button"
      />
      {overflow && !isOpened && (
        <button
          aria-label="More Options"
          className="qlMore"
          onClick={onClickMore}
          type="button"
        >
          &gt;&gt;
        </button>
      )}
    </div>
  );
};

CustomToolbar.propTypes = {
  itemWidth: PropTypes.number,
};

CustomToolbar.defaultProps = {
  itemWidth: 0,
};

export default CustomToolbar;
