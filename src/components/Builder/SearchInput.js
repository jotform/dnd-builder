import {
  useCallback,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import SearchIcon from '../../assets/search.svg';
import CrossIcon from '../../assets/svg/close.svg';
import { useTranslatedTexts } from '../../utils/hooks';

const SearchInput = ({
  onSearch,
}) => {
  const { SEARCH } = useTranslatedTexts();
  const searchInputRef = useRef(null);
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = useCallback(e => {
    const { value } = e?.target || {};
    setSearchValue(value);
    onSearch?.(value);
  }, [onSearch]);

  const handleClearSearch = useCallback(() => {
    setSearchValue('');
    onSearch?.('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [onSearch]);

  const handleKeyDown = useCallback(e => {
    e.stopPropagation();
    if (e.key === 'Escape' && searchInputRef.current) {
      setSearchValue('');
      searchInputRef.current.blur();
    }
  }, []);

  return (
    <div className="jfReport-searchContainer">
      <div className="jfReport-search p-relative">
        <input
          ref={searchInputRef}
          className="js-searchInput section-search-input"
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          placeholder={SEARCH}
          type="text"
          value={searchValue}
        />
        <span
          className="search-icon"
          style={{ top: '50%', left: '8px', position: 'absolute', transform: 'translateY(-40%)' }}
        >
          <SearchIcon className="section-search-icon" />
        </span>
        {searchValue && (
          <button
            className="section-search-button search-delete"
            onClick={handleClearSearch}
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
  onSearch: PropTypes.func,
};

export default SearchInput;
