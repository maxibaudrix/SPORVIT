// /pages/reset-password/[token].tsx
import React, { useState, useEffect } from 'react';
import { 
    Lock, Eye, EyeOff, Dumbbell, AlertCircle, 
    Loader, ArrowRight, CheckCircle, XCircle, Home
} from 'lucide-react';

const SporvitResetPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [tokenValid, setTokenValid] = useState(true);
    const [checkingToken, setCheckingToken] = useState(true);
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });

    // Simular validación de token al cargar la página
    useEffect(() => {
        const validateToken = () => {
            // Simulación de latencia de red
            setTimeout(() => {
                // En producción, aquí harías una llamada API para verificar el token
                const urlParams = new URLSearchParams(window.location.search);
                const token = urlParams.get('token');
                
                // Si el token es nulo o una cadena vacía, se considera inválido para la simulación
                if (!token || token.length < 10) {
                    setTokenValid(false);
                    setError('El enlace de restablecimiento es inválido o ha expirado.');
                } else {
                    // Si el token parece válido, limpiar el error y permitir el formulario
                    setTokenValid(true);
                }
                setCheckingToken(false);
            }, 1000);
        };

        validateToken();
    }, []);

    // FIX 1: Tipificación de 'password' como string
    const passwordStrength = (password: string) => {
        if (!password) return { strength: 0, label: '', color: '' };
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        const labels = ['', 'Débil', 'Media', 'Buena', 'Fuerte'];
        const colors = ['', 'red', 'orange', 'yellow', 'emerald'];
        return { strength, label: labels[strength], color: colors[strength] };
    };

    const strength = passwordStrength(formData.password);

    // FIX 2: Tipificación de 'e' como React.MouseEvent<HTMLButtonElement>
    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    if (strength.strength < 2) {
      setError('La contraseña debe ser más segura (mínimo nivel medio)');
      setIsLoading(false);
      return;
    }

    // Simulación de llamada API
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 2000);
  };

  // Token inválido o expirado
  if (!checkingToken && !tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative w-full max-w-md">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl text-center">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>

            <h2 className="text-2xl font-bold mb-4">Enlace inválido o expirado</h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Este enlace de recuperación ya no es válido. Por favor, solicita uno nuevo.
            </p>

            <a
              href="/forgot-password"
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-2"
            >
              Solicitar nuevo enlace
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Cargando validación de token
  if (checkingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <Loader className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Validando enlace...</p>
        </div>
      </div>
    );
  }

  // Success State
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative w-full max-w-md">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl text-center animate-in zoom-in fade-in">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>

            <h2 className="text-2xl font-bold mb-4">¡Contraseña actualizada!</h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Tu contraseña ha sido cambiada correctamente. Ya puedes iniciar sesión con tu nueva contraseña.
            </p>

            <a
              href="/login"
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-2"
            >
              Ir al inicio de sesión
              <ArrowRight className="w-5 h-5" />
            </a>
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

      {/* Reset Password Card */}
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
          <h1 className="text-3xl font-bold mb-2">Nueva contraseña</h1>
          <p className="text-slate-400">Elige una contraseña segura para tu cuenta</p>
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

          {/* Form */}
          <div className="space-y-4">
            {/* New Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-slate-300">
                Nueva contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full pl-12 pr-12 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400">Seguridad de contraseña</span>
                    <span className={`text-xs font-medium text-${strength.color}-400`}>{strength.label}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r from-${strength.color}-500 to-${strength.color}-600 transition-all duration-300`}
                      style={{ width: `${(strength.strength / 4) * 100}%` }}
                    />
                  </div>
                  
                  {/* Password Requirements */}
                  <div className="mt-3 space-y-1 text-xs">
                    <div className={`flex items-center gap-2 ${formData.password.length >= 8 ? 'text-emerald-400' : 'text-slate-500'}`}>
                      <CheckCircle className="w-3 h-3" />
                      <span>Mínimo 8 caracteres</span>
                    </div>
                    <div className={`flex items-center gap-2 ${/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? 'text-emerald-400' : 'text-slate-500'}`}>
                      <CheckCircle className="w-3 h-3" />
                      <span>Mayúsculas y minúsculas</span>
                    </div>
                    <div className={`flex items-center gap-2 ${/[0-9]/.test(formData.password) ? 'text-emerald-400' : 'text-slate-500'}`}>
                      <CheckCircle className="w-3 h-3" />
                      <span>Al menos un número</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-slate-300">
                Confirmar nueva contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Repite tu contraseña"
                  className="w-full pl-12 pr-12 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <div className="mt-2 flex items-center gap-2 text-emerald-400 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Las contraseñas coinciden</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !formData.password || !formData.confirmPassword}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Actualizando contraseña...
                </>
              ) : (
                <>
                  Cambiar contraseña
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <a href="/login" className="text-sm text-slate-400 hover:text-slate-300 transition-colors">
            ← Volver al inicio de sesión
          </a>
        </div>
      </div>
    </div>
  );
};

export default SporvitResetPassword;