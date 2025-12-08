'use client';
import React, { useState } from 'react';
import { AlertCircle, BarChart3, Zap, Shield, Brain, TrendingUp, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const endpoint = authMode === 'login' ? '/login' : '/register';
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        let message = 'Une erreur est survenue';
        if (typeof data.detail === 'string') {
          message = data.detail;
        } else if (Array.isArray(data.detail)) {
          message = data.detail[0].msg || 'Données invalides';
        }
        setError(message);
        return;
      }

      if (authMode === 'login') {
        localStorage.setItem('token', data.access_token);
        window.location.href = '/analyze';
      } else {
        setSuccess('Compte créé avec succès! Vous pouvez maintenant vous connecter.');
        setAuthMode('login');
        setFormData({ username: '', password: '' });
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {authMode === 'login' ? 'Connexion' : 'Inscription'}
              </h2>
              <p className="text-gray-600 mt-2">
                {authMode === 'login' 
                  ? 'Accédez à votre plateforme d\'analyse' 
                  : 'Créez votre compte Hybrid-Analyzer'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">{success}</p>
              </div>
            )}

            <div onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <button
                onClick={handleAuthSubmit}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl"
              >
                {loading ? 'Chargement...' : authMode === 'login' ? 'Se connecter' : 'S\'inscrire'}
              </button>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'register' : 'login');
                  setError('');
                  setSuccess('');
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {authMode === 'login' 
                  ? 'Pas encore de compte? S\'inscrire' 
                  : 'Déjà un compte? Se connecter'}
              </button>
            </div>

            <button
              onClick={() => setShowAuth(false)}
              className="mt-4 w-full text-gray-600 hover:text-gray-700 text-sm"
            >
              ← Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
              onClick={() => setShowAuth(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg"
            >
              Connexion
            </button>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Plateforme d'analyse automatisée
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Automatisez l'analyse de vos articles de presse avec l'IA
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Hybrid-Analyzer transforme des centaines d'articles quotidiens en insights exploitables grâce à la classification intelligente et l'analyse contextuelle.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setShowAuth(true)}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition shadow-xl hover:shadow-2xl"
            >
              Commencer gratuitement
            </button>
            <button className="bg-white text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition border-2 border-gray-200">
              Voir la démo
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Classification Automatique</h3>
            <p className="text-gray-600">
              Catégorisation instantanée via Hugging Face (Finance, RH, IT, Opérations) avec scores de confiance.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Synthèse Contextuelle</h3>
            <p className="text-gray-600">
              Résumés intelligents générés par Gemini avec analyse du ton (positif, négatif, neutre).
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Sécurisé & Fiable</h3>
            <p className="text-gray-600">
              Authentification JWT, orchestration robuste, gestion d'erreurs complète et logs exploitables.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white mb-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Le Problème</h2>
            <p className="text-xl mb-8 text-blue-50">
              Le traitement manuel de centaines d'articles quotidiens est lent, coûteux et difficile à fiabiliser à grande échelle.
            </p>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">⏱️</div>
                <div className="text-sm text-blue-100">Processus lent</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">💰</div>
                <div className="text-sm text-blue-100">Coûts élevés</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">📈</div>
                <div className="text-sm text-blue-100">Non scalable</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">👥</div>
                <div className="text-sm text-blue-100">Dépendance humaine</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Comment ça marche?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="relative">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h4 className="font-semibold text-gray-900 mb-2">Soumission</h4>
                <p className="text-sm text-gray-600">Envoyez votre texte brut via l'interface</p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h4 className="font-semibold text-gray-900 mb-2">Classification</h4>
                <p className="text-sm text-gray-600">Hugging Face catégorise le contenu</p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h4 className="font-semibold text-gray-900 mb-2">Analyse</h4>
                <p className="text-sm text-gray-600">Gemini génère la synthèse contextuelle</p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
                <h4 className="font-semibold text-gray-900 mb-2">Résultats</h4>
                <p className="text-sm text-gray-600">Obtenez catégorie, score, résumé et ton</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
          <TrendingUp className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Prêt à industrialiser votre analyse média?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez les entreprises qui ont déjà automatisé leur processus d'analyse et gagnent des heures chaque jour.
          </p>
          <button
            onClick={() => setShowAuth(true)}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition shadow-xl hover:shadow-2xl"
          >
            Commencer maintenant
          </button>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Hybrid-Analyzer</span>
          </div>
          <p className="text-sm"> Hybrid-Analyzer. Plateforme d'analyse média automatisée par IA.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;