import { useEffect } from 'react';
import type { Car } from '../types';

interface CarDetailsModalProps {
  car: Car;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (car: Car) => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};

const CarDetailsModal = ({ car, isOpen, onClose, isFavorite, onToggleFavorite }: CarDetailsModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Dados simulados para enriquecer o modal
  const mockSpecs = {
    year: 2022 + Math.floor(Math.random() * 3),
    mileage: Math.floor(Math.random() * 50000) + 5000,
    fuel: ['Flex', 'Gasolina', 'Elétrico', 'Híbrido'][Math.floor(Math.random() * 4)],
    transmission: Math.random() > 0.5 ? 'Automático' : 'Manual',
    color: ['Branco', 'Preto', 'Prata', 'Azul', 'Vermelho'][Math.floor(Math.random() * 5)],
    doors: Math.random() > 0.3 ? 4 : 2,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative">
          <img 
            src={car.Image} 
            alt={`${car.Name} ${car.Model}`}
            className="w-full h-64 md:h-80 object-cover rounded-t-xl"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800';
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="absolute bottom-4 left-4">
            <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
              {formatPrice(car.Price)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {car.Name} {car.Model}
              </h2>
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{car.Location}</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
              <span className="text-green-600 font-medium">Disponível</span>
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Ano</div>
              <div className="font-semibold text-gray-900">{mockSpecs.year}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Quilometragem</div>
              <div className="font-semibold text-gray-900">{mockSpecs.mileage.toLocaleString('pt-BR')} km</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Combustível</div>
              <div className="font-semibold text-gray-900">{mockSpecs.fuel}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Câmbio</div>
              <div className="font-semibold text-gray-900">{mockSpecs.transmission}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Cor</div>
              <div className="font-semibold text-gray-900">{mockSpecs.color}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Portas</div>
              <div className="font-semibold text-gray-900">{mockSpecs.doors} portas</div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Características</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                'Ar Condicionado',
                'Direção Hidráulica',
                'Vidro Elétrico',
                'Trava Elétrica',
                'Som Original',
                'Airbag Duplo'
              ].map((feature) => (
                <div key={feature} className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Descrição</h3>
            <p className="text-gray-600 leading-relaxed">
              {car.Name} {car.Model} {mockSpecs.year} em excelente estado de conservação. 
              Veículo revisado, com documentação em dia e pronto para transferência. 
              {mockSpecs.fuel === 'Elétrico' ? 
                'Veículo elétrico com autonomia estendida e baixo custo de manutenção.' :
                'Motor econômico e confiável, ideal para uso urbano e viagens.'
              }
            </p>
          </div>

          {/* Contact Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Ligar para Vendedor
            </button>
            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              WhatsApp
            </button>
            <button 
              onClick={() => onToggleFavorite(car)}
              className={`px-6 py-4 border rounded-lg transition-all duration-200 flex items-center justify-center ${
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
    </div>
  );
};

export default CarDetailsModal;