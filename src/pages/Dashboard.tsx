import React, { useState, useEffect, useRef } from 'react';

import { motion } from 'motion/react';
import {
  Plus,
  Users,
  FileText,
  Download,
  UserPlus,
  CheckCircle2,
  MessageSquare,
  ChevronRight,
  X,
  Trash2,
  Check,
  Loader2,
  Camera,
  Pencil,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import {
  MetricOut,
  MetricCreate,
  getMetrics,
  createMetric,
  deleteMetric,
} from '@/src/services/metricService';
import { getPhotos, uploadPhoto, deletePhoto, PhotoOut } from '@/src/services/photoService';
import {
  getTestimonies,
  createTestimony,
  deleteTestimony,
  patchTestimonyDisplayName,
  TestimonyOut,
  CATEGORIES,
} from '@/src/services/testimonyService';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import NoProjectSelected from '../components/NoProjectSelected';

interface SubMetricFormField {
  title: string;
  value: string;
}

interface MetricFormState {
  title: string;
  subMetrics: SubMetricFormField[];
}

const EMPTY_FORM: MetricFormState = { title: '', subMetrics: [{ title: '', value: '' }] };

const recentActivity = [
  {
    icon: UserPlus,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    title: 'Nuevo voluntario registrado',
    description: 'Carlos Méndez se unió al proyecto "Alfabetización Digital".',
    time: 'HACE 2 HORAS',
  },
  {
    icon: CheckCircle2,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    title: 'Horas validadas',
    description: 'Se validaron 45 horas del equipo de Logística.',
    time: 'HACE 5 HORAS',
  },
  {
    icon: MessageSquare,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    title: 'Nuevo comentario de socio',
    description: 'Fundación Pro-Educación envió feedback del reporte.',
    time: 'AYER',
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { currentProject, loadingProjects } = useProject();
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [metrics, setMetrics] = useState<MetricOut[]>([]);
  const [photos, setPhotos] = useState<PhotoOut[]>([]);
  const [testimonies, setTestimonies] = useState<TestimonyOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMetricModal, setShowMetricModal] = useState(false);
  const [metricForm, setMetricForm] = useState<MetricFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showTestimonyModal, setShowTestimonyModal] = useState(false);
  const [testimonyDisplayName, setTestimonyDisplayName] = useState('');
  const [testimonyContent, setTestimonyContent] = useState('');
  const [testimonyCategory, setTestimonyCategory] = useState('');
  const [testimonyTags, setTestimonyTags] = useState<string[]>([]);
  const [testimonyTagInput, setTestimonyTagInput] = useState('');
  const [submittingTestimony, setSubmittingTestimony] = useState(false);
  const [testimonyError, setTestimonyError] = useState('');
  const [editingNameId, setEditingNameId] = useState<number | null>(null);
  const [editingNameValue, setEditingNameValue] = useState('');

  useEffect(() => {
    if (!currentProject || !user) return;
    setLoading(true);
    Promise.all([
      getMetrics(Number(currentProject.id)),
      getPhotos(Number(currentProject.id)),
      getTestimonies(Number(currentProject.id)),
    ])
      .then(([m, p, t]) => { setMetrics(m); setPhotos(p); setTestimonies(t); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentProject?.id]);

  const handlePhotoUpload = async (file: File) => {
    if (!currentProject) return;
    setUploadingPhoto(true);
    try {
      const photo = await uploadPhoto(Number(currentProject.id), file);
      setPhotos((prev) => [...prev, photo]);
    } catch (err: any) {
      alert(err?.response?.data?.detail ?? 'Error al subir la foto.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    if (!currentProject) return;
    try {
      await deletePhoto(Number(currentProject.id), photoId);
      setPhotos((prev) => prev.filter((p) => p.photo_id !== photoId));
    } catch (err) { console.error(err); }
  };

  const openNewMetricModal = () => {
    setMetricForm(EMPTY_FORM);
    setShowMetricModal(true);
  };

  const addSubMetricField = () => {
    setMetricForm({ ...metricForm, subMetrics: [...metricForm.subMetrics, { title: '', value: '' }] });
  };

  const removeSubMetricField = (index: number) => {
    setMetricForm({ ...metricForm, subMetrics: metricForm.subMetrics.filter((_, i) => i !== index) });
  };

  const handleSubMetricChange = (index: number, field: keyof SubMetricFormField, value: string) => {
    const updated = [...metricForm.subMetrics];
    updated[index][field] = value;
    setMetricForm({ ...metricForm, subMetrics: updated });
  };

  const handleSubirMetrica = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;
    setSaving(true);

    const data: MetricCreate = {
      metric_title: metricForm.title,
      sub_metrics: metricForm.subMetrics
        .filter((sm) => sm.title.trim() !== '')
        .map((sm) => ({
          sub_metric_title: sm.title,
          sub_metric_value: sm.value ? parseFloat(sm.value) : null,
        })),
    };

    try {
      const created = await createMetric(Number(currentProject.id), data);
      setMetrics([...metrics, created]);
      setShowMetricModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMetric = async (metricId: number) => {
    if (!currentProject) return;
    try {
      await deleteMetric(Number(currentProject.id), metricId);
      setMetrics(metrics.filter((m) => m.metric_id !== metricId));
    } catch (err) {
      console.error(err);
    }
  };

  const addTestimonyTag = () => {
    const tag = testimonyTagInput.trim();
    if (!tag || testimonyTags.includes(tag)) return;
    if (tag.length < 2 || tag.length > 30) {
      setTestimonyError('Cada etiqueta debe tener entre 2 y 30 caracteres.');
      return;
    }
    if (testimonyTags.length >= 10) {
      setTestimonyError('Máximo 10 etiquetas.');
      return;
    }
    setTestimonyTags([...testimonyTags, tag]);
    setTestimonyTagInput('');
    setTestimonyError('');
  };

  const resetTestimonyForm = () => {
    setTestimonyDisplayName('');
    setTestimonyContent('');
    setTestimonyCategory('');
    setTestimonyTags([]);
    setTestimonyTagInput('');
    setTestimonyError('');
  };

  const handleCreateTestimony = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;
    if (testimonyContent.trim().length < 50) {
      setTestimonyError('El testimonio debe tener al menos 50 caracteres.');
      return;
    }
    setSubmittingTestimony(true);
    try {
      const created = await createTestimony(Number(currentProject.id), {
        content: testimonyContent.trim(),
        category: testimonyCategory || undefined,
        tags: testimonyTags,
        display_name: testimonyDisplayName.trim() || undefined,
      });
      setTestimonies([created, ...testimonies]);
      setShowTestimonyModal(false);
      resetTestimonyForm();
    } catch (err: any) {
      setTestimonyError(err?.response?.data?.detail ?? 'Error al guardar el testimonio.');
    } finally {
      setSubmittingTestimony(false);
    }
  };

  const handleDeleteTestimony = async (testimonyId: number) => {
    if (!currentProject) return;
    try {
      await deleteTestimony(Number(currentProject.id), testimonyId);
      setTestimonies(testimonies.filter((t) => t.testimony_id !== testimonyId));
    } catch (err) {
      console.error(err);
    }
  };

  const startEditingName = (t: TestimonyOut) => {
    setEditingNameId(t.testimony_id);
    setEditingNameValue(t.display_name ?? t.author_username);
  };

  const saveDisplayName = async (testimonyId: number) => {
    if (!currentProject) return;
    const trimmed = editingNameValue.trim() || null;
    try {
      const updated = await patchTestimonyDisplayName(Number(currentProject.id), testimonyId, trimmed);
      setTestimonies(testimonies.map((t) => t.testimony_id === testimonyId ? updated : t));
    } catch (err) {
      console.error(err);
    } finally {
      setEditingNameId(null);
    }
  };

  if (loadingProjects) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!currentProject) return <NoProjectSelected />;

  return (
    <div className="flex flex-col min-h-screen bg-surface p-6 md:p-12 max-w-screen-2xl mx-auto w-full gap-12">
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

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.metric_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/10 hover:shadow-md transition-all relative group"
            >
              <div className="flex justify-between items-start mb-6">
                <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">
                  {metric.metric_title}
                </h4>
                <button
                  onClick={() => handleDeleteMetric(metric.metric_id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-outline hover:text-error transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {metric.sub_metrics.map((sm) => (
                  <div
                    key={sm.sub_metric_id}
                    className="flex justify-between items-baseline border-b border-outline-variant/5 pb-2"
                  >
                    <span className="text-xs font-semibold text-outline tracking-tight">{sm.sub_metric_title}</span>
                    <span className="text-2xl font-black text-primary tracking-tighter">
                      {sm.sub_metric_value !== null ? sm.sub_metric_value.toString() : '—'}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Photos section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary tracking-tight">Fotos del Proyecto</h2>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-outline font-bold uppercase tracking-widest">{photos.length}/10</span>
            {photos.length < 10 && (
              <button
                onClick={() => photoInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary/20 transition-colors disabled:opacity-50"
              >
                {uploadingPhoto ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                Subir foto
              </button>
            )}
            <input ref={photoInputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f); e.target.value = ''; }} />
          </div>
        </div>
        {photos.length === 0 ? (
          <button onClick={() => photoInputRef.current?.click()} className="w-full py-12 border-2 border-dashed border-outline-variant/20 rounded-2xl flex flex-col items-center gap-3 text-outline hover:border-primary/30 hover:text-primary transition-all">
            <Camera className="w-8 h-8 opacity-40" />
            <span className="text-xs font-bold uppercase tracking-widest">Sube hasta 10 fotos del proyecto (JPG/PNG, máx. 5 MB)</span>
          </button>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {photos.map((photo) => (
              <div key={photo.photo_id} className="relative aspect-square rounded-xl overflow-hidden group">
                <img src={photo.url} alt={photo.caption ?? ''} className="w-full h-full object-cover" />
                <button onClick={() => handleDeletePhoto(photo.photo_id)} className="absolute top-1 right-1 p-1 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Testimonies section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary tracking-tight">Testimonios del Proyecto</h2>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-outline font-bold uppercase tracking-widest">{testimonies.length} testimonio{testimonies.length !== 1 ? 's' : ''}</span>
            <button
              onClick={() => { resetTestimonyForm(); setShowTestimonyModal(true); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary/20 transition-colors"
            >
              <Plus className="w-4 h-4" /> Nuevo Testimonio
            </button>
          </div>
        </div>

        {testimonies.length === 0 ? (
          <button
            onClick={() => { resetTestimonyForm(); setShowTestimonyModal(true); }}
            className="w-full py-12 border-2 border-dashed border-outline-variant/20 rounded-2xl flex flex-col items-center gap-3 text-outline hover:border-primary/30 hover:text-primary transition-all"
          >
            <MessageSquare className="w-8 h-8 opacity-40" />
            <span className="text-xs font-bold uppercase tracking-widest">Documenta experiencias, logros y aprendizajes del equipo</span>
          </button>
        ) : (
          <div className="space-y-4">
            {testimonies.map((t) => {
              const displayName = t.display_name ?? t.author_username;
              const initials = displayName.slice(0, 2).toUpperCase();
              const canEdit = user?.is_admin || user?.username === t.author_username;
              const isEditingName = editingNameId === t.testimony_id;

              return (
                <motion.div
                  key={t.testimony_id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative bg-white rounded-2xl border border-outline-variant/10 shadow-sm group overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary/50 transition-colors" />

                  <div className="p-6 pl-8">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-extrabold text-primary">{initials}</span>
                        </div>
                        <div>
                          {isEditingName ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                autoFocus
                                value={editingNameValue}
                                onChange={(e) => setEditingNameValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveDisplayName(t.testimony_id);
                                  if (e.key === 'Escape') setEditingNameId(null);
                                }}
                                className="text-sm font-bold text-primary bg-surface-container-lowest border border-primary/30 rounded-lg px-2 py-0.5 outline-none focus:ring-2 focus:ring-primary/30 w-44"
                              />
                              <button onClick={() => saveDisplayName(t.testimony_id)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => setEditingNameId(null)} className="p-1 text-outline hover:bg-surface-container-low rounded-lg transition-colors">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-bold text-primary">{displayName}</p>
                              {canEdit && (
                                <button
                                  onClick={() => startEditingName(t)}
                                  className="opacity-0 group-hover:opacity-100 p-1 text-outline hover:text-primary transition-all rounded-lg hover:bg-surface-container-low"
                                >
                                  <Pencil className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          )}
                          <p className="text-[10px] text-outline mt-0.5">{new Date(t.created_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {t.category && (
                          <span className="text-[9px] font-bold uppercase tracking-widest bg-primary/5 text-primary px-3 py-1 rounded-full border border-primary/10">{t.category}</span>
                        )}
                        {canEdit && (
                          <button
                            onClick={() => handleDeleteTestimony(t.testimony_id)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-outline hover:text-error transition-all rounded-lg hover:bg-error/5"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-4 italic">"{t.content}"</p>

                    {t.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {t.tags.map((tag) => (
                          <span key={tag} className="text-[9px] font-bold px-2.5 py-1 bg-surface-container-low text-outline rounded-full">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <h2 className="text-2xl font-bold text-primary tracking-tight">Reportes de Impacto</h2>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container-low p-6 rounded-2xl flex items-center gap-6 border border-outline-variant/10 hover:bg-surface-container-high transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-primary">Reporte de Beneficiarios</h4>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold opacity-60">
                  Última actualización: Hace 2 días
                </p>
              </div>
            </div>
            <div className="bg-surface-container-low p-6 rounded-2xl flex items-center gap-6 border border-outline-variant/10 hover:bg-surface-container-high transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-primary">Bitácoras de Servicio</h4>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold opacity-60">
                  15 archivos pendientes de firma
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <h2 className="text-2xl font-bold text-primary tracking-tight">Actividad Reciente</h2>

          <div className="bg-white rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">
            <div className="divide-y divide-outline-variant/10">
              {recentActivity.map((activity, i) => (
                <div
                  key={i}
                  className="p-6 flex gap-4 hover:bg-surface-container-low transition-colors group cursor-pointer"
                >
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', activity.iconBg)}>
                    <activity.icon className={cn('w-5 h-5', activity.iconColor)} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-primary group-hover:text-primary-container transition-colors">
                      {activity.title}
                    </h4>
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

      {showTestimonyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTestimonyModal(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-[32px] shadow-2xl p-10 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setShowTestimonyModal(false)}
              className="absolute top-6 right-6 p-2 text-outline hover:text-primary transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-extrabold text-primary tracking-tighter">Nuevo Testimonio</h2>
                <p className="text-on-surface-variant font-light text-sm mt-2 font-body">
                  Comparte tu experiencia subjetiva del proyecto en tus propias palabras.
                </p>
              </div>

              <form onSubmit={handleCreateTestimony} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Nombre del autor</label>
                  <input
                    type="text"
                    value={testimonyDisplayName}
                    onChange={(e) => setTestimonyDisplayName(e.target.value)}
                    placeholder={user?.username ?? 'Nombre visible en el testimonio'}
                    maxLength={255}
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Tu testimonio</label>
                    <span className={cn('text-[10px] font-bold', testimonyContent.trim().length < 50 ? 'text-error' : 'text-emerald-600')}>
                      {testimonyContent.trim().length} / 50 mín · {5000 - testimonyContent.length} restantes
                    </span>
                  </div>
                  <textarea
                    required
                    rows={6}
                    value={testimonyContent}
                    onChange={(e) => setTestimonyContent(e.target.value)}
                    maxLength={5000}
                    placeholder="Describe tu experiencia, logros, retos o aprendizajes en este proyecto..."
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary outline-none resize-none leading-relaxed transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Categoría</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setTestimonyCategory(testimonyCategory === cat ? '' : cat)}
                        className={cn(
                          'px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border',
                          testimonyCategory === cat
                            ? 'bg-primary text-white border-primary'
                            : 'bg-surface-container-low text-on-surface-variant border-transparent hover:border-outline-variant/30',
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Etiquetas ({testimonyTags.length}/10)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={testimonyTagInput}
                      onChange={(e) => setTestimonyTagInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTestimonyTag(); } }}
                      placeholder="Escribe y presiona Enter o +"
                      maxLength={30}
                      disabled={testimonyTags.length >= 10}
                      className="flex-grow bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary outline-none disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={addTestimonyTag}
                      disabled={testimonyTags.length >= 10}
                      className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors disabled:opacity-40"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {testimonyTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {testimonyTags.map((tag) => (
                        <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                          {tag}
                          <button type="button" onClick={() => setTestimonyTags(testimonyTags.filter((t) => t !== tag))}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {testimonyError && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-error font-medium">
                    {testimonyError}
                  </motion.p>
                )}

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowTestimonyModal(false)}
                    className="flex-grow py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-low rounded-2xl transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submittingTestimony || testimonyContent.trim().length < 50}
                    className="flex-grow py-4 bg-primary text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {submittingTestimony ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Enviar Testimonio
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

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
                <p className="text-on-surface-variant font-light text-sm mt-2 font-body">
                  Define los indicadores y valores que deseas monitorear.
                </p>
              </div>

              <form onSubmit={handleSubirMetrica} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">
                    Título de la Métrica
                  </label>
                  <input
                    required
                    type="text"
                    value={metricForm.title}
                    onChange={(e) => setMetricForm({ ...metricForm, title: e.target.value })}
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="Ej: Alcance en Comunidades"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest">
                      Submétricas / Indicadores
                    </label>
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
                          onChange={(e) => handleSubMetricChange(idx, 'title', e.target.value)}
                          className="flex-grow bg-surface-container-low border-none rounded-xl p-3 text-xs focus:ring-1 focus:ring-primary outline-none"
                        />
                        <input
                          placeholder="Valor (Ej: 450 o 15.5)"
                          value={sm.value}
                          onChange={(e) => handleSubMetricChange(idx, 'value', e.target.value)}
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
                    disabled={saving}
                    className="flex-grow py-4 bg-primary text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
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
