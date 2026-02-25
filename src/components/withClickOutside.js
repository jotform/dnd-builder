import { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { EVENT_IGNORED_ROLES } from '../constants/eventIgnoredRoles';
import { useBuilderStore } from '../contexts/BuilderContext';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function withClickOutside(WrappedComponent) {
  function WithClickOutside(props) {
    const {
      exceptionalClasses = null,
      onClickOutside,
      withClickOutsideWrapperClass = null,
    } = props;

    const clickOutsideIgnoreSelectors = useBuilderStore(state => state.clickOutsideIgnoreSelectors);
    const wrapper = useRef(null);

    const handleClickOutside = useCallback(event => {
      const { classList } = event.target;
      if (
        exceptionalClasses
        && (
          classList.contains(exceptionalClasses)
          || Array.from(classList).some(xClass => exceptionalClasses.includes(xClass))
          || exceptionalClasses.some(item => event.target.closest(`.${item}`))
          || EVENT_IGNORED_ROLES.some(role => event.target.closest(`[role=${role}]`))
          || clickOutsideIgnoreSelectors.some(selector => selector && event.target.closest(selector))
        )
      ) {
        return;
      }

      if (wrapper.current && !wrapper.current.contains(event.target)) {
        onClickOutside(event);
      }
    }, [exceptionalClasses, onClickOutside, clickOutsideIgnoreSelectors]);

    useEffect(() => {
      window.addEventListener('mousedown', handleClickOutside, true);
      return () => {
        window.removeEventListener('mousedown', handleClickOutside, true);
      };
    }, [handleClickOutside]);

    // should we memoize this?
    const propsToFilter = ['withClickOutsideWrapperClass', 'exceptionalClasses'];
    const componentName = getDisplayName(WrappedComponent);
    if (componentName === 'Resizable') {
      // beceause resizable wrapper directly passes props to an html el
      propsToFilter.push('onClickOutside');
    }
    const filteredProps = Object.keys(props).reduce((allProps, propKey) => {
      const _allProps = allProps;
      if (propsToFilter.indexOf(propKey) === -1) {
        _allProps[propKey] = props[propKey];
      }
      return _allProps;
    }, {});

    return (
      <div
        ref={wrapper}
        className={withClickOutsideWrapperClass}
      >
        <WrappedComponent
          {...filteredProps}
        />
      </div>
    );
  }

  WithClickOutside.propTypes = {
    exceptionalClasses: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    onClickOutside: PropTypes.func.isRequired,
    withClickOutsideWrapperClass: PropTypes.string,
  };

  WithClickOutside.displayName = `inlineEdit(${getDisplayName(WrappedComponent)})`;

  return WithClickOutside;
}

export default withClickOutside;
