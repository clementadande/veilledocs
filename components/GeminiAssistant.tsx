
import React, { useState } from 'react';
// Fixed imports to use existing functions from geminiService
import { getResearchStrategy, fetchLatestResearchTrends } from '../services/geminiService';

const GeminiAssistant: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [trends, setTrends] = useState<any>(null);
  const [error, setError] = useState('');

  const handleGetAdvice = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    setTrends(null);
    try {
      // Fixed call to use getResearchStrategy with empty description as a fallback
      const data = await getResearchStrategy(topic, "");
      setResult(data);
    } catch (err) {
      setError("Désolé, une erreur est survenue lors de la génération des conseils.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetTrends = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    try {
      // Fixed call to use fetchLatestResearchTrends with the required object parameter structure
      const data = await fetchLatestResearchTrends({ name: topic, keywords: [topic] });
      setTrends(data);
    } catch (err) {
      setError("Erreur lors de la recherche des tendances.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="assistant" className="py-12 bg-indigo-900 rounded-3xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-800 rounded-full blur-3xl opacity-50 -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-800 rounded-full blur-3xl opacity-50 -ml-32 -mb-32"></div>
      
      <div className="relative max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-4">Assistant de Veille IA</h2>
          <p className="text-indigo-200 text-lg">
            Saisissez votre sujet pour obtenir une stratégie personnalisée ou les dernières tendances.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ex: Intelligence Artificielle en Santé, Marketing de Luxe, Cybersécurité..."
            className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all text-lg"
          />
          <button
            onClick={handleGetAdvice}
            disabled={loading}
            className="bg-white text-indigo-900 px-8 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? 'Calcul...' : 'Générer Stratégie'}
          </button>
          <button
            onClick={handleGetTrends}
            disabled={loading}
            className="bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-400 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            Dernières Trends
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-100 p-4 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        {(result || trends) && (
          <div className="bg-white rounded-2xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {result && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-indigo-600 font-bold uppercase tracking-wider text-xs mb-2">Conseils d'Expert</h4>
                  <p className="text-slate-800 leading-relaxed text-lg">{result.advice}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-indigo-600 font-bold uppercase tracking-wider text-xs mb-3">Mots-clés suggérés</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.suggestedKeywords.map((kw: string, i: number) => (
                        <span key={i} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium border border-indigo-100">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-indigo-600 font-bold uppercase tracking-wider text-xs mb-3">Sources recommandées</h4>
                    <ul className="space-y-1">
                      {result.suggestedSources.map((src: string, i: number) => (
                        <li key={i} className="text-slate-700 text-sm flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                          {src}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {trends && (
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="text-indigo-600 font-bold uppercase tracking-wider text-xs mb-4">Actualités Récentes</h4>
                <div className="prose prose-slate max-w-none text-slate-800 mb-6 whitespace-pre-line">
                  {/* Updated access to 'content' property as returned by the service */}
                  {trends.content}
                </div>
                {trends.sources.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-bold text-slate-400 mb-2 uppercase">Sources Grounding :</p>
                    <div className="flex flex-wrap gap-4">
                      {trends.sources.map((s: any, i: number) => (
                        <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                          🔗 {s.title || 'Source'}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default GeminiAssistant;
