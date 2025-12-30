// src/app/login/page.tsx
'use client';

import React, { useState } from 'react';
import {
    Mail, Lock, Eye, EyeOff, Dumbbell, AlertCircle, 
    Loader, ArrowRight, Chrome, FileText
} from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

const SporvitLogin = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // 🆕 Capturar el parámetro plan de la URL
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

            // 🆕 Login exitoso - redirigir con o sin plan
            if (planSlug) {
                router.push(`/dashboard?loadPlan=${planSlug}`);
            } else {
                router.push('/dashboard');
            }
        } catch (err) {
            setError('Error al iniciar sesión. Intenta de nuevo.');
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError('');
        
        try {
            // 🆕 Si hay plan, pasarlo en el callbackUrl
            const callbackUrl = planSlug 
                ? `/dashboard?loadPlan=${planSlug}`
                : '/dashboard';
            
            await signIn('google', {
                callbackUrl,
            });
        } catch (err) {
            setError('Error al iniciar sesión con Google');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Login Card Container */}
            <div className="relative w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-4">                     
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Bienvenido de nuevo</h1>
                    <p className="text-slate-400">Inicia sesión para continuar tu progreso</p>
                </div>

                {/* 🆕 Banner de plan seleccionado */}
                {planSlug && (
                    <div className="mb-6 p-4 bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border border-emerald-500/30 rounded-xl animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-1">Programa seleccionado</h3>
                                <p className="text-sm text-slate-300">
                                    Inicia sesión para cargar tu programa de entrenamiento en el calendario
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Card */}
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
                    
                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Google OAuth Button */}
                    <div className="mb-6">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 text-gray-900 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Chrome className="w-5 h-5" />
                            Continuar con Google
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-slate-900 text-slate-400">o continúa con email</span>
                        </div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2 text-slate-300">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="tu@email.com"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-2 text-slate-300">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between pt-1">
                            <label htmlFor="remember" className="flex items-center gap-2 cursor-pointer">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={formData.remember}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/20"
                                    disabled={isLoading}
                                />
                                <span className="text-sm text-slate-400">Recordarme</span>
                            </label>
                            <a href="/forgot-password" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white"
                        >
                            {isLoading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Iniciando sesión...
                                </>
                            ) : (
                                <>
                                    Iniciar sesión
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Register Link */}
                <div className="text-center mt-6">
                    <p className="text-slate-400">
                        ¿No tienes cuenta?{' '}
                        <a 
                            href={planSlug ? `/register?plan=${planSlug}` : '/register'} 
                            className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                        >
                            Regístrate gratis
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

export default SporvitLogin;