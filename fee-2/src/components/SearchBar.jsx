import { useCallback, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext.jsx';
import '../styles/community.css';

export default function SearchBar({ placeholder = 'Search destinations, stories, tips…', className = '', id = 'community-search' }) {
  const { searchQuery, setSearchQuery } = useCommunity();
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  const handleChange = useCallback((e) => {
    const value = e.target.value;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchQuery(value);
    }, 250);
  }, [setSearchQuery]);

  // Sync controlled value back to input when searchQuery is cleared externally
  useEffect(() => {
    if (searchQuery === '' && inputRef.current) {
      inputRef.current.value = '';
    }
  }, [searchQuery]);

  const handleClear = useCallback(() => {
    setSearchQuery('');
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  }, [setSearchQuery]);

  return (
    <div className={`search-bar ${className}`} role="search">
      <label htmlFor={id} className="visually-hidden">Search community posts</label>
      <Search size={16} className="search-bar__icon" aria-hidden="true" />
      <input
        id={id}
        ref={inputRef}
        type="text"
        className="search-bar__input"
        defaultValue={searchQuery}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck="false"
        aria-label="Search destinations, tips, and stories"
      />
      {searchQuery && (
        <button
          className="search-bar__clear"
          onClick={handleClear}
          aria-label="Clear search"
          type="button"
        >
          <X size={14} />
        </button>
      )}

      <style>{`.visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}`}</style>
    </div>
  );
}
