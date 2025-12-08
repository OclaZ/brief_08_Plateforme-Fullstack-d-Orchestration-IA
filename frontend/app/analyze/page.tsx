'use client';

import React, { useState, useEffect } from 'react';
import { Brain, LogOut, FileText, TrendingUp, BarChart3, Smile, Frown, Minus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const AnalyzePage = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Veuillez entrer un texte à analyser');
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setError('Session expirée. Veuillez vous reconnecter.');
          setTimeout(() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }, 2000);
          return;
        }
        
        let message = 'Une erreur est survenue';
        if (typeof data.detail === 'string') {
          message = data.detail;
        }
        setError(message);
        return;
      }

      setResult(data);
      
      // Add to history
      const newEntry = {
        id: Date.now(),
        text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        ...data,
        timestamp: new Date().toLocaleString('fr-FR'),
      };
      setHistory([newEntry, ...history.slice(0, 4)]);
      
    } catch (err) {
      console.error('Analyze error:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentIcon = (sentiment) => {
    const s = sentiment?.toLowerCase() || '';
    if (s.includes('positive') || s.includes('positif')) {
      return <Smile className="w-6 h-6 text-green-600" />;
    } else if (s.includes('negative') || s.includes('négatif')) {
      return <Frown className="w-6 h-6 text-red-600" />;
    }
    return <Minus className="w-6 h-6 text-gray-600" />;
  };

  const getSentimentColor = (sentiment) => {
    const s = sentiment?.toLowerCase() || '';
    if (s.includes('positive') || s.includes('positif')) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (s.includes('negative') || s.includes('négatif')) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Finance': 'bg-blue-100 text-blue-800',
      'Human Resources': 'bg-purple-100 text-purple-800',
      'IT': 'bg-cyan-100 text-cyan-800',
      'Operations': 'bg-orange-100 text-orange-800',
      'Marketing': 'bg-pink-100 text-pink-800',
      'Legal': 'bg-indigo-100 text-indigo-800',
      'Politics': 'bg-red-100 text-red-800',
      'Healthcare': 'bg-green-100 text-green-800',
      'Education': 'bg-yellow-100 text-yellow-800',
      'Technology': 'bg-teal-100 text-teal-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const exampleTexts = [
    "Le marché boursier a chuté de 2% suite aux annonces de la banque centrale concernant une hausse des taux d'intérêt.",
    "Notre entreprise recrute 50 nouveaux développeurs pour renforcer notre équipe technique sur les projets cloud.",
    "Le nouveau système de gestion des stocks a permis de réduire les coûts opérationnels de 15% ce trimestre.",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Hybrid-Analyzer</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Analysez vos articles
          </h1>
          <p className="text-lg text-gray-600">
            Classification automatique et synthèse contextuelle par IA
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Analysis Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Nouveau texte</h2>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Texte à analyser
                  </label>
                 <textarea
                    value={text}
  onChange={(e) => setText(e.target.value)}
  placeholder="Collez votre article ou texte ici..."
  rows={8}
  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none text-black"
/>

                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-600">Exemples:</span>
                  {exampleTexts.map((example, idx) => (
                    <button
                      key={idx}
                      onClick={() => setText(example)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition"
                    >
                      Exemple {idx + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={loading || !text.trim()}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5" />
                      Analyser le texte
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results */}
            {result && (
              <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Résultats de l'analyse</h2>
                </div>

                <div className="space-y-6">
                  {/* Category & Confidence */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Catégorie</span>
                      </div>
                      <div className={`inline-block px-4 py-2 rounded-lg font-semibold text-lg ${getCategoryColor(result.category)}`}>
                        {result.category}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium text-purple-900">Score de confiance</span>
                      </div>
                      <div className="text-3xl font-bold text-purple-900">
                        {(result.confidence_score * 100).toFixed(1)}%
                      </div>
                      <div className="mt-2 bg-white rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-purple-600 h-full transition-all duration-500"
                          style={{ width: `${result.confidence_score * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sentiment */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      {getSentimentIcon(result.sentiment)}
                      <span className="text-sm font-medium text-gray-900">Sentiment détecté</span>
                    </div>
                    <div className={`inline-block px-4 py-2 rounded-lg font-semibold border-2 ${getSentimentColor(result.sentiment)}`}>
                      {result.sentiment}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Résumé contextuel</span>
                    </div>
                    <p className="text-gray-800 leading-relaxed">
                      {result.summary}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - History */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Historique récent
              </h3>
              
              {history.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Aucune analyse pour le moment</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                      onClick={() => {
                        setText(entry.text);
                        setResult({
                          category: entry.category,
                          confidence_score: entry.confidence_score,
                          summary: entry.summary,
                          sentiment: entry.sentiment,
                        });
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(entry.category)}`}>
                          {entry.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {entry.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {entry.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default AnalyzePage;