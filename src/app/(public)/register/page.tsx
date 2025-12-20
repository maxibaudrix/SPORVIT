// src/app/(public)/register/page.tsx
'use client';

import React, { useState } from 'react';
import { 
  Mail, Lock, Eye, EyeOff, Dumbbell, AlertCircle, 
  Loader, ArrowRight, Chrome, User, CheckCircle
} from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const SporvitRegister = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setIsLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
        setError('Debes aceptar los términos y condiciones.');
        setIsLoading(false);
        return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      setIsLoading(false);
      return;
    }

    try {
      // Llamar a la API de registro
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar usuario');
      }

      // Registro exitoso - hacer login automático
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error('Usuario creado pero error al iniciar sesión');
      }

      // Redirigir al onboarding
      router.push('/onboarding/welcome');
      
    } catch (err: any) {
        setError(err.message || 'Error al registrar usuario');
        setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      await signIn('google', {
        callbackUrl: '/onboarding/welcome',
      });
    } catch (err) {
      setError('Error al registrarse con Google');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-4 pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-md bg-slate-800/50 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-700/50">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            Únete a Sporvit
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Tu camino hacia un estilo de vida más saludable comienza aquí.
          </p>
        </div>

        {/* Google Sign Up */}
        <div className="mb-6">
          <button
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center py-3 px-4 border border-slate-700 rounded-xl shadow-sm text-sm font-medium text-white bg-slate-700 hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            <Chrome className="w-5 h-5 mr-3 text-red-500" />
            Continuar con Google
          </button>
          
          <div className="relative flex justify-center text-xs mt-6">
            <span className="px-2 bg-slate-800 text-slate-500">
              o usa tu email
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-xl relative mb-6" role="alert">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="block sm:inline">{error}</span>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2 text-slate-300">
              Nombre
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Tu Nombre"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border border-slate-700 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 bg-slate-900 text-white placeholder-slate-500 transition-colors outline-none"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-slate-300">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border border-slate-700 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 bg-slate-900 text-white placeholder-slate-500 transition-colors outline-none"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2 text-slate-300">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-3 border border-slate-700 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 bg-slate-900 text-white placeholder-slate-500 transition-colors outline-none"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formData.password && (
              <div className="mt-2 flex justify-between items-center text-xs">
                <span className={`font-semibold text-${strength.color}-500`}>
                  {strength.label}
                </span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 w-8 rounded-full ${i <= strength.strength ? `bg-${strength.color}-500` : 'bg-slate-700'}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-slate-300">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-3 border border-slate-700 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 bg-slate-900 text-white placeholder-slate-500 transition-colors outline-none"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formData.password && formData.confirmPassword && (
                <p className={`mt-2 text-xs font-medium flex items-center gap-1 ${formData.password === formData.confirmPassword ? 'text-emerald-400' : 'text-red-500'}`}>
                    {formData.password === formData.confirmPassword ? 
                        <>
                            <CheckCircle className="w-3 h-3"/>
                            Contraseñas coinciden
                        </>
                        : 
                        <>
                            <AlertCircle className="w-3 h-3"/>
                            Contraseñas no coinciden
                        </>
                    }
                </p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center">
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="h-4 w-4 text-emerald-500 border-slate-700 rounded focus:ring-emerald-500 bg-slate-900"
              disabled={isLoading}
            />
            <label htmlFor="acceptTerms" className="ml-3 block text-sm text-slate-400">
              Acepto los{' '}
              <a href="/legal/terms" className="font-medium text-emerald-400 hover:text-emerald-300">
                Términos y Condiciones
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"                 // <-- importante: evita submit nativo
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white mt-6"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Creando cuenta...
              </>
            ) : (
              <>
                Crear cuenta gratis
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-slate-400">
            ¿Ya tienes cuenta?{' '}
            <a href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Inicia sesión
            </a>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <a href="/" className="text-sm text-slate-400 hover:text-slate-300 transition-colors">
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
};

export default SporvitRegister;