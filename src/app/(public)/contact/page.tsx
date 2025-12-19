'use client';

import React, { useState } from 'react';
import { 
  Mail, MessageSquare, Send, HelpCircle, ChevronDown, 
  ArrowLeft, CheckCircle, AlertCircle, Loader2, Star, User // Añadido User para completar los iconos
} from 'lucide-react';

// CORRECCIÓN: Definición del tipo de datos del formulario localmente
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// --- Componente FAQ Item ---
const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-slate-800 border-emerald-500/50' : 'bg-slate-900/30 border-slate-700 hover:border-slate-600'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
        type="button"
      >
        <span className={`font-medium transition-colors ${isOpen ? 'text-emerald-400' : 'text-slate-200'}`}>
          {question}
        </span>
        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
      </button>
      
      <div className={`px-5 text-slate-400 text-sm overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-60 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p>{answer}</p>
      </div>
    </div>
  );
};

// --- Componente Principal ---
export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Estado del formulario tipado
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: 'Soporte Técnico', // Default válido
    message: ''
  });

  // CORRECCIÓN: Tipado explícito de 'prev' (soluciona Error 7006)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: ContactFormData) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return; // Prevenir doble envío

    // Validación simple en el cliente
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setErrorMessage('Por favor, completa todos los campos obligatorios.');
      return;
    }

    setIsLoading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      // SIMULACIÓN DE ENVÍO API (reemplaza fetch('/api/contact/submit'))
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simula latencia de 2 segundos

      // Simulación de error si el email es 'error@test.com'
      if (formData.email.toLowerCase().includes('error')) {
        throw new Error('El servicio de envío está temporalmente inactivo. Inténtalo más tarde.');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: 'Soporte Técnico', message: '' }); // Reset

    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Ocurrió un error inesperado al enviar el mensaje.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-12">
      
      <main className="pt-10 px-4 container mx-auto max-w-6xl">
        
        <div className="text-center mb-12 mt-16 md:mt-24">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">Ayuda y Soporte</h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            ¿Tienes problemas con tu plan? Estamos aquí para ayudarte a optimizar tu experiencia en Sporvit.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* --- COLUMNA IZQUIERDA: INFO & SOCIAL PROOF --- */}
          <div className="space-y-6 lg:col-span-1 h-fit lg:sticky lg:top-24">
            
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <h3 className="text-lg font-bold mb-6 text-white border-b border-slate-800 pb-4">Métodos de contacto</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-300">Email Directo</p>
                    <a href="mailto:support@sporvit.com" className="text-white hover:text-emerald-400 transition-colors font-semibold">
                      support@sporvit.com
                    </a>
                    <p className="text-xs text-slate-500 mt-1">Respuesta &lt; 24h</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0 text-purple-400">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-300">Chat en Vivo</p>
                    <button className="text-white hover:text-emerald-400 transition-colors text-left font-semibold underline decoration-slate-700 underline-offset-4">
                      Iniciar conversación
                    </button>
                    <p className="text-xs text-slate-500 mt-1">Lun-Vie: 9:00 - 18:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700">
              <div className="flex items-center gap-1 text-yellow-400 mb-2">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <span className="text-white font-bold ml-2 text-sm">4.8/5</span>
              </div>
              <p className="text-sm text-slate-300 italic mb-3">
                "El equipo de soporte resolvió mi duda sobre la integración con Apple Health en minutos."
              </p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">- Carlos M., Usuario Pro</p>
            </div>
          </div>

          {/* --- COLUMNA DERECHA: FORMULARIO --- */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6">Envíanos un mensaje</h3>
              
              {status === 'success' ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">¡Mensaje enviado!</h4>
                  <p className="text-slate-400 mb-6">Hemos recibido tu consulta. Nuestro equipo te contactará a la brevedad.</p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="text-emerald-400 font-bold hover:text-emerald-300 text-sm"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-slate-300">Nombre</label>
                      <input 
                        type="text" 
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Tu nombre"
                        disabled={isLoading}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-600 disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-slate-300">Email</label>
                      <input 
                        type="email" 
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="tucorreo@ejemplo.com"
                        disabled={isLoading}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-600 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-slate-300">Asunto</label>
                    <div className="relative">
                      <select 
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all appearance-none cursor-pointer disabled:opacity-50"
                      >
                        <option value="Soporte Técnico">Soporte Técnico</option>
                        <option value="Duda Nutrición">Duda sobre Nutrición</option>
                        <option value="Facturación">Facturación y Pagos</option>
                        <option value="Otros">Otros</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-slate-300">Mensaje</label>
                    <textarea 
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      disabled={isLoading}
                      placeholder="Describe tu problema o duda con el mayor detalle posible..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none placeholder:text-slate-600 disabled:opacity-50"
                    ></textarea>
                  </div>

                  {status === 'error' && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      {errorMessage}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar Mensaje
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* --- FAQ SECTION --- */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 flex items-center justify-center gap-3 text-white">
            <HelpCircle className="w-8 h-8 text-slate-500" />
            Preguntas Frecuentes
          </h2>
          
          <div className="space-y-4">
            <FaqItem 
              question="¿Cómo cancelo mi suscripción Pro?" 
              answer="Puedes cancelar en cualquier momento desde Configuración > Suscripción. Mantendrás el acceso a las funciones Pro hasta el final del ciclo de facturación actual." 
            />
            <FaqItem 
              question="¿La IA tiene en cuenta mis alergias?" 
              answer="¡Absolutamente! Durante el onboarding registramos todas tus intolerancias y la IA las bloquea automáticamente en cualquier receta sugerida. Puedes actualizar esto en tu perfil." 
            />
            <FaqItem 
              question="¿Puedo exportar mis datos para un médico?" 
              answer="Sí, cumplimos con el GDPR. Puedes descargar un informe completo de tu nutrición y progreso en formato PDF o CSV desde la sección de Configuración." 
            />
            <FaqItem 
              question="¿Con qué apps se sincroniza Sporvit?" 
              answer="Actualmente nos integramos con Apple Health y Google Fit para leer tus pasos, calorías activas y peso automáticamente." 
            />
            <FaqItem
              question="¿Dónde encuentro mi historial de entrenamientos?"
              answer="Tu historial completo de sesiones de entrenamiento, incluyendo repeticiones, series y peso levantado, se encuentra en la pestaña 'Progreso' dentro de tu perfil de usuario."
            />
          </div>
        </div>

      </main>
    </div>
  );
}