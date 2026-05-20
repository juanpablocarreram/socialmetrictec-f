import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  CloudUpload, 
  ChevronLeft, 
  GraduationCap, 
  Stethoscope, 
  Leaf, 
  LayoutGrid, 
  HeartHandshake,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const STRATEGIC_AREAS = [
  { name: 'Educación', icon: GraduationCap, color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { name: 'Salud', icon: Stethoscope, color: 'bg-rose-50 text-rose-600 border-rose-100' },
  { name: 'Medio Ambiente', icon: Leaf, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { name: 'Cultura', icon: LayoutGrid, color: 'bg-amber-50 text-amber-600 border-amber-100' },
  { name: 'Desarrollo Social', icon: HeartHandshake, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' }
];

export default function CreateProject() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    area: 'Educación',
    image: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would save the project here
    console.log('Project created:', formData);
    navigate('/directory');
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest pb-20">
      {/* Header */}
      <div className="bg-white border-b border-outline-variant/10 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-outline hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-xl font-bold text-primary tracking-tighter">Nueva Iniciativa</span>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 mt-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] p-8 md:p-12 shadow-2xl border border-outline-variant/10 overflow-hidden relative"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />

          <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
            {/* Project Header Config */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Nombre del Proyecto
                  </label>
                  <input 
                    required
                    type="text" 
                    placeholder="Escribe el nombre de tu proyecto..."
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full text-4xl font-extrabold tracking-tighter text-primary placeholder:text-outline-variant/30 border-none bg-transparent focus:ring-0 p-0"
                  />
                  <div className="h-0.5 w-20 bg-primary/20 rounded-full" />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Descripción</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="¿Cuál es la misión principal de esta iniciativa? Describe el impacto esperado..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-surface-container-low border-none rounded-2xl p-6 text-sm focus:ring-2 focus:ring-primary transition-all outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Imagen de Presentación</label>
                <div className="group relative aspect-[4/3] rounded-[24px] overflow-hidden bg-surface-container-low border-2 border-dashed border-outline-variant/30 flex items-center justify-center transition-all hover:border-primary/50">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-center px-6">
                      <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <CloudUpload className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Click para subir foto</p>
                        <p className="text-[10px] text-outline font-medium">Recomendado: 1200x800px</p>
                      </div>
                    </div>
                  )}
                  <input 
                    type="text"
                    placeholder="O pega una URL de imagen..."
                    className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md border-none rounded-xl py-2 px-4 text-[10px] focus:ring-2 focus:ring-primary outline-none shadow-lg text-outline font-medium"
                    value={formData.image}
                    onChange={e => setFormData({...formData, image: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Strategic Area Selection */}
            <div className="space-y-6">
              <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Selecciona el Área de Impacto</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {STRATEGIC_AREAS.map((area) => (
                  <button
                    key={area.name}
                    type="button"
                    onClick={() => setFormData({...formData, area: area.name})}
                    className={cn(
                      "flex flex-col items-center gap-3 p-6 rounded-2xl transition-all border group relative overflow-hidden",
                      formData.area === area.name 
                        ? "bg-primary text-white border-primary shadow-xl scale-[1.02]" 
                        : "bg-white text-on-surface-variant border-outline-variant/20 hover:border-primary/50 hover:bg-surface-container-lowest"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-inner",
                      formData.area === area.name ? "bg-white/20" : area.color
                    )}>
                      <area.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-center">{area.name}</span>
                    
                    {formData.area === area.name && (
                      <motion.div 
                        layoutId="active-area"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-white"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-8 flex flex-col md:flex-row gap-4 items-center justify-between border-t border-outline-variant/10">
              <div className="flex items-center gap-3 text-outline">
                <div className="w-10 h-10 rounded-full border border-outline-variant/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 opacity-50" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em]">Paso finalización</p>
                  <p className="text-[10px] text-outline-variant">Toda la configuración puede ser editada después.</p>
                </div>
              </div>

              <div className="flex gap-4 w-full md:w-auto">
                <button 
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-grow md:flex-none px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-low transition-all rounded-2xl"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-grow md:flex-none px-12 py-4 bg-primary text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-2xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                >
                  Lanzar Proyecto
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
