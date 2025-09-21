export interface Car {
  Name: string;
  Model: string;
  Image: string;
  Price: number;
  Location: string;
}

export interface SearchFilters {
  query: string;
  maxPrice?: number;
  minPrice?: number;
  location?: string;
}

export interface SearchResult {
  cars: Car[];
  suggestions?: Car[];
  message?: string;
}