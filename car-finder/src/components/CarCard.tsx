import type { Car } from '../types';

interface CarCardProps {
  car: Car;
  onViewDetails: (car: Car) => void;
  isFavorite: boolean;
  onToggleFavorite: (car: Car) => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};

const CarCard: React.FC<CarCardProps> = ({ car, onViewDetails, isFavorite, onToggleFavorite }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg card-hover overflow-hidden border border-gray-100">
      <div className="relative">
        <img 
          src={car.Image} 
          alt={`${car.Name} ${car.Model}`}
          className="w-full h-48 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500';
          }}
        />
        <div className="absolute top-4 right-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            {formatPrice(car.Price)}
          </span>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
            {car.Name}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {car.Name} {car.Model}
            </h3>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span className="text-sm text-green-600 font-medium">Disponível</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 mb-6">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">{car.Location}</span>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => onViewDetails(car)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg"
          >
            Ver Detalhes
          </button>
          <button 
            onClick={() => onToggleFavorite(car)}
            className={`px-4 py-3 border rounded-lg transition-all duration-200 ${
              isFavorite 
                ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;