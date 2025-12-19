// app/dashboard/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Target, Bell, Globe, Download, Trash2, Save, 
  Loader2, AlertTriangle, Shield, Moon, Sun
} from 'lucide-react';



export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('goals');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [settings, setSettings] = useState({
    // Objetivos
    goalType: 'cut',
    targetWeight: 70,
    targetDate: '',
    weeklyWeightChange: -0.5,

    // Preferencias
    notifications: {
      email: true,
      push: true,
      workoutReminders: true,
      mealReminders: true,
      weeklyReport: true
    },
    units: {
      weight: 'kg',
      height: 'cm',
      distance: 'km'
    },
    theme: 'dark',
    language: 'es'
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      loadSettings();
    }
  }, [status]);

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/user/settings');
      const data = await res.json();
      setSettings(data.settings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section: string) => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data: settings })
      });
      
      if (res.ok) {
        alert('✅ Configuración guardada');
      } else {
        alert('❌ Error al guardar');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('❌ Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const res = await fetch('/api/user/export');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Sporvit-data-export.json';
      a.click();
      alert('✅ Datos exportados correctamente');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('❌ Error al exportar datos');
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    try {
      const res = await fetch('/api/user/account', {
        method: 'DELETE'
      });

      if (res.ok) {
        alert('✅ Cuenta eliminada. Redirigiendo...');
        router.push('/');
      } else {
        alert('❌ Error al eliminar cuenta');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('❌ Error al eliminar cuenta');
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
          <h1 className="text-3xl font-bold text-white mb-2">Configuración</h1>
          <p className="text-slate-400">Personaliza tu experiencia en Sporvit</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveSection('goals')}
            className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
              activeSection === 'goals'
                ? 'text-emerald-400 border-b-2 border-emerald-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Target className="w-4 h-4 inline mr-2" />
            Objetivos
          </button>
          <button
            onClick={() => setActiveSection('preferences')}
            className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
              activeSection === 'preferences'
                ? 'text-emerald-400 border-b-2 border-emerald-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4 inline mr-2" />
            Preferencias
          </button>
          <button
            onClick={() => setActiveSection('privacy')}
            className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
              activeSection === 'privacy'
                ? 'text-emerald-400 border-b-2 border-emerald-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4 inline mr-2" />
            Privacidad
          </button>
        </div>

        {/* Content */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          
          {/* Objetivos */}
          {activeSection === 'goals' && (
            <div className="space-y-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Objetivo Principal
                  </label>
                  <select
                    value={settings.goalType}
                    onChange={(e) => setSettings(prev => ({ ...prev, goalType: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  >
                    <option value="cut">Pérdida de Grasa</option>
                    <option value="bulk">Ganancia Muscular</option>
                    <option value="maintain">Mantenimiento</option>
                    <option value="recomp">Recomposición Corporal</option>
                    <option value="performance">Rendimiento Deportivo</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Peso Objetivo (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.targetWeight}
                      onChange={(e) => setSettings(prev => ({ ...prev, targetWeight: parseFloat(e.target.value) }))}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Fecha Objetivo
                    </label>
                    <input
                      type="date"
                      value={settings.targetDate}
                      onChange={(e) => setSettings(prev => ({ ...prev, targetDate: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Cambio de Peso Semanal (kg/semana)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={settings.weeklyWeightChange}
                    onChange={(e) => setSettings(prev => ({ ...prev, weeklyWeightChange: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Negativo para pérdida, positivo para ganancia. Recomendado: -0.3 a -0.8 kg/semana
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleSave('goals')}
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
                    Guardar Objetivos
                  </>
                )}
              </button>
            </div>
          )}

          {/* Preferencias */}
          {activeSection === 'preferences' && (
            <div className="space-y-8">
              {/* Notificaciones */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Notificaciones</h3>
                <div className="space-y-3">
                  {[
                    { key: 'email', label: 'Notificaciones por email' },
                    { key: 'push', label: 'Notificaciones push' },
                    { key: 'workoutReminders', label: 'Recordatorios de entrenamientos' },
                    { key: 'mealReminders', label: 'Recordatorios de comidas' },
                    { key: 'weeklyReport', label: 'Informe semanal de progreso' }
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors">
                      <span className="text-sm text-slate-300">{item.label}</span>
                      <input
                        type="checkbox"
                        checked={settings.notifications[item.key]}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            [item.key]: e.target.checked
                          }
                        }))}
                        className="w-5 h-5 text-emerald-500 bg-slate-900 border-slate-700 rounded focus:ring-emerald-500 focus:ring-offset-slate-950"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Unidades */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Unidades de Medida</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Peso</label>
                    <select
                      value={settings.units.weight}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        units: { ...prev.units, weight: e.target.value }
                      }))}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                    >
                      <option value="kg">Kilogramos (kg)</option>
                      <option value="lb">Libras (lb)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Altura</label>
                    <select
                      value={settings.units.height}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        units: { ...prev.units, height: e.target.value }
                      }))}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                    >
                      <option value="cm">Centímetros (cm)</option>
                      <option value="in">Pulgadas (in)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Distancia</label>
                    <select
                      value={settings.units.distance}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        units: { ...prev.units, distance: e.target.value }
                      }))}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                    >
                      <option value="km">Kilómetros (km)</option>
                      <option value="mi">Millas (mi)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Idioma */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Idioma</h3>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                </select>
              </div>

              <button
                onClick={() => handleSave('preferences')}
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
                    Guardar Preferencias
                  </>
                )}
              </button>
            </div>
          )}

          {/* Privacidad */}
          {activeSection === 'privacy' && (
            <div className="space-y-6">
              {/* Exportar Datos */}
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Download className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">Exportar tus datos</h3>
                    <p className="text-sm text-slate-400 mb-4">
                      Descarga toda tu información personal, entrenamientos, comidas y progreso en formato JSON.
                    </p>
                    <button
                      onClick={handleExportData}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Descargar Datos
                    </button>
                  </div>
                </div>
              </div>

              {/* Eliminar Cuenta */}
              <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">Eliminar mi cuenta</h3>
                    <p className="text-sm text-slate-400 mb-4">
                      Esta acción es <strong>permanente e irreversible</strong>. Se eliminarán todos tus datos, entrenamientos, comidas y progreso.
                    </p>
                    
                    {!showDeleteConfirm ? (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium rounded-lg transition-colors border border-red-500/30"
                      >
                        Eliminar Cuenta
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <div className="p-3 bg-red-500/10 rounded-lg">
                          <p className="text-sm text-red-400 font-medium">
                            ⚠️ ¿Estás seguro? Esta acción no se puede deshacer.
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={handleDeleteAccount}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                          >
                            Sí, Eliminar Definitivamente
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}