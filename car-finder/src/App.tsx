import { useState, useEffect } from 'react';
import type { Car, SearchResult } from './types';
import { useFavorites } from './hooks/useFavorites';
import SearchBar from './components/SearchBar';
import CarCard from './components/CarCard';
import LoadingSpinner from './components/LoadingSpinner';
import SearchStats from './components/SearchStats';
import CarDetailsModal from './components/CarDetailsModal';
import Chatbot from './components/Chatbot';

function App() {
  const [cars, setCars] = useState<Car[]>([]);
  const [searchResult, setSearchResult] = useState<SearchResult>({ cars: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  
  // Favorites system
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Load cars data
  useEffect(() => {
    const loadCars = async () => {
      try {
        const response = await fetch('/cars.json');
        const carsData = await response.json();
        setCars(carsData);
        setSearchResult({ cars: carsData });
      } catch (error) {
        console.error('Error loading cars:', error);
      }
    };

    loadCars();
  }, []);

  const handleViewDetails = (car: Car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCar(null);
  };

  const handleCarSelect = (car: Car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
    setIsChatbotOpen(false); // Fecha o chatbot quando seleciona um carro
  };

  const searchCars = async (query: string, filters: { maxPrice?: number; location?: string }) => {
    setIsLoading(true);
    setHasSearched(true);
    setCurrentQuery(query);

    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredCars = [...cars];
    let suggestions: Car[] = [];
    let message = '';

    // Apply text search
    if (query.trim()) {
      const searchQuery = query.toLowerCase();
      filteredCars = filteredCars.filter(car =>
        car.Name.toLowerCase().includes(searchQuery) ||
        car.Model.toLowerCase().includes(searchQuery) ||
        `${car.Name} ${car.Model}`.toLowerCase().includes(searchQuery)
      );
    }

    // Apply price filter
    if (filters.maxPrice) {
      const exactPriceMatch = filteredCars.filter(car => car.Price <= filters.maxPrice!);
      
      if (exactPriceMatch.length === 0 && filteredCars.length > 0) {
        // No cars within budget, suggest closest options
        suggestions = filteredCars
          .sort((a, b) => Math.abs(a.Price - filters.maxPrice!) - Math.abs(b.Price - filters.maxPrice!))
          .slice(0, 3);
        message = `Não encontramos carros exatamente no seu orçamento de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(filters.maxPrice)}. Aqui estão algumas opções próximas:`;
        filteredCars = [];
      } else {
        filteredCars = exactPriceMatch;
      }
    }

    // Apply location filter
    if (filters.location) {
      const locationMatch = filteredCars.filter(car => 
        car.Location.toLowerCase().includes(filters.location!.toLowerCase())
      );
      
      if (locationMatch.length === 0 && filteredCars.length > 0) {
        // No cars in this location, suggest alternatives
        if (!message) {
          suggestions = filteredCars.slice(0, 3);
          message = `Não encontramos este carro em ${filters.location}. Aqui estão opções similares em outras cidades:`;
          filteredCars = [];
        }
      } else {
        filteredCars = locationMatch;
      }
    }

    // Handle no results
    if (filteredCars.length === 0 && suggestions.length === 0) {
      if (query.trim()) {
        // Suggest similar cars by brand or model
        const brandSuggestions = cars.filter(car => {
          const queryWords = query.toLowerCase().split(' ');
          return queryWords.some(word => 
            car.Name.toLowerCase().includes(word) || 
            car.Model.toLowerCase().includes(word)
          );
        }).slice(0, 3);
        
        suggestions = brandSuggestions.length > 0 ? brandSuggestions : cars.slice(0, 3);
        message = brandSuggestions.length > 0 
          ? 'Não encontramos exatamente o que você procura. Que tal essas opções similares?' 
          : 'Não encontramos o que você procura. Veja nossas opções disponíveis:';
      }
    }

    setSearchResult({
      cars: filteredCars,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      message
    });
    
    setIsLoading(false);
  };

  const { cars: resultCars, suggestions, message } = searchResult;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Car Finder
              </h1>
              <p className="text-lg text-gray-600">
                Encontre o carro perfeito para você
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className={`relative px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 ${
                  showFavorites 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <svg className="w-5 h-5" fill={showFavorites ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="hidden sm:inline">
                  {showFavorites ? 'Todos os Carros' : 'Favoritos'}
                </span>
                {favorites.length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar onSearch={searchCars} isLoading={isLoading} />

        {/* Loading State */}
        {isLoading && (
          <LoadingSpinner size="lg" text="Buscando os melhores carros para você..." />
        )}

        {/* Results */}
        {!isLoading && hasSearched && (
          <>
            {/* Search Stats */}
            {(resultCars.length > 0 || (suggestions && suggestions.length > 0)) && (
              <SearchStats 
                cars={resultCars.length > 0 ? resultCars : suggestions || []}
                searchQuery={currentQuery}
                totalCars={cars.length}
              />
            )}

            {/* Message */}
            {message && (
              <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                <p className="text-blue-800">{message}</p>
              </div>
            )}

            {/* Main Results */}
            {resultCars.length > 0 && (
              <div className="mb-8">
                {!message && (
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {resultCars.length} {resultCars.length === 1 ? 'carro encontrado' : 'carros encontrados'}
                  </h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resultCars.map((car, index) => (
                    <CarCard 
                      key={`${car.Name}-${car.Model}-${index}`} 
                      car={car} 
                      onViewDetails={handleViewDetails} 
                      isFavorite={isFavorite(car)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {suggestions && suggestions.length > 0 && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {suggestions.map((car, index) => (
                    <CarCard 
                      key={`suggestion-${car.Name}-${car.Model}-${index}`} 
                      car={car} 
                      onViewDetails={handleViewDetails} 
                      isFavorite={isFavorite(car)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* No results and no suggestions */}
            {resultCars.length === 0 && (!suggestions || suggestions.length === 0) && (
              <div className="text-center py-12">
                <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum carro encontrado
                </h3>
                <p className="text-gray-600">
                  Tente ajustar sua busca ou remover alguns filtros.
                </p>
              </div>
            )}
          </>
        )}

        {/* Initial State */}
        {!hasSearched && !isLoading && !showFavorites && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car, index) => (
              <CarCard 
                key={`${car.Name}-${car.Model}-${index}`} 
                car={car} 
                onViewDetails={handleViewDetails} 
                isFavorite={isFavorite(car)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}

        {/* Favorites View */}
        {showFavorites && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                💖 Meus Favoritos
              </h2>
              <p className="text-gray-600">
                {favorites.length === 0 
                  ? 'Nenhum carro favoritado ainda. Use o ❤️ nos carros que você gosta!'
                  : `${favorites.length} ${favorites.length === 1 ? 'carro favorito' : 'carros favoritos'}`
                }
              </p>
            </div>
            
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((car, index) => (
                  <CarCard 
                    key={`favorite-${car.Name}-${car.Model}-${index}`} 
                    car={car} 
                    onViewDetails={handleViewDetails} 
                    isFavorite={true}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-500 mb-2">
                  Nenhum favorito ainda
                </h3>
                <p className="text-gray-400 mb-6">
                  Favorite carros clicando no ❤️ para vê-los aqui
                </p>
                <button
                  onClick={() => setShowFavorites(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Ver Todos os Carros
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal */}
      {selectedCar && (
        <CarDetailsModal
          car={selectedCar}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          isFavorite={isFavorite(selectedCar)}
          onToggleFavorite={toggleFavorite}
        />
      )}
      
      {/* Chatbot */}
      <Chatbot
        cars={cars}
        onCarSelect={handleCarSelect}
        isOpen={isChatbotOpen}
        onToggle={() => setIsChatbotOpen(!isChatbotOpen)}
      />
    </div>
  );
}

export default App;
