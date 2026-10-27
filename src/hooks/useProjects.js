import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const PAGE_SIZE = 6;

// =========================================================================
// 🐛 UB-01 FATTO / UB-02 / UB-04 (Data Fetching, Join Relazionale e Filtri):
// Analizzate cosa succede quando cambiano i filtri e come viene costruita
// la query verso Supabase (inclusa la relazione con `project_applications`).
// Attenzione: con VITE_SIMULATE_SLOW_NETWORK=true le risposte arrivano in
// ritardo e in ordine casuale. Cambiate categoria velocemente più volte:
// i progetti mostrati corrispondono sempre al filtro selezionato?
// =========================================================================

// Carica i progetti (con le candidature) a pagine di PAGE_SIZE elementi.
export function useProjects({ category, difficulty }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

useEffect(() => {
    // 1. Flag locale per verificare se l'effetto corrente è ancora valido
    let isCurrent = true;
    
    // 2. Controller di rete per annullare la chiamata HTTP precedente
    const controller = new AbortController();

    // Reset immediato dello stato all'avvio del cambio filtro
    setLoading(true);
    setErrorMsg(null);

    async function fetchProjects() {
      try {
        let query = supabase
          .from('projects')
          .select('*, project_applications(*)')
          .order('created_at', { ascending: false })
          .range(0, PAGE_SIZE - 1)
          .abortSignal(controller.signal); // Collega il segnale di abort alla query

        // Applica i filtri esatti
        if (category && category !== 'Tutte') {
          query = query.eq('category', category);
        }
        if (difficulty && difficulty !== 'Tutte') {
          query = query.eq('difficulty', difficulty);
        }

        const { data, error } = await query;

        // Se l'utente ha cambiato filtro nel frattempo, blocca l'aggiornamento
        if (!isCurrent) return;

        if (error) {
          console.error('Errore Supabase:', error);
          setErrorMsg(error.message);
        } else {
          setProjects(data || []);
        }
      } catch (err) {
        // Ignora gli errori derivanti dall'annullamento intenzionale della chiamata
        if (err.name !== 'AbortError' && isCurrent) {
          console.error('Eccezione durante la fetch:', err);
          setErrorMsg('Errore imprevisto nel caricamento.');
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    fetchProjects();

    // 3. Funzione di Cleanup: eseguita non appena 'category' o 'difficulty' cambiano
    return () => {
      isCurrent = false;  // Disattiva il flag per questa esecuzione
      controller.abort(); // Interrompe fisicamente la richiesta HTTP in corso
    };
  }, [category, difficulty]);

  // Bottone "Carica altri": richiede la pagina successiva e la accoda alla lista
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProjects(nextPage);
  };

  return { projects, setProjects, loading, errorMsg, hasMore, loadMore };
}
