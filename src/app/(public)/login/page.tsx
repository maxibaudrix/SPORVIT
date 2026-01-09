// src/app/(public)/login/page.tsx
'use client';

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Chrome, FileText } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { ErrorAlert } from '@/components/auth/ErrorAlert';

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planSlug = searchParams.get('plan');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email o contraseña incorrectos');
        setIsLoading(false);
        return;
      }

      const destination = planSlug
        ? `/dashboard?loadPlan=${planSlug}`
        : '/dashboard';

      router.push(destination);
    } catch (err) {
      setError('Error al iniciar sesión. Intenta de nuevo.');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const callbackUrl = planSlug
        ? `/dashboard?loadPlan=${planSlug}`
        : '/dashboard';

      await signIn('google', { callbackUrl });
    } catch (err) {
      setError('Error al iniciar sesión con Google');
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      subtitle="Inicia sesión para continuar tu progreso"
    >
      {/* Plan Selected Banner */}
      {planSlug && (
        <div className="mb-6 p-4 bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border border-emerald-500/30 rounded-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-emerald-400" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-white font-semibold mb-1 text-sm sm:text-base">
                Programa seleccionado
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Inicia sesión para cargar tu programa de entrenamiento en el calendario
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && <ErrorAlert message={error} />}

      {/* Google OAuth Button */}
      <div className="mb-6">
        <AuthButton
          variant="google"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          icon={<Chrome className="w-5 h-5" aria-hidden="true" />}
          ariaLabel="Iniciar sesión con Google"
        >
          Continuar con Google
        </AuthButton>
      </div>

      <AuthDivider text="o continúa con email" />

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <AuthInput
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={handleChange}
          icon={Mail}
          required
          disabled={isLoading}
          autoComplete="email"
        />

        <AuthInput
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          label="Contraseña"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          icon={Lock}
          required
          disabled={isLoading}
          autoComplete="current-password"
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-white transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
              disabled={isLoading}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Eye className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          }
        />

        {/* Remember & Forgot */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
          <label htmlFor="remember" className="flex items-center gap-2 cursor-pointer group">
            <input
              id="remember"
              type="checkbox"
              checked={formData.remember}
              onChange={handleChange}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/20 focus:ring-2 cursor-pointer"
              disabled={isLoading}
            />
            <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
              Recordarme
            </span>
          </label>
          <a
            href="/forgot-password"
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium focus:outline-none focus:underline"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <AuthButton
            type="submit"
            variant="primary"
            disabled={isLoading}
            isLoading={isLoading}
            ariaLabel="Iniciar sesión"
          >
            Iniciar sesión
          </AuthButton>
        </div>
      </form>

      {/* Register Link */}
      <div className="text-center mt-6 pt-6 border-t border-slate-700/50">
        <p className="text-sm text-slate-400">
          ¿No tienes cuenta?{' '}
          <a
            href={planSlug ? `/register?plan=${planSlug}` : '/register'}
            className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors focus:outline-none focus:underline"
          >
            Regístrate gratis
          </a>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
