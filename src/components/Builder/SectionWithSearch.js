import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import SearchInput from './SearchInput';
import { useTranslatedTexts } from '../../utils/hooks';

const SectionWithSearch = ({
  children,
  elements,
  hasSearch,
  searchKeys,
  title,
}) => {
  const [_elements, setElements] = useState(elements);
  const hasSearchCx = hasSearch ? ' hasSearch' : '';
  const { NO_RESULT } = useTranslatedTexts();

  return (
    <>
      <div
        className={`js-title toolItem toolTitle d-flex a-center t-medium${hasSearchCx}`}
      >
        <div>
          {title}
        </div>
        {hasSearch && (
          <SearchInput
            elements={elements}
            searchKeys={searchKeys}
            setElements={setElements}
          />
        )}
      </div>
      {_elements === 'noResult' ? (
        <div className="no-search-result-text">{NO_RESULT}</div>
      ) : (
        children(_elements)
      )}
    </>
  );
};

SectionWithSearch.propTypes = {
  children: PropTypes.any,
  elements: PropTypes.arrayOf(PropTypes.shape({})),
  hasSearch: PropTypes.bool,
  searchKeys: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    weight: PropTypes.number,
  })),
  title: PropTypes.string,
};

SectionWithSearch.defaultProps = {
  children: () => {},
  elements: [],
  hasSearch: false,
  searchKeys: [],
  title: '',
};

export default memo(SectionWithSearch);
