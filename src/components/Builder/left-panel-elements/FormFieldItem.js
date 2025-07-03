import React from 'react';
import PropTypes from 'prop-types';

const FormFieldItem = ({
  itemIcon: IconComponent,
  itemTitle,
  ...rest
}) => {
  return (
    <div
      aria-label={`Add ${itemTitle}`}
      tabIndex="0"
      className="flex newPanel-fieldItem relative flex items-center group duration-300 ease-in-out hover:bg-pdf-default bg-gray-500 color-white cursor-move mb-2"
      role="button"
      {...rest}
    >
      <div className="flex justify-center items-center shrink-0 w-14 h-14 newPanel-iconWrapper duration-300 ease-in-out bg-gray-600 group-hover:bg-pdf-dark">
        {React.isValidElement(IconComponent) && IconComponent}
        {typeof IconComponent === 'function' && <IconComponent />}
      </div>
      <div className="newPanel-fieldItemLabel relative flex grow-1 h-14 min-w-0" data-testid="fieldList-fieldName">
        <span className="flex items-center px-4 mr-auto">{itemTitle}</span>
      </div>
    </div>
  );
};

FormFieldItem.propTypes = {
  itemIcon: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
    PropTypes.string,
  ]).isRequired,
  itemTitle: PropTypes.string.isRequired,
};

export default FormFieldItem;
