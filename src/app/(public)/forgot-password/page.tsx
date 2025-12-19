//pages/forgot-password.tsx
import React, { useState } from 'react';
import { 
    Mail, Dumbbell, AlertCircle, Loader, ArrowRight, 
    ArrowLeft, CheckCircle
} from 'lucide-react';

const SporvitForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [email, setEmail] = useState('');

    // FIX: Tipificación de 'e' como React.MouseEvent<HTMLButtonElement>
    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess(false);

    // Validación básica
    if (!email || !email.includes('@')) {
      setError('Por favor, introduce un email válido');
      setIsLoading(false);
      return;
    }

    // Simulación de llamada API
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-4">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Success Card */}
        <div className="relative w-full max-w-md">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl text-center animate-in zoom-in fade-in">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>

            <h2 className="text-2xl font-bold mb-4">¡Email enviado!</h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Hemos enviado un enlace de recuperación a <strong className="text-white">{email}</strong>
            </p>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-400">
                <strong>💡 Consejo:</strong> Si no ves el email en unos minutos, revisa tu carpeta de spam
              </p>
            </div>

            <div className="space-y-3">
              <a
                href="/login"
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-2"
              >
                Volver al inicio de sesión
                <ArrowRight className="w-5 h-5" />
              </a>

              <button
                onClick={() => setSuccess(false)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition-all text-slate-300"
              >
                Intentar con otro email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Forgot Password Card */}
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/50">
              <Dumbbell className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Sporvit
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">¿Olvidaste tu contraseña?</h1>
          <p className="text-slate-400">No te preocupes, te ayudaremos a recuperarla</p>
        </div>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Info Box */}
          <div className="mb-6 p-4 bg-slate-900 rounded-xl border border-slate-700">
            <p className="text-sm text-slate-300 leading-relaxed">
              Introduce tu email y te enviaremos un enlace para restablecer tu contraseña
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-slate-300">
                Email de tu cuenta
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Enviando enlace...
                </>
              ) : (
                <>
                  Enviar enlace de recuperación
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Back to Login */}
            <a
              href="/login"
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-slate-300"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al inicio de sesión
            </a>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-slate-400">
            ¿Necesitas ayuda?{' '}
            <a href="/contact" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              Contáctanos
            </a>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <a href="/" className="text-sm text-slate-500 hover:text-slate-400 transition-colors">
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
};

export default SporvitForgotPassword;