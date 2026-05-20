import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Users, 
  Clock, 
  Activity, 
  FileText, 
  Download, 
  UserPlus, 
  CheckCircle2, 
  MessageSquare,
  TrendingUp,
  ChevronRight,
  X,
  Trash2,
  Check
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

// Define structure for dynamic metrics
interface SubMetric {
  title: string;
  value: string;
}

interface Metric {
  id: string;
  title: string;
  subMetrics: SubMetric[];
}

const INITIAL_METRICS: Metric[] = [
  {
    id: '1',
    title: 'Voluntarios Académicos',
    subMetrics: [
      { title: 'Total Inscritos', value: '124' },
      { title: 'Nuevos este mes', value: '+12%' }
    ]
  },
  {
    id: '2',
    title: 'Horas de Impacto',
    subMetrics: [
      { title: 'Horas Validadas', value: '2,850' },
      { title: 'Meta Semestral', value: '5,000' }
    ]
  },
  {
    id: '3',
    title: 'Estado del Proyecto',
    subMetrics: [
      { title: 'Fase Actual', value: 'Ejecución' },
      { title: 'Progreso', value: '65%' }
    ]
  }
];

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metric[]>(INITIAL_METRICS);
  const [showMetricModal, setShowMetricModal] = useState(false);
  const [editingMetric, setEditingMetric] = useState<Metric | null>(null);

  // Form State for new/editing metric
  const [metricForm, setMetricForm] = useState<{title: string, subMetrics: SubMetric[]}>({
    title: '',
    subMetrics: [{ title: '', value: '' }]
  });

  const openNewMetricModal = () => {
    setMetricForm({ title: '', subMetrics: [{ title: '', value: '' }] });
    setEditingMetric(null);
    setShowMetricModal(true);
  };

  const addSubMetricField = () => {
    setMetricForm({
      ...metricForm,
      subMetrics: [...metricForm.subMetrics, { title: '', value: '' }]
    });
  };

  const removeSubMetricField = (index: number) => {
    setMetricForm({
      ...metricForm,
      subMetrics: metricForm.subMetrics.filter((_, i) => i !== index)
    });
  };

  const handleSubMetricChange = (index: number, field: keyof SubMetric, value: string) => {
    const updated = [...metricForm.subMetrics];
    updated[index][field] = value;
    setMetricForm({ ...metricForm, subMetrics: updated });
  };

  const handleSubirMetrica = (e: React.FormEvent) => {
    e.preventDefault();
    const newMetric: Metric = {
      id: editingMetric ? editingMetric.id : Date.now().toString(),
      title: metricForm.title,
      subMetrics: metricForm.subMetrics.filter(sm => sm.title.trim() !== '')
    };

    if (editingMetric) {
      setMetrics(metrics.map(m => m.id === editingMetric.id ? newMetric : m));
    } else {
      setMetrics([...metrics, newMetric]);
    }

    setShowMetricModal(false);
  };

  const handleDeleteMetric = (id: string) => {
    setMetrics(metrics.filter(m => m.id !== id));
  };

  const recentActivity = [
    {
      icon: UserPlus,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      title: 'Nuevo voluntario registrado',
      description: 'Carlos Méndez se unió al proyecto "Alfabetización Digital".',
      time: 'HACE 2 HORAS'
    },
    {
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      title: 'Horas validadas',
      description: 'Se validaron 45 horas del equipo de Logística.',
      time: 'HACE 5 HORAS'
    },
    {
      icon: MessageSquare,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      title: 'Nuevo comentario de socio',
      description: 'Fundación Pro-Educación envió feedback del reporte.',
      time: 'AYER'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface p-6 md:p-12 max-w-screen-2xl mx-auto w-full gap-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tighter font-headline">
            Dashboard de Impacto Social
          </h1>
          <p className="text-on-surface-variant font-body max-w-xl">
            Vista general del desempeño y alcance de las iniciativas de impacto social del semestre en curso.
          </p>
        </div>
        <button 
          onClick={openNewMetricModal}
          className="bg-primary text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:brightness-110 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" /> Nueva Metrica
        </button>
      </header>

      {/* Dynamic Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {metrics.map((metric, i) => (
          <motion.div 
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/10 hover:shadow-md transition-all relative group"
          >
            <div className="flex justify-between items-start mb-6">
              <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">{metric.title}</h4>
              <button 
                onClick={() => handleDeleteMetric(metric.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-outline hover:text-error transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {metric.subMetrics.map((sm, idx) => (
                <div key={idx} className="flex justify-between items-baseline border-b border-outline-variant/5 pb-2">
                  <span className="text-xs font-semibold text-outline tracking-tight">{sm.title}</span>
                  <span className="text-2xl font-black text-primary tracking-tighter">{sm.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Impact Reports */}
        <div className="lg:col-span-8 space-y-8">
          <h2 className="text-2xl font-bold text-primary tracking-tight">Reportes de Impacto</h2>
          
          {/* Executive Summary Card */}
          <div className="bg-primary rounded-2xl p-10 text-white relative overflow-hidden group">
            <div className="relative z-10 space-y-6 max-w-lg">
              <h3 className="text-3xl font-bold tracking-tight">Resumen de Métricas</h3>
              <p className="text-on-primary-container font-light leading-relaxed">
                Descarga todas las métricas y sus respectivas submétricas.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button className="bg-white text-primary px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-surface-container-low transition-colors">
                  <Download className="w-5 h-5" /> Descargar PDF
                </button>
              </div>
            </div>
            <FileText className="absolute bottom-[-20px] right-[-20px] w-64 h-64 text-white/10 group-hover:scale-110 transition-transform duration-700" />
          </div>

          {/* Smaller Report Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container-low p-6 rounded-2xl flex items-center gap-6 border border-outline-variant/10 hover:bg-surface-container-high transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-primary">Reporte de Beneficiarios</h4>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold opacity-60">Última actualización: Hace 2 días</p>
              </div>
            </div>
            <div className="bg-surface-container-low p-6 rounded-2xl flex items-center gap-6 border border-outline-variant/10 hover:bg-surface-container-high transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-primary">Bitácoras de Servicio</h4>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold opacity-60">15 archivos pendientes de firma</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity & Quote */}
        <div className="lg:col-span-4 space-y-8">
          <h2 className="text-2xl font-bold text-primary tracking-tight">Actividad Reciente</h2>
          
          <div className="bg-white rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">
            <div className="divide-y divide-outline-variant/10">
              {recentActivity.map((activity, i) => (
                <div key={i} className="p-6 flex gap-4 hover:bg-surface-container-low transition-colors group cursor-pointer">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", activity.iconBg)}>
                    <activity.icon className={cn("w-5 h-5", activity.iconColor)} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-primary group-hover:text-primary-container transition-colors">{activity.title}</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{activity.description}</p>
                    <p className="text-[10px] font-bold text-outline uppercase tracking-widest pt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-4 bg-surface-container-low text-primary font-bold text-xs uppercase tracking-widest hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2">
              Ver todo el historial <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quote Card */}
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
            <img 
              src="https://picsum.photos/seed/academic/600/450" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              alt="Academic Excellence"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-primary/60 backdrop-blur-[2px] p-8 flex flex-col justify-end">
              <p className="text-white text-lg font-bold leading-tight italic">
                "El impacto social es el corazón de nuestra excelencia académica."
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* New Metric Modal */}
      {showMetricModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMetricModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[32px] shadow-2xl p-10 overflow-hidden"
            >
              <button 
                onClick={() => setShowMetricModal(false)}
                className="absolute top-6 right-6 p-2 text-outline hover:text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-extrabold text-primary tracking-tighter">Configurar Métrica</h2>
                  <p className="text-on-surface-variant font-light text-sm mt-2 font-body">Define los indicadores y valores que deseas monitorear.</p>
                </div>

                <form onSubmit={handleSubirMetrica} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">Título de la Métrica</label>
                    <input 
                      required
                      type="text" 
                      value={metricForm.title}
                      onChange={e => setMetricForm({...metricForm, title: e.target.value})}
                      className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                      placeholder="Ej: Alcance en Comunidades"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Submétricas / Indicadores</label>
                      <button 
                        type="button"
                        onClick={addSubMetricField}
                        className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline"
                      >
                        <Plus className="w-3 h-3" /> Añadir Campo
                      </button>
                    </div>

                    <div className="space-y-3 max-h-48 overflow-y-auto px-1 custom-scrollbar">
                      {metricForm.subMetrics.map((sm, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input 
                            placeholder="Título (Ej: Niños atendidos)"
                            value={sm.title}
                            onChange={e => handleSubMetricChange(idx, 'title', e.target.value)}
                            className="flex-grow bg-surface-container-low border-none rounded-xl p-3 text-xs focus:ring-1 focus:ring-primary outline-none"
                          />
                          <input 
                            placeholder="Valor (Ej: 450 o 15%)"
                            value={sm.value}
                            onChange={e => handleSubMetricChange(idx, 'value', e.target.value)}
                            className="w-32 bg-surface-container-low border-none rounded-xl p-3 text-xs font-bold text-primary focus:ring-1 focus:ring-primary outline-none"
                          />
                          {metricForm.subMetrics.length > 1 && (
                            <button 
                              type="button"
                              onClick={() => removeSubMetricField(idx)}
                              className="p-2 text-outline-variant hover:text-error transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setShowMetricModal(false)}
                      className="flex-grow py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-low rounded-2xl transition-all"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      className="flex-grow py-4 bg-primary text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Subir Metrica
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
    </div>
  );
}
