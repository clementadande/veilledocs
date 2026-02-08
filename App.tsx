
import React, { useState, useEffect } from 'react';
import { TOOLS } from './constants';
import { ResearchProject, Finding } from './types';
import { getResearchStrategy, fetchLatestResearchTrends } from './services/geminiService';
import FormattedContent from './components/FormattedContent';

const App: React.FC = () => {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', location: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('veille_projects');
    if (saved) setProjects(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('veille_projects', JSON.stringify(projects));
  }, [projects]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name) return;
    setLoading(true);
    try {
      const strategy = await getResearchStrategy(newProject.name, newProject.description, newProject.location);
      const project: ResearchProject = {
        id: Date.now().toString(),
        name: newProject.name,
        description: newProject.description,
        location: newProject.location,
        keywords: strategy.suggestedKeywords,
        sources: strategy.suggestedSources,
        strategy: strategy.advice,
        findings: []
      };
      setProjects([...projects, project]);
      setActiveProjectId(project.id);
      setIsCreating(false);
      setNewProject({ name: '', description: '', location: '' });
    } catch (err) {
      alert("Erreur lors de la création du projet.");
    } finally {
      setLoading(false);
    }
  };

  const activeProject = projects.find(p => p.id === activeProjectId);

  const updateVeille = async () => {
    if (!activeProject) return;
    setLoading(true);
    try {
      const result = await fetchLatestResearchTrends(activeProject);
      const newFinding: Finding = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        content: result.content,
        sources: result.sources as any
      };
      const updatedProjects = projects.map(p => 
        p.id === activeProject.id 
        ? { ...p, findings: [newFinding, ...p.findings] } 
        : p
      );
      setProjects(updatedProjects);
    } catch (err) {
      alert("Erreur lors de la mise à jour de la veille.");
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = (id: string) => {
    if (window.confirm("Supprimer ce projet de recherche ?")) {
      setProjects(projects.filter(p => p.id !== id));
      if (activeProjectId === id) setActiveProjectId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-72 bg-white border-r border-slate-200 p-6 flex flex-col h-screen sticky top-0 z-40">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">V</div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">VeilleDocs Pro</h1>
        </div>

        <button 
          onClick={() => setIsCreating(true)}
          className="w-full mb-8 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 transform active:scale-95"
        >
          <span className="text-xl">+</span> Nouveau Projet
        </button>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Bibliothèque</p>
          {projects.length === 0 && (
            <p className="text-xs text-slate-400 italic px-2">Aucun projet actif</p>
          )}
          {projects.map(p => (
            <div key={p.id} className="group relative">
              <button
                onClick={() => setActiveProjectId(p.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeProjectId === p.id 
                  ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600' 
                  : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'
                }`}
              >
                <div className="truncate pr-4">{p.name}</div>
                {p.location && <div className="text-[10px] opacity-60 flex items-center gap-1 mt-0.5">📍 {p.location}</div>}
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteProject(p.id); }}
                className="absolute right-2 top-4 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1"
                title="Supprimer"
              >
                ✕
              </button>
            </div>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100 space-y-4">
          <div className="bg-slate-900 text-white p-4 rounded-2xl text-xs relative overflow-hidden">
             <div className="absolute top-0 right-0 w-12 h-12 bg-indigo-500/20 rounded-full -mr-6 -mt-6"></div>
            <p className="opacity-70 mb-2 font-semibold">MOTEUR D'ANALYSE</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Gemini 3 Pro Online
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-10 lg:p-16">
        {isCreating ? (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-10 border border-slate-100 animate-in fade-in zoom-in duration-300">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Nouvel Espace de Veille</h2>
              <p className="text-slate-500">Configurez votre environnement de recherche pour une efficacité maximale.</p>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Thématique de recherche</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Évolution du droit spatial européen"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-lg"
                  value={newProject.name}
                  onChange={e => setNewProject({...newProject, name: e.target.value})}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Périmètre Géo (Optionnel)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-4 text-slate-400">📍</span>
                    <input 
                      type="text" 
                      placeholder="Ex: France, Asie, Monde..."
                      className="w-full pl-10 pr-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                      value={newProject.location}
                      onChange={e => setNewProject({...newProject, location: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-end">
                   <p className="text-[10px] text-slate-400 italic">Préciser la zone permet à l'IA de cibler des sources locales et des législations spécifiques.</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contexte et Enjeux</label>
                <textarea 
                  rows={4}
                  placeholder="Quels sont les points critiques à surveiller ?"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                  value={newProject.description}
                  onChange={e => setNewProject({...newProject, description: e.target.value})}
                ></textarea>
              </div>
              <div className="flex gap-4 pt-6">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 shadow-xl shadow-indigo-100 transition-all transform hover:-translate-y-1"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Initialisation...
                    </span>
                  ) : 'Générer l\'Espace Expert'}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        ) : activeProject ? (
          <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500">
            {/* Project Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full -mr-20 -mt-20 opacity-50"></div>
              <div className="space-y-4 relative z-10 flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">{activeProject.name}</h2>
                  {activeProject.location && (
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold border border-indigo-200">
                      📍 {activeProject.location}
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-lg leading-relaxed max-w-3xl">{activeProject.description || "Veille documentaire stratégique."}</p>
              </div>
              <button 
                onClick={updateVeille}
                disabled={loading}
                className="relative z-10 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 disabled:opacity-50 transform active:scale-95"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : <span className="text-xl">⚡</span>}
                Actualiser la Veille
              </button>
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
              {/* Findings Content */}
              <div className="lg:col-span-8 space-y-10">
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3 px-2">
                  <span className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-sm">📄</span>
                  Rapports de Recherche
                </h3>
                
                {activeProject.findings.length === 0 ? (
                  <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center space-y-4">
                    <div className="text-5xl opacity-20">🔍</div>
                    <p className="text-xl font-medium text-slate-400">Aucun rapport généré pour cet espace.</p>
                    <button 
                      onClick={updateVeille} 
                      className="text-indigo-600 font-bold hover:underline"
                    >
                      Lancer la première analyse maintenant →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-12">
                    {activeProject.findings.map((finding, idx) => (
                      <div key={finding.id} className="relative group">
                        {idx !== activeProject.findings.length - 1 && (
                          <div className="absolute left-[-2rem] top-12 bottom-[-3rem] w-0.5 bg-slate-200 hidden md:block"></div>
                        )}
                        <div className="absolute left-[-2.35rem] top-2 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-indigo-50 hidden md:block"></div>

                        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300">
                          <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-50">
                            <span className="text-sm font-bold text-slate-400 flex items-center gap-2">
                              📅 {finding.date}
                            </span>
                            <div className="flex gap-2">
                              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest">Contenu Groundé</span>
                            </div>
                          </div>

                          <div className="finding-content">
                            <FormattedContent content={finding.content} />
                          </div>

                          {finding.sources.length > 0 && (
                            <div className="mt-12 pt-8 border-t border-slate-100 bg-slate-50/50 -mx-8 -mb-8 px-8 pb-8 rounded-b-3xl">
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Index Bibliographique</h4>
                              <div className="grid sm:grid-cols-2 gap-3">
                                {finding.sources.map((s, i) => (
                                  <a 
                                    key={i} 
                                    href={s.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:bg-indigo-50 hover:border-indigo-200 transition-all group/link"
                                  >
                                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold border border-indigo-100 group-hover/link:bg-indigo-600 group-hover/link:text-white transition-colors">
                                      {i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[11px] font-bold text-slate-700 truncate">{s.title || "Lien Source"}</p>
                                      <p className="text-[9px] text-slate-400 truncate tracking-wider uppercase">{new URL(s.uri).hostname.replace('www.', '')}</p>
                                    </div>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:col-span-4 space-y-8">
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm sticky top-10 space-y-8">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-2">PLAN DE VEILLE</h4>
                    <div className="space-y-6">
                      <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 relative">
                        <span className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm shadow-lg">💡</span>
                        <p className="text-[10px] font-bold text-indigo-700 uppercase mb-3 tracking-wider">Conseil IA</p>
                        <p className="text-sm text-indigo-900 italic leading-relaxed">
                          "{activeProject.strategy}"
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-wider">Équation de recherche</p>
                        <div className="flex flex-wrap gap-2">
                          {activeProject.keywords.map((kw, i) => (
                            <span key={i} className="text-[11px] bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 font-mono">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-wider">Sources prioritaires</p>
                        <ul className="space-y-2">
                          {activeProject.sources.map((src, i) => (
                            <li key={i} className="text-xs text-slate-700 flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <span className="text-indigo-500 font-bold">#</span> {src}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-50">
                    <p className="text-[10px] text-slate-400 text-center italic">Veille Docs Pro v2.5 - Module Recherche Académique</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="relative">
              <div className="w-32 h-32 bg-indigo-600 rounded-[2.5rem] rotate-12 flex items-center justify-center text-6xl shadow-2xl shadow-indigo-200">📚</div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-slate-100">⚡</div>
            </div>
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">Votre Hub de <span className="text-indigo-600">Recherche Stratégique</span></h2>
              <p className="text-xl text-slate-500 leading-relaxed">
                Connectez-vous à la puissance de l'IA pour transformer des flux d'informations complexes en rapports de recherche structurés et exploitables.
              </p>
            </div>
            <button 
              onClick={() => setIsCreating(true)}
              className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 hover:scale-105 active:scale-95"
            >
              Créer mon premier Espace
            </button>
            
            <div className="pt-24 grid md:grid-cols-3 gap-8 w-full max-w-5xl opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="p-6 bg-white rounded-3xl border border-slate-100 text-left space-y-3">
                <span className="text-3xl">🎯</span>
                <h4 className="font-bold text-slate-900">Cadrage Précis</h4>
                <p className="text-xs text-slate-500">L'IA définit vos équations de recherche booléennes complexes.</p>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-100 text-left space-y-3">
                <span className="text-3xl">🌍</span>
                <h4 className="font-bold text-slate-900">Périmètre Local</h4>
                <p className="text-xs text-slate-500">Ciblez vos recherches sur des zones géographiques spécifiques.</p>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-100 text-left space-y-3">
                <span className="text-3xl">📊</span>
                <h4 className="font-bold text-slate-900">Grounding Web</h4>
                <p className="text-xs text-slate-500">Vérification en temps réel via Google Search pour des données à jour.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
