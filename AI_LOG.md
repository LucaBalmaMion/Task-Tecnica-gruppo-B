# 🤖 AI Log del Team

Usare assistenti AI (Copilot, ChatGPT, Claude, Cursor, ...) è **consentito e incoraggiato**.
Vi chiediamo solo di tenere traccia delle interazioni più significative (bastano 4-6 righe in tutto).
Durante il debrief potremo chiedere a chiunque di spiegare una qualsiasi riga committata.

| # | Chi | Strumento | Cosa avete chiesto (in breve) | Cosa avete accettato / scartato / corretto, e perché |
| --- | --- | --- | --- | --- |
| 1 | Team | Gemini | Fix per UB-01 e UB-02 (bacheca inizialmente vuota e filtri rotti). | Accettate modifiche al fetching iniziale e alla gestione dello stato dei filtri per ripristinare il corretto rendering dei progetti al mount. |
| 2 | Team | Gemini | Risoluzione UB-04 (race condition con connessione lenta). | Accettata implementazione di `AbortController` nell'`useEffect` per annullare le richieste pendenti a Supabase, evitando la sovrascrittura con dati vecchi. |
| 3 | Team | Gemini | Fix per UB-11 (date di scadenza chiuse troppo presto) e fix a cascata UB-03 (ricerca/sort). | Accettato l'update in `projectUtils.js` per settare l'orario a `23:59:59` e l'uso di `[...projects].sort()` per non mutare l'array originale in React. |
| 4 | Giacomo Luca | Gemini | Assistenza su disallineamento Git tra colleghi (file mancanti e commit parziali da web). | Applicati reset del repository locale, configurazione identità globale e `git push --force` per ripristinare l'intera cartella `src` sovrascrivendo la remote. |

link chat Alexandro/Giacomo: https://share.gemini.google/QYBPCg27NTw1
link chat Luca/Giacomo: https://share.gemini.google/JCCez6b9RSFJ
