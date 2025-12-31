'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Camera, Save, Loader2, User, Activity, Calendar, Ruler, Scale } from 'lucide-react';
import { AccountTabs } from '@/components/ui/layout/dashboard/AccountTabs';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  
  const [profile, setProfile] = useState({
    name: '', email: '', avatar: null, age: 0,
    gender: '', height: 0, weight: 0, bodyFat: 0,
    activityLevel: '', phone: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin');
    else if (status === 'authenticated') loadProfile();
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
      if (res.ok) alert('✅ Cambios guardados correctamente');
    } catch (error) {
      alert('❌ Error al guardar cambios');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        <AccountTabs />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mi Perfil</h1>
          <p className="text-slate-400">Gestiona tu información personal y biométrica</p>
        </div>

        {/* Tabs Internas de Sección */}
        <div className="flex gap-2 mb-6 border-b border-slate-800 overflow-x-auto">
          {[
            { id: 'personal', label: 'Datos Personales', icon: User },
            { id: 'photo', label: 'Foto de Perfil', icon: Camera },
            { id: 'biometrics', label: 'Biometría', icon: Activity }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
                activeSection === tab.id
                  ? 'text-emerald-400 border-b-2 border-emerald-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          {activeSection === 'personal' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Nombre completo</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <input type="email" value={profile.email} disabled className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-500 cursor-not-allowed" />
                </div>
              </div>
              <button onClick={() => handleSave('personal')} disabled={saving} className="btn-primary-sporvit flex items-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Guardar Cambios
              </button>
            </div>
          )}

          {activeSection === 'photo' && (
            <div className="py-8 flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-40 h-40 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-5xl font-bold text-white overflow-hidden shadow-2xl">
                  {profile.avatar ? <img src={profile.avatar} className="w-full h-full object-cover" /> : profile.name[0]}
                </div>
                <label className="absolute bottom-1 right-1 w-12 h-12 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-transform hover:scale-110">
                  <Camera className="w-6 h-6 text-white" />
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              </div>
            </div>
          )}

          {activeSection === 'biometrics' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <BiometricInput label="Edad" value={profile.age} icon={Calendar} onChange={(v) => setProfile(p => ({ ...p, age: v }))} />
                <BiometricInput label="Altura (cm)" value={profile.height} icon={Ruler} onChange={(v) => setProfile(p => ({ ...p, height: v }))} />
                <BiometricInput label="Peso (kg)" value={profile.weight} icon={Scale} step="0.1" onChange={(v) => setProfile(p => ({ ...p, weight: v }))} />
                <BiometricInput label="% Grasa" value={profile.bodyFat} icon={Activity} step="0.1" onChange={(v) => setProfile(p => ({ ...p, bodyFat: v }))} />
              </div>
              <button onClick={() => handleSave('biometrics')} disabled={saving} className="btn-primary-sporvit flex items-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Actualizar Biometría
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Subcomponente para limpiar el código
function BiometricInput({ label, value, icon: Icon, onChange, step = "1" }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        <Icon className="w-4 h-4 inline mr-2 text-emerald-500" />
        {label}
      </label>
      <input
        type="number" step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 outline-none"
      />
    </div>
  );
}