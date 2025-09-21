import type { Car } from '../types';

interface SearchStatsProps {
  cars: Car[];
  searchQuery?: string;
  totalCars: number;
}

const SearchStats = ({ cars, searchQuery, totalCars }: SearchStatsProps) => {
  const avgPrice = cars.length > 0 
    ? cars.reduce((sum, car) => sum + car.Price, 0) / cars.length 
    : 0;

  const locations = [...new Set(cars.map(car => car.Location))];
  const brands = [...new Set(cars.map(car => car.Name))];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (cars.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border-l-4 border-blue-500">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        📊 Resumo dos Resultados
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{cars.length}</div>
          <div className="text-sm text-gray-600">
            {cars.length === 1 ? 'Carro encontrado' : 'Carros encontrados'}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{formatPrice(avgPrice)}</div>
          <div className="text-sm text-gray-600">Preço médio</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{locations.length}</div>
          <div className="text-sm text-gray-600">
            {locations.length === 1 ? 'Cidade' : 'Cidades'}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{brands.length}</div>
          <div className="text-sm text-gray-600">
            {brands.length === 1 ? 'Marca' : 'Marcas'}
          </div>
        </div>
      </div>

      {searchQuery && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Resultados para: <span className="font-semibold text-gray-900">"{searchQuery}"</span>
            {cars.length < totalCars && (
              <span className="ml-2 text-blue-600">
                ({totalCars - cars.length} carros filtrados)
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchStats;