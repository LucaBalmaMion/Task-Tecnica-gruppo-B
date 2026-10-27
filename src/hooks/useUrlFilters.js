import { useState, useEffect } from 'react';

export const DEFAULT_FILTERS = { category: 'Tutte', difficulty: 'Tutte', q: '', sort: 'newest' };

// 1. Legge i filtri in modo sicuro dall'URL
function readFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const filters = { ...DEFAULT_FILTERS };

  for (const [key, value] of params.entries()) {
    if (key in DEFAULT_FILTERS) {
      filters[key] = value; // URLSearchParams gestisce già la decodifica nativa dei caratteri speciali
    }
  }
  return filters;
}

// 2. Scrive nell'URL mantenendo i parametri extra (es. ?user=giulia) e codificando i valori
function writeFiltersToUrl(filters) {
  // Mantiene i parametri URL esistenti anziché sovrascriverli da zero (risolve UB-07)
  const params = new URLSearchParams(window.location.search);

  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== DEFAULT_FILTERS[key]) {
      params.set(key, value); // Codifica automaticamente caratteri come '&' -> '%26' (risolve UB-06)
    } else {
      params.delete(key);
    }
  });

  const queryString = params.toString();
  const newUrl = queryString ? `?${queryString}` : window.location.pathname;

  // Usa replaceState per non aggiungere una pagina in cronologia a ogni lettera digitata (risolve UB-06)
  window.history.replaceState(null, '', newUrl);
}

export function useUrlFilters() {
  const [filters, setFilters] = useState(readFiltersFromUrl);

  // 3. Ascolta la navigazione "Indietro" e "Avanti" del browser (risolve UB-06)
  useEffect(() => {
    const handlePopState = () => {
      setFilters(readFiltersFromUrl());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const updateFilters = (changes) => {
    setFilters((prev) => {
      const next = { ...prev, ...changes };
      writeFiltersToUrl(next);
      return next;
    });
  };

  return [filters, updateFilters];
}