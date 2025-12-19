// app/dashboard/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Camera, Save, Loader2, User, Activity, Calendar, Ruler, Scale } from 'lucide-react';


export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    avatar: null,
    age: 0,
    gender: '',
    height: 0,
    weight: 0,
    bodyFat: 0,
    activityLevel: '',
    phone: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      loadProfile();
    }
  }, [status]);

  const loadProfile = async () => {
    try {
      const res = await fetch('/api/user/profile');
      const data = await res.json();
      setProfile(data.profile);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section: string) => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data: profile })
      });
      
      if (res.ok) {
        alert('✅ Cambios guardados correctamente');
      } else {
        alert('❌ Error al guardar cambios');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('❌ Error al guardar cambios');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData
      });
      
      if (res.ok) {
        const data = await res.json();
        setProfile(prev => ({ ...prev, avatar: data.avatarUrl }));
        alert('✅ Foto actualizada');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mi Perfil</h1>
          <p className="text-slate-400">Gestiona tu información personal y biométrica</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-800">
          <button
            onClick={() => setActiveSection('personal')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeSection === 'personal'
                ? 'text-emerald-400 border-b-2 border-emerald-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Datos Personales
          </button>
          <button
            onClick={() => setActiveSection('photo')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeSection === 'photo'
                ? 'text-emerald-400 border-b-2 border-emerald-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4 inline mr-2" />
            Foto de Perfil
          </button>
          <button
            onClick={() => setActiveSection('biometrics')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeSection === 'biometrics'
                ? 'text-emerald-400 border-b-2 border-emerald-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4 inline mr-2" />
            Biometría
          </button>
        </div>

        {/* Content */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          
          {/* Datos Personales */}
          {activeSection === 'personal' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-500 mt-1">El email no se puede cambiar</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Teléfono (opcional)
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                    placeholder="+34 600 000 000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Género
                  </label>
                  <select
                    value={profile.gender}
                    onChange={(e) => setProfile(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  >
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => handleSave('personal')}
                disabled={saving}
                className="w-full md:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          )}

          {/* Foto de Perfil */}
          {activeSection === 'photo' && (
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-4xl font-bold text-white overflow-hidden">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 w-10 h-10 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="text-center">
                  <p className="text-sm text-slate-400">
                    Formatos aceptados: JPG, PNG, GIF (máx. 5MB)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Biometría */}
          {activeSection === 'biometrics' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Edad
                  </label>
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                    min="18"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Ruler className="w-4 h-4 inline mr-2" />
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    value={profile.height}
                    onChange={(e) => setProfile(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                    min="100"
                    max="250"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Scale className="w-4 h-4 inline mr-2" />
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={profile.weight}
                    onChange={(e) => setProfile(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                    min="30"
                    max="200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Activity className="w-4 h-4 inline mr-2" />
                    % Grasa Corporal (opcional)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={profile.bodyFat}
                    onChange={(e) => setProfile(prev => ({ ...prev, bodyFat: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                    min="5"
                    max="50"
                    placeholder="Ej: 18.5"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nivel de Actividad
                  </label>
                  <select
                    value={profile.activityLevel}
                    onChange={(e) => setProfile(prev => ({ ...prev, activityLevel: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  >
                    <option value="sedentary">Sedentario (poco o ningún ejercicio)</option>
                    <option value="light">Ligero (1-3 días/semana)</option>
                    <option value="moderate">Moderado (3-5 días/semana)</option>
                    <option value="active">Activo (6-7 días/semana)</option>
                  </select>
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <p className="text-sm text-emerald-400">
                  💡 <strong>Tip:</strong> Actualiza tu peso regularmente para que el sistema ajuste tus calorías y macros de forma precisa.
                </p>
              </div>

              <button
                onClick={() => handleSave('biometrics')}
                disabled={saving}
                className="w-full md:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
