import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import Fuse from 'fuse.js/dist/fuse.common';
import SearchIcon from '../../assets/search.svg';
import CrossIcon from '../../assets/svg/close.svg';
import { useTranslatedTexts } from '../../utils/hooks';

const SearchInput = ({
  elements,
  searchKeys,
  setElements,
}) => {
  const { SEARCH } = useTranslatedTexts();
  const searchInputRef = useRef(null);
  const [searchValue, setSearchValue] = useState('');

  const searchEngine = useMemo(() => {
    return new Fuse(elements, { keys: searchKeys, threshold: 0.4 });
  }, [elements, searchKeys]);

  useEffect(() => {
    setElements(elements);
    setSearchValue('');
  }, [elements]);

  const onSearchButtonClick = useCallback(() => {
    if (searchValue) {
      setSearchValue('');
      setElements(elements);
    }
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchValue]);

  const onSearchChange = useCallback(e => {
    const _searchValue = e.target.value;
    setSearchValue(_searchValue);

    if (!_searchValue || !searchKeys) {
      return setElements(elements);
    }

    const filteredElements = searchEngine.search(_searchValue).map(i => i.item);

    setElements(filteredElements.length ? filteredElements : 'noResult');
  }, [elements, searchKeys]);

  const handleKeyDown = useCallback(e => {
    e.stopPropagation();
    if (e.key === 'Escape' && searchInputRef.current) {
      setSearchValue('');
      setElements(elements);
      searchInputRef.current.blur();
    }
  }, [elements]);

  return (
    <div className="jfReport-searchContainer">
      <div className="jfReport-search p-relative">
        <input
          ref={searchInputRef}
          className="js-searchInput section-search-input"
          onChange={onSearchChange}
          onKeyDown={handleKeyDown}
          placeholder={SEARCH}
          type="text"
          value={searchValue}
        />
        <button
          className="section-search-button search-icon"
          onClick={onSearchButtonClick}
          type="button"
        >
          <SearchIcon className="section-search-icon" />
        </button>
        {searchValue && (
          <button
            className="section-search-button search-delete"
            onClick={onSearchButtonClick}
            type="button"
          >
            <CrossIcon className="section-search-icon delete" />
          </button>
        )}
      </div>
    </div>
  );
};

SearchInput.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.shape({})),
  searchKeys: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    weight: PropTypes.number,
  })),
  setElements: PropTypes.func,
};

SearchInput.defaultProps = {
  elements: [],
  searchKeys: [],
  setElements: f => f,
};

export default SearchInput;
