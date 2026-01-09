// src/app/(public)/register/page.tsx
'use client';

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Chrome, User, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { ErrorAlert } from '@/components/auth/ErrorAlert';
import { PasswordStrength } from '@/components/auth/PasswordStrength';

const RegisterPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planSlug = searchParams.get('plan');

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validations
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

      // Auto login after registration
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error('Usuario creado pero error al iniciar sesión');
      }

      const destination = planSlug
        ? `/onboarding/welcome?plan=${planSlug}`
        : '/onboarding/welcome';

      router.push(destination);
    } catch (err: any) {
      setError(err.message || 'Error al registrar usuario');
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError('');

    try {
      const callbackUrl = planSlug
        ? `/onboarding/welcome?plan=${planSlug}`
        : '/onboarding/welcome';

      await signIn('google', { callbackUrl });
    } catch (err) {
      setError('Error al registrarse con Google');
      setIsLoading(false);
    }
  };

  const passwordsMatch = formData.password && formData.confirmPassword &&
    formData.password === formData.confirmPassword;
  const passwordsDontMatch = formData.password && formData.confirmPassword &&
    formData.password !== formData.confirmPassword;

  return (
    <AuthLayout
      title="Únete a Sporvit"
      subtitle="Tu camino hacia un estilo de vida más saludable comienza aquí"
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
                Regístrate para acceder a tu programa de entrenamiento personalizado
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && <ErrorAlert message={error} />}

      {/* Google Sign Up */}
      <div className="mb-6">
        <AuthButton
          variant="google"
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          icon={<Chrome className="w-5 h-5" aria-hidden="true" />}
          ariaLabel="Registrarse con Google"
        >
          Continuar con Google
        </AuthButton>
      </div>

      <AuthDivider text="o usa tu email" />

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <AuthInput
          id="name"
          name="name"
          type="text"
          label="Nombre"
          placeholder="Tu Nombre"
          value={formData.name}
          onChange={handleChange}
          icon={User}
          required
          disabled={isLoading}
          autoComplete="name"
        />

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
          autoComplete="new-password"
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
          helperText={<PasswordStrength password={formData.password} />}
        />

        <AuthInput
          id="confirmPassword"
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          label="Confirmar Contraseña"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          icon={Lock}
          required
          disabled={isLoading}
          autoComplete="new-password"
          rightElement={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-slate-400 hover:text-white transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
              disabled={isLoading}
              aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Eye className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          }
          helperText={
            passwordsMatch ? (
              <p className="mt-2 text-xs font-medium flex items-center gap-1 text-emerald-400 animate-in fade-in duration-200">
                <CheckCircle className="w-3 h-3" />
                Contraseñas coinciden
              </p>
            ) : passwordsDontMatch ? (
              <p className="mt-2 text-xs font-medium flex items-center gap-1 text-red-400 animate-in fade-in duration-200">
                <AlertCircle className="w-3 h-3" />
                Contraseñas no coinciden
              </p>
            ) : null
          }
        />

        {/* Terms Checkbox */}
        <div className="flex items-start gap-3 pt-2">
          <input
            id="acceptTerms"
            name="acceptTerms"
            type="checkbox"
            checked={formData.acceptTerms}
            onChange={handleChange}
            className="mt-1 w-4 h-4 text-emerald-500 border-slate-700 rounded focus:ring-emerald-500/20 focus:ring-2 bg-slate-900 cursor-pointer"
            disabled={isLoading}
            required
          />
          <label htmlFor="acceptTerms" className="text-sm text-slate-400 cursor-pointer">
            Acepto los{' '}
            <a
              href="/legal/terms"
              className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors focus:outline-none focus:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Términos y Condiciones
            </a>
            {' '}y la{' '}
            <a
              href="/legal/privacy"
              className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors focus:outline-none focus:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Política de Privacidad
            </a>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <AuthButton
            type="submit"
            variant="primary"
            disabled={isLoading}
            isLoading={isLoading}
            ariaLabel="Crear cuenta"
          >
            Crear cuenta gratis
          </AuthButton>
        </div>
      </form>

      {/* Login Link */}
      <div className="text-center mt-6 pt-6 border-t border-slate-700/50">
        <p className="text-sm text-slate-400">
          ¿Ya tienes cuenta?{' '}
          <a
            href={planSlug ? `/login?plan=${planSlug}` : '/login'}
            className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors focus:outline-none focus:underline"
          >
            Inicia sesión
          </a>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
