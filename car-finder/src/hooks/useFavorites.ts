import { useState, useEffect } from 'react';
import type { Car } from '../types';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Car[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('car-finder-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('car-finder-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (car: Car) => {
    setFavorites(prev => {
      // Check if car is already in favorites
      const exists = prev.some(fav => 
        fav.Name === car.Name && 
        fav.Model === car.Model && 
        fav.Price === car.Price &&
        fav.Location === car.Location
      );
      
      if (exists) {
        return prev;
      }
      
      return [...prev, car];
    });
  };

  const removeFavorite = (car: Car) => {
    setFavorites(prev => 
      prev.filter(fav => 
        !(fav.Name === car.Name && 
          fav.Model === car.Model && 
          fav.Price === car.Price &&
          fav.Location === car.Location)
      )
    );
  };

  const toggleFavorite = (car: Car) => {
    const isFavorite = favorites.some(fav => 
      fav.Name === car.Name && 
      fav.Model === car.Model && 
      fav.Price === car.Price &&
      fav.Location === car.Location
    );

    if (isFavorite) {
      removeFavorite(car);
    } else {
      addFavorite(car);
    }
  };

  const isFavorite = (car: Car) => {
    return favorites.some(fav => 
      fav.Name === car.Name && 
      fav.Model === car.Model && 
      fav.Price === car.Price &&
      fav.Location === car.Location
    );
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite
  };
};