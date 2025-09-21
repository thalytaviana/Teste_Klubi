import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string, filters: { maxPrice?: number; location?: string }) => void;
  isLoading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading = false }) => {
  const [query, setQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [location, setLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, {
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      location: location || undefined
    });
  };

  const clearFilters = () => {
    setQuery('');
    setMaxPrice('');
    setLocation('');
    onSearch('', {});
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Main search input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por marca ou modelo (ex: BYD Dolphin, Toyota Corolla...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input pr-12"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>
        </div>

        {/* Filter toggle */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>
          
          {(query || maxPrice || location) && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              Limpar busca
            </button>
          )}
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Preço máximo
              </label>
              <input
                id="maxPrice"
                type="number"
                placeholder="Ex: 100000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Localização
              </label>
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="search-input"
              >
                <option value="">Todas as cidades</option>
                <option value="São Paulo">São Paulo</option>
                <option value="Rio de Janeiro">Rio de Janeiro</option>
                <option value="Belo Horizonte">Belo Horizonte</option>
                <option value="Curitiba">Curitiba</option>
                <option value="Porto Alegre">Porto Alegre</option>
                <option value="Campinas">Campinas</option>
              </select>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;