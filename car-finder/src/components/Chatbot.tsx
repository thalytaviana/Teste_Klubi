import { useState, useEffect, useRef } from 'react';
import type { Car } from '../types';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  cars?: Car[];
}

interface ChatbotProps {
  cars: Car[];
  onCarSelect: (car: Car) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Chatbot = ({ cars, onCarSelect, isOpen, onToggle }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mensagem inicial
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        text: '👋 Olá! Sou CarBot, seu assistente pessoal para encontrar o carro perfeito!\n\nPosso te ajudar a encontrar carros por:\n• Marca e modelo específicos\n• Faixa de preço (ex: "menos que 50 mil")\n• Localização (ex: "que não seja de São Paulo")\n• Tipo de combustível\n• E muito mais!\n\nO que você está procurando hoje?',
        isBot: true,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const processUserMessage = async (userMessage: string): Promise<Message> => {
    const message = userMessage.toLowerCase();
    
    // Análise de intenção avançada
    let filteredCars = [...cars];
    let response = '';
    
    // Detectar marca/modelo
    const brands = ['byd', 'toyota', 'volkswagen', 'honda', 'chevrolet', 'hyundai', 'renault', 'fiat', 'jeep', 'peugeot'];
    const models = ['dolphin', 'corolla', 't-cross', 'civic', 'onix', 'hb20', 'kwid', 'pulse', 'renegade', '208'];
    
    const mentionedBrand = brands.find(brand => message.includes(brand));
    const mentionedModel = models.find(model => message.includes(model));
    
    // Detectar preço com diferentes formatos
    const pricePatterns = [
      /(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/g, // formato brasileiro
      /(\d+(?:\.\d+)?)\s*(?:mil|k)/g, // "50 mil" ou "50k"
      /(\d+)/g // números simples
    ];
    
    let maxPrice: number | undefined;
    let minPrice: number | undefined;
    
    // Detectar operadores de comparação
    const isLessThan = /(?:menos|abaixo|até|no máximo|menor)\s*(?:que|de)?\s*(\d+)/i.test(message);
    const isMoreThan = /(?:mais|acima|maior)\s*(?:que|de)?\s*(\d+)/i.test(message);
    const isBetween = /entre\s*(\d+)\s*(?:e|a)\s*(\d+)/i.test(message);
    
    if (isBetween) {
      const betweenMatch = message.match(/entre\s*(\d+)\s*(?:e|a)\s*(\d+)/i);
      if (betweenMatch) {
        minPrice = parseInt(betweenMatch[1]) * 1000;
        maxPrice = parseInt(betweenMatch[2]) * 1000;
      }
    } else if (isLessThan) {
      const lessMatch = message.match(/(?:menos|abaixo|até|no máximo|menor)\s*(?:que|de)?\s*(\d+)/i);
      if (lessMatch) {
        maxPrice = parseInt(lessMatch[1]) * 1000;
      }
    } else if (isMoreThan) {
      const moreMatch = message.match(/(?:mais|acima|maior)\s*(?:que|de)?\s*(\d+)/i);
      if (moreMatch) {
        minPrice = parseInt(moreMatch[1]) * 1000;
      }
    } else {
      // Detectar preço geral
      for (const pattern of pricePatterns) {
        const prices = message.match(pattern);
        if (prices) {
          if (message.includes('mil') || message.includes('k')) {
            maxPrice = parseInt(prices[0]) * 1000;
          } else if (parseInt(prices[0]) > 1000) {
            maxPrice = parseInt(prices[0].replace(/\./g, '').replace(',', ''));
          } else {
            maxPrice = parseInt(prices[0]) * 1000;
          }
          break;
        }
      }
    }
    
    // Detectar localização com negação
    const locations = ['são paulo', 'rio de janeiro', 'belo horizonte', 'curitiba', 'porto alegre', 'campinas', 'sp', 'rj', 'mg', 'pr', 'rs'];
    let mentionedLocation: string | undefined;
    let excludedLocation: string | undefined;
    
    // Primeiro, verificar se há negação específica na frase
    const hasNegation = /(?:não|nao)\s+seja/i.test(message) || 
                       /que\s+(?:não|nao)\s+(?:seja|de|em)/i.test(message) ||
                       /(?:exceto|menos|fora)\s+(?:de\s+)?(?:são paulo|sp|rio|rj)/i.test(message);
    
    if (hasNegation) {
      // Se tem negação, procurar a localização que deve ser excluída
      for (const loc of locations) {
        if (message.includes(loc) && /(?:não|nao|exceto|menos|fora).*${loc}|${loc}.*(?:não|nao|exceto|menos|fora)/.test(message)) {
          excludedLocation = loc;
          break;
        }
      }
    } else {
      // Se não tem negação, procurar localização normal (incluindo "de Campinas", "em SP", etc.)
      for (const loc of locations) {
        if (message.includes(loc)) {
          mentionedLocation = loc;
          break;
        }
      }
    }
    
    // Aplicar filtros
    if (mentionedBrand) {
      filteredCars = filteredCars.filter(car => 
        car.Name.toLowerCase().includes(mentionedBrand)
      );
    }
    
    if (mentionedModel) {
      filteredCars = filteredCars.filter(car => 
        car.Model.toLowerCase().includes(mentionedModel)
      );
    }
    
    // Filtro de preço com lógica aprimorada
    if (minPrice || maxPrice) {
      let priceFilteredCars = filteredCars;
      
      if (minPrice && maxPrice) {
        priceFilteredCars = filteredCars.filter(car => car.Price >= minPrice && car.Price <= maxPrice);
      } else if (maxPrice) {
        priceFilteredCars = filteredCars.filter(car => car.Price <= maxPrice);
      } else if (minPrice) {
        priceFilteredCars = filteredCars.filter(car => car.Price >= minPrice);
      }
      
      if (priceFilteredCars.length === 0) {
        // Não encontrou carros na faixa de preço, sugerir mais próximos
        const priceReference = maxPrice || minPrice || 0;
        filteredCars = filteredCars
          .sort((a, b) => Math.abs(a.Price - priceReference) - Math.abs(b.Price - priceReference))
          .slice(0, 3);
        
        if (maxPrice) {
          response = `💰 Não encontrei carros até ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(maxPrice)}, mas aqui estão as opções mais próximas do seu orçamento:\n\n`;
        } else if (minPrice) {
          response = `💰 Não encontrei carros acima de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(minPrice)}, mas aqui estão as opções mais próximas:\n\n`;
        }
      } else {
        filteredCars = priceFilteredCars;
      }
    }
    
    // Filtro de localização com exclusão
    if (excludedLocation) {
      const beforeCount = filteredCars.length;
      filteredCars = filteredCars.filter(car => {
        const carLocation = car.Location.toLowerCase();
        const shouldExclude = carLocation.includes(excludedLocation.toLowerCase());
        return !shouldExclude;
      });
      
      if (filteredCars.length === 0 && beforeCount > 0) {
        response = `Parece que todos os carros que encontrei são de ${excludedLocation}! Que tal considerar outras opções de localização?\n\nVou mostrar algumas alternativas mesmo assim:\n\n`;
        // Restaurar carros originais se todos foram filtrados
        filteredCars = cars.slice(0, 3);
      } else if (filteredCars.length > 0) {
        response = `Perfeito! Encontrei carros que não são de ${excludedLocation}:\n\n`;
      }
    } else if (mentionedLocation) {
      const locationMatch = filteredCars.filter(car => {
        const carLocation = car.Location.toLowerCase();
        const matches = carLocation.includes(mentionedLocation.toLowerCase());
        return matches;
      });
      
      if (locationMatch.length > 0) {
        filteredCars = locationMatch;
        response = `Encontrei ${locationMatch.length} ${locationMatch.length === 1 ? 'carro' : 'carros'} em ${mentionedLocation.charAt(0).toUpperCase() + mentionedLocation.slice(1)} dentro do seu orçamento:\n\n`;
      } else {
        // Não encontrou carros na cidade específica
        response = `Não encontrei carros em ${mentionedLocation.charAt(0).toUpperCase() + mentionedLocation.slice(1)} dentro do seu orçamento de até ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(maxPrice || 0)}.\n\nMas encontrei ótimas opções em cidades próximas que podem interessar:\n\n`;
        
        // Manter os carros filtrados por preço, mas de outras cidades
        if (filteredCars.length === 0) {
          // Se não há carros nem no orçamento, mostrar os mais próximos do preço
          filteredCars = cars
            .sort((a, b) => Math.abs(a.Price - (maxPrice || 100000)) - Math.abs(b.Price - (maxPrice || 100000)))
            .slice(0, 3);
        }
      }
    }
    
    // Gerar resposta contextual
    if (filteredCars.length === 0) {
      response = `Hmm, não encontrei carros exatamente com essas especificações.\n\nQue tal tentar:\n• Aumentar a faixa de preço\n• Buscar por outras marcas similares\n• Considerar outras cidades próximas\n\nPosso sugerir algumas opções populares se quiser!`;
    } else if (filteredCars.length === 1) {
      const car = filteredCars[0];
      response = `Perfeito! Encontrei exatamente o que você procura:\n\n**${car.Name} ${car.Model}** em ${car.Location}\n${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(car.Price)}\n\nEsse carro tem ótimo custo-benefício! Quer ver mais detalhes?`;
    } else if (filteredCars.length <= 3) {
      response = `Ótima escolha! Encontrei ${filteredCars.length} opções que combinam perfeitamente com você:\n\n`;
    } else {
      response = `Temos ${filteredCars.length} opções incríveis para você! Aqui estão as 3 melhores:\n\n`;
      filteredCars = filteredCars.slice(0, 3);
    }
    
    // Respostas para perguntas específicas
    if (message.includes('mais barato') || message.includes('econômico')) {
      filteredCars = cars.sort((a, b) => a.Price - b.Price).slice(0, 3);
      response = 'Aqui estão os carros mais econômicos da nossa seleção:\n\n';
    }
    
    if (message.includes('mais caro') || message.includes('luxo')) {
      filteredCars = cars.sort((a, b) => b.Price - a.Price).slice(0, 3);
      response = 'Para você que busca o premium, temos estas opções de luxo:\n\n';
    }
    
    if (message.includes('elétrico') || message.includes('sustentável')) {
      filteredCars = cars.filter(car => car.Name.toLowerCase().includes('byd'));
      response = 'Excelente escolha! Carros elétricos são o futuro. Confira:\n\n';
    }
    
    return {
      id: Date.now().toString(),
      text: response,
      isBot: true,
      timestamp: new Date(),
      cars: filteredCars.length > 0 ? filteredCars : undefined
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simular tempo de processamento
    setTimeout(async () => {
      const botResponse = await processUserMessage(input);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 md:p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-x-4 bottom-4 md:bottom-6 md:right-6 md:left-auto md:inset-x-auto md:w-96 h-[70vh] md:h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50 max-w-md md:max-w-none">
      {/* Header */}
      <div className="bg-blue-600 text-white p-3 md:p-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500 rounded-full flex items-center justify-center text-sm md:text-base">
            🤖
          </div>
          <div>
            <h3 className="font-semibold text-sm md:text-base">CarBot</h3>
            <p className="text-xs opacity-90">Assistente de Carros</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="text-white hover:bg-blue-500 p-1 rounded transition-colors"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 md:p-4 overflow-y-auto space-y-3 md:space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] md:max-w-[80%] p-2 md:p-3 rounded-lg ${
              message.isBot 
                ? 'bg-gray-100 text-gray-800' 
                : 'bg-blue-600 text-white'
            }`}>
              <p className="text-xs md:text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
              
              {/* Mostrar carros sugeridos */}
              {message.cars && message.cars.length > 0 && (
                <div className="mt-2 md:mt-3 space-y-2">
                  {message.cars.map((car, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-2 md:p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                         onClick={() => onCarSelect(car)}>
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-xs md:text-sm truncate">
                            {car.Name} {car.Model}
                          </h4>
                          <p className="text-xs text-gray-500 truncate">{car.Location}</p>
                        </div>
                        <p className="text-xs md:text-sm font-bold text-blue-600 whitespace-nowrap">
                          {formatPrice(car.Price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-2 md:p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 md:p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ex: Quero um carro até 100 mil..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs md:text-sm min-w-0"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-3 md:px-4 py-2 rounded-lg transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;