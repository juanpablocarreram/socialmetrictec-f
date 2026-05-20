import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutGrid, 
  BookOpen, 
  BarChart3, 
  Image as ImageIcon, 
  HeartHandshake, 
  PlusCircle, 
  Edit3, 
  CloudUpload, 
  Trash2, 
  ChevronRight, 
  Eye, 
  Check, 
  Palette, 
  Type, 
  GripVertical, 
  Sparkles, 
  Layers,
  Settings,
  X
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Sortable Item Component ---
interface SortableNavItemProps {
  id: string;
  name: string;
  icon: any;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
  key?: string | number;
}

function SortableNavItem({ id, name, icon: Icon, isActive, onClick, onDelete }: SortableNavItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 px-3 py-3 rounded-xl transition-all duration-200 group relative",
        isActive 
          ? "bg-primary-container/10 text-primary font-bold shadow-sm" 
          : "text-on-surface-variant hover:bg-surface-container-low",
        isDragging && "opacity-50 shadow-2xl scale-105 bg-white"
      )}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 -ml-1 opacity-0 group-hover:opacity-40 hover:opacity-100 transition-opacity">
        <GripVertical className="w-4 h-4" />
      </div>
      <button onClick={onClick} className="flex-grow flex items-center gap-3 text-left min-w-0">
        <Icon className={cn(
          "w-5 h-5 shrink-0",
          isActive ? "text-primary" : "text-outline group-hover:text-on-surface"
        )} />
        <span className="text-sm truncate">{name}</span>
      </button>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="p-1.5 rounded-lg text-outline opacity-0 group-hover:opacity-100 hover:text-error hover:bg-error/10 transition-all shrink-0"
        title="Eliminar bloque"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
      {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-l-full" />}
    </div>
  );
}

// --- Main Editor Component ---
interface Block {
  id: string;
  name: string;
  icon: any;
  type: string;
  data?: any;
}

interface PageConfig {
  blocks: Block[];
  metadata: {
    name: string;
    description: string;
    image: string;
    isActive: boolean;
    strategicArea: string;
  };
  styles: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
}

export default function Editor() {
  const [activeBlock, setActiveBlock] = useState('hero');
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);
  
  // Unified Page Config (Source of Truth)
  const [config, setConfig] = useState<PageConfig>({
    blocks: [
      { id: 'hero', name: 'Hero', icon: LayoutGrid, type: 'hero' },
      { id: 'narrative', name: 'Narrativa', icon: BookOpen, type: 'narrative' },
      { id: 'metrics', name: 'Métricas', icon: BarChart3, type: 'metrics' },
      { id: 'gallery', name: 'Galería', icon: ImageIcon, type: 'gallery' },
      { id: 'volunteer', name: 'Voluntariado', icon: HeartHandshake, type: 'volunteer' },
    ],
    metadata: {
      name: 'Reforestación Urbana Monterrey',
      description: 'Restaurando el pulmón de la ciudad a través del compromiso ciudadano.',
      image: 'https://picsum.photos/seed/forest/800/600',
      isActive: true,
      strategicArea: 'Medio Ambiente'
    },
    styles: {
      primaryColor: '#002068',
      secondaryColor: '#525d85',
      fontFamily: 'Manrope'
    }
  });

  const { blocks, metadata } = config;
  const { primaryColor, secondaryColor, fontFamily } = config.styles;

  const setMetadata = (newMetadata: Partial<PageConfig['metadata']>) => {
    setConfig({
      ...config,
      metadata: { ...config.metadata, ...newMetadata }
    });
  };

  // DND Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((i) => i.id === active.id);
      const newIndex = blocks.findIndex((i) => i.id === over.id);
      setConfig({
        ...config,
        blocks: arrayMove(blocks, oldIndex, newIndex)
      });
    }
  };

  const addBlock = (type: string, name: string, icon: any) => {
    const newId = `${type}-${Date.now()}`;
    setConfig({
      ...config,
      blocks: [...blocks, { id: newId, name, icon, type }]
    });
    setActiveBlock(newId);
  };

  const deleteBlock = (id: string) => {
    const newBlocks = blocks.filter(b => b.id !== id);
    setConfig({
      ...config,
      blocks: newBlocks
    });
    if (activeBlock === id) {
      setActiveBlock(newBlocks[0]?.id || 'colors');
    }
  };

  const setStyles = (newStyles: Partial<PageConfig['styles']>) => {
    setConfig({
      ...config,
      styles: { ...config.styles, ...newStyles }
    });
  };

  const fonts = [
    { name: 'Manrope', class: 'font-headline' },
    { name: 'Inter', class: 'font-body' },
    { name: 'Space Grotesk', class: 'font-sans' },
    { name: 'Playfair Display', class: 'font-serif' },
  ];

  const colorPresets = [
    '#002068', '#003399', '#4f1100', '#191c1e', '#ba1a1a', '#059669', '#7c3aed', '#db2777'
  ];

  const templates = [
    { type: 'hero', name: 'Hero Moderno', icon: LayoutGrid, desc: 'Imagen de fondo con texto centrado' },
    { type: 'narrative', name: 'Historia de Impacto', icon: BookOpen, desc: 'Bloque de texto narrativo con cita' },
    { type: 'metrics', name: 'Panel de Datos', icon: BarChart3, desc: 'Contadores estadísticos animados' },
    { type: 'gallery', name: 'Mosaico Visual', icon: ImageIcon, desc: 'Cuadrícula de imágenes de proyectos' },
    { type: 'volunteer', name: 'Call to Action', icon: HeartHandshake, desc: 'Formulario de registro rápido' },
  ];

  return (
    <div className="flex h-[calc(100vh-73px)] overflow-hidden bg-surface">
      {/* SideNavBar */}
      <aside className="w-64 bg-surface-container-lowest border-r border-outline-variant/10 flex flex-col py-8 px-4 gap-4 shrink-0">
        <div className="mb-2 px-2">
          <h1 className="font-bold text-primary text-xl tracking-tighter">Editor de Bloques</h1>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1 font-bold opacity-60">Impacto Social</p>
        </div>
        
        {/* Reorderable Blocks */}
        <div className="flex-grow overflow-y-auto custom-scrollbar pr-1">
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={blocks.map(b => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-1">
                {blocks.map((item) => (
                  <SortableNavItem 
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    icon={item.icon}
                    isActive={activeBlock === item.id}
                    onClick={() => setActiveBlock(item.id)}
                    onDelete={() => deleteBlock(item.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Static Action Buttons */}
        <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-outline-variant/10">
          {/* Create New Block Button */}
          <button
            onClick={() => setActiveBlock('create-block')}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
              activeBlock === 'create-block'
                ? "bg-secondary text-white shadow-lg scale-[1.02]"
                : "bg-secondary/10 text-secondary hover:bg-secondary/20"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <Sparkles className={cn(
              "w-5 h-5 shrink-0 transition-transform group-hover:rotate-12",
              activeBlock === 'create-block' ? "text-white" : "text-secondary"
            )} />
            <span className="text-sm font-bold">Crear nuevo bloque</span>
            {activeBlock === 'create-block' && <ChevronRight className="w-4 h-4 ml-auto text-white/50" />}
          </button>

          {/* Palette Button */}
          <button
            onClick={() => setActiveBlock('colors')}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
              activeBlock === 'colors'
                ? "bg-primary text-white shadow-lg scale-[1.02]"
                : "bg-primary/10 text-primary hover:bg-primary/20"
            )}
          >
            <Palette className={cn(
              "w-5 h-5 shrink-0 transition-transform group-hover:scale-110",
              activeBlock === 'colors' ? "text-white" : "text-primary"
            )} />
            <span className="text-sm font-bold">Paleta de Colores</span>
            {activeBlock === 'colors' && <ChevronRight className="w-4 h-4 ml-auto text-white/50" />}
          </button>

          {/* General Settings Button */}
          <button
            onClick={() => setActiveBlock('settings')}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
              activeBlock === 'settings'
                ? "bg-primary text-white shadow-lg scale-[1.02]"
                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
            )}
          >
            <Settings className={cn(
              "w-5 h-5 shrink-0 transition-transform group-hover:rotate-45",
              activeBlock === 'settings' ? "text-white" : "text-outline"
            )} />
            <span className="text-sm font-bold">Configuración Proyecto</span>
            {activeBlock === 'settings' && <ChevronRight className="w-4 h-4 ml-auto text-white/50" />}
          </button>

          {/* User Profile */}
          <div className="mt-4 flex items-center gap-3 px-2 py-2 bg-surface-container-low rounded-2xl border border-outline-variant/5">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary text-sm font-bold shadow-inner">L</div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate text-primary">Líder de Proyecto</p>
              <p className="text-[10px] text-on-surface-variant truncate font-medium">Sede Monterrey</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-grow overflow-y-auto bg-surface-container-low/30 relative">
        {/* Top Control Bar */}
        <div className="sticky top-0 bg-surface/80 backdrop-blur-md px-12 py-4 flex justify-between items-center z-30 border-b border-outline-variant/5">
          <div className="flex flex-col">
            <h2 className="text-[10px] font-bold text-outline uppercase tracking-[0.2em]">Vista Previa Editor</h2>
            <p className="text-[9px] text-primary font-medium">Cambios en tiempo real</p>
          </div>
          <div className="flex gap-4 items-center">
            <button className="bg-primary text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg hover:brightness-110 transition-all flex items-center gap-2">
              <Check className="w-4 h-4" /> Publicar Cambios
            </button>
          </div>
        </div>

        <div className="w-full flex flex-col min-h-full">
          {activeBlock === 'settings' ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-16 shadow-2xl border border-outline-variant/10 space-y-12"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-primary">
                    <Settings className="w-10 h-10" />
                    <h2 className="text-4xl font-extrabold tracking-tighter">Configuración del Proyecto</h2>
                  </div>
                  <p className="text-on-surface-variant font-light text-lg italic max-w-2xl">
                    Define la identidad fundamental de tu iniciativa social. Estos datos aparecerán en los listados generales y buscadores.
                  </p>
                </div>
                <div className={cn(
                  "px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2",
                  metadata.isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-error/5 text-error border border-error/20"
                )}>
                  <div className={cn("w-2 h-2 rounded-full", metadata.isActive ? "bg-emerald-500 animate-pulse" : "bg-error")} />
                  {metadata.isActive ? "Activo" : "Inactivo"}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pt-8">
                <div className="space-y-12">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest flex items-center gap-2">
                       Area de Impacto
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {['Educación', 'Salud', 'Medio Ambiente', 'Cultura', 'Desarrollo Social'].map((area) => (
                        <button
                          key={area}
                          onClick={() => setMetadata({ strategicArea: area })}
                          className={cn(
                            "px-6 py-3 rounded-xl text-sm font-bold transition-all border",
                            metadata.strategicArea === area
                              ? "bg-primary text-white border-primary shadow-lg scale-105"
                              : "bg-surface-container-low text-on-surface-variant border-transparent hover:border-outline-variant"
                          )}
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Resumen del Proyecto</label>
                    <div className="p-8 bg-surface-container-low rounded-3xl border border-outline-variant/10 min-h-[160px] flex items-center justify-center text-center">
                      <p className="text-xl text-on-surface-variant font-light leading-relaxed italic">
                        "{metadata.description}"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Card de Presentación</label>
                    <div className="group relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] border-4 border-white">
                      <img 
                        src={metadata.image} 
                        alt="Preview" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                        <span className="text-[10px] text-white/60 font-bold uppercase tracking-[0.2em] mb-2">{metadata.strategicArea}</span>
                        <h3 className="text-3xl font-extrabold text-white tracking-tighter">{metadata.name}</h3>
                      </div>
                      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-[10px] font-bold uppercase tracking-widest">
                        Vista previa de Card
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeBlock === 'colors' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-16 shadow-2xl border border-outline-variant/10 space-y-16"
            >
              <div className="space-y-4">
                <h2 className="text-4xl font-extrabold text-primary tracking-tighter">Vista Previa de Estilo</h2>
                <p className="text-on-surface-variant font-light">Así se verán los elementos principales de tu plataforma con la configuración actual.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Tipografía Seleccionada</span>
                    <div className="p-8 bg-surface-container-low rounded-2xl border border-outline-variant/5">
                      <h3 className="text-3xl font-bold mb-2" style={{ fontFamily }}>{fontFamily} Headline</h3>
                      <p className="text-on-surface-variant leading-relaxed" style={{ fontFamily }}>
                        El impacto social es el motor de nuestra excelencia académica y compromiso institucional.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Botones y Acciones</span>
                    <div className="flex flex-wrap gap-4">
                      <button className="px-6 py-3 rounded-lg font-bold text-white shadow-lg" style={{ backgroundColor: primaryColor }}>
                        Botón Primario
                      </button>
                      <button className="px-6 py-3 rounded-lg font-bold text-white shadow-lg" style={{ backgroundColor: secondaryColor }}>
                        Botón Secundario
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Jerarquía Visual</span>
                    <div className="space-y-4">
                      <div className="h-4 w-3/4 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                      <div className="h-4 w-1/2 rounded-full opacity-60" style={{ backgroundColor: primaryColor }}></div>
                      <div className="h-4 w-2/3 rounded-full" style={{ backgroundColor: secondaryColor }}></div>
                    </div>
                  </div>

                  <div className="p-8 rounded-2xl border-2 border-dashed border-outline-variant/20 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Palette className="w-8 h-8 mx-auto text-outline opacity-40" />
                      <p className="text-xs font-bold text-outline uppercase tracking-widest">Muestra de Contraste</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeBlock === 'create-block' ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-16 shadow-2xl border border-outline-variant/10 space-y-12"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-secondary">
                  <Layers className="w-8 h-8" />
                  <h2 className="text-4xl font-extrabold tracking-tighter">Crear Nuevo Widget</h2>
                </div>
                <p className="text-on-surface-variant font-light text-lg">Selecciona una plantilla para añadir un nuevo bloque funcional a tu página.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.map((tpl) => (
                  <div key={tpl.type} className="group relative">
                    <button
                      onClick={() => addBlock(tpl.type, tpl.name, tpl.icon)}
                      className="w-full p-8 rounded-2xl border-2 border-outline-variant/10 hover:border-secondary hover:bg-secondary/5 transition-all text-left flex gap-6 items-start"
                    >
                      <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform shrink-0">
                        <tpl.icon className="w-7 h-7" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-bold text-primary group-hover:text-secondary transition-colors">{tpl.name}</h4>
                        <p className="text-xs text-on-surface-variant leading-relaxed">{tpl.desc}</p>
                      </div>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewTemplate(tpl);
                      }}
                      className="absolute top-4 right-4 p-2 rounded-full bg-surface-container-high text-outline opacity-0 group-hover:opacity-100 hover:text-secondary hover:bg-secondary/10 transition-all shadow-sm"
                      title="Vista previa"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-outline-variant/10 flex justify-center">
                <p className="text-[10px] text-outline font-bold uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-3 h-3" /> Más plantillas próximamente
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="w-full flex flex-col">
              {/* WYSIWYG Canvas Rendering */}
              {blocks.map((block) => (
                <div 
                  key={block.id} 
                  onClick={() => setActiveBlock(block.id)}
                  className={cn(
                    "relative group cursor-pointer transition-all duration-300",
                    activeBlock === block.id ? "ring-4 ring-primary z-10 shadow-2xl scale-[1.01]" : "hover:ring-2 hover:ring-primary/40"
                  )}
                >
                  {/* Edit Overlay */}
                  <div className={cn(
                    "absolute top-4 left-4 z-20 bg-primary/90 backdrop-blur-md text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-2 transition-opacity",
                    activeBlock === block.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}>
                    <Edit3 className="w-3 h-3" /> Editando {block.name}
                  </div>

                  {block.type === 'hero' && (
                    <section className="relative h-[80vh] w-full bg-slate-900 overflow-hidden">
                      <img 
                        alt="hero" 
                        className="absolute inset-0 w-full h-full object-cover opacity-60" 
                        src="https://picsum.photos/seed/hero-final/1920/1080"
                        referrerPolicy="no-referrer"
                      />
                      <div className="relative h-full flex flex-col justify-center items-center text-center p-16 bg-gradient-to-b from-transparent via-primary/20 to-primary/80">
                        <h1 className="text-6xl md:text-8xl font-extrabold text-white leading-tight max-w-5xl mb-8 tracking-tighter" style={{ fontFamily }}>
                          Redefiniendo el Legado Institucional
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 max-w-3xl font-light leading-relaxed" style={{ fontFamily }}>
                          Transformamos datos de impacto social en narrativas académicas de alto valor para el futuro.
                        </p>
                        <button className="mt-12 px-10 py-4 rounded-full text-white font-bold uppercase tracking-widest shadow-2xl transition-transform hover:scale-105" style={{ backgroundColor: primaryColor, fontFamily }}>
                          Explorar Iniciativas
                        </button>
                      </div>
                    </section>
                  )}

                  {block.type === 'metrics' && (
                    <section className="py-24 bg-surface-container-lowest transition-colors">
                      <div className="max-w-6xl mx-auto px-8 text-center">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                          {[
                            { label: 'Proyectos Activos', value: '450+' },
                            { label: 'Beneficiarios', value: '12k' },
                            { label: 'Tasa de Éxito', value: '98%' },
                          ].map((stat, i) => (
                            <div key={i} className="flex flex-col gap-4">
                              <span className="text-7xl font-extrabold tracking-tighter" style={{ color: primaryColor, fontFamily }}>{stat.value}</span>
                              <span className="text-xs text-on-surface-variant uppercase tracking-[0.3em] font-bold opacity-60">{stat.label}</span>
                              <div className="h-1 w-12 bg-outline-variant/20 mx-auto rounded-full" style={{ backgroundColor: secondaryColor + '40' }}></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  )}

                  {block.type === 'narrative' && (
                    <section className="py-32 bg-white flex justify-center">
                      <div className="max-w-4xl mx-auto px-8 flex flex-col items-center text-center gap-12">
                        <div className="w-20 h-1 bg-primary/20 rounded-full" style={{ backgroundColor: secondaryColor + '40' }}></div>
                        <h3 className="text-5xl font-bold text-primary tracking-tight" style={{ fontFamily }}>Nuestra Misión Curatorial</h3>
                        <p className="text-on-surface-variant leading-relaxed text-2xl font-light" style={{ fontFamily }}>
                          La curaduría académica no solo recopila información; destila la esencia del impacto social para asegurar que cada iniciativa sea medida por su valor humano y trascendencia institucional.
                        </p>
                        <div className="p-12 bg-surface-container-low rounded-[40px] border border-outline-variant/10 relative overflow-hidden">
                          <div className="absolute -top-6 left-12 text-[120px] text-primary/10 font-serif pointer-events-none">"</div>
                          <p className="text-xl italic text-on-surface-variant leading-relaxed relative z-10">
                            El compromiso con la sociedad es el pilar que sostiene nuestra excelencia académica. Cada dato cuenta una historia de transformación.
                          </p>
                        </div>
                      </div>
                    </section>
                  )}

                  {['gallery', 'volunteer'].includes(block.type) && (
                    <section className="py-24 border-y border-outline-variant/5 flex flex-col items-center justify-center min-h-[400px] bg-surface-container-low/20">
                      <block.icon className="w-24 h-24 text-primary opacity-10 mb-8" />
                      <h2 className="text-3xl font-bold text-primary opacity-40 uppercase tracking-widest">{block.name}</h2>
                      <p className="text-outline mt-4">Bloque en fase de desarrollo para la visualización final.</p>
                    </section>
                  )}
                </div>
              ))}

              {/* Final Footer Preview */}
              <footer className="py-20 bg-primary text-white text-center">
                <div className="max-w-4xl mx-auto px-8 space-y-8">
                  <h2 className="text-3xl font-bold tracking-tighter">SocialMetricTec</h2>
                  <p className="text-white/60 font-light max-w-md mx-auto">
                    Plataforma de curaduría de impacto social para la excelencia académica.
                  </p>
                </div>
              </footer>

              {/* Add Block Button (Canvas Bottom) */}
              <div className="max-w-4xl mx-auto w-full py-20 px-8">
                <button 
                  onClick={() => setActiveBlock('create-block')}
                  className="w-full py-16 border-4 border-dashed border-outline-variant/20 rounded-[40px] flex flex-col items-center justify-center gap-6 text-outline hover:text-secondary hover:border-secondary hover:bg-secondary/5 transition-all group shadow-inner"
                >
                  <PlusCircle className="w-16 h-16 transition-transform group-hover:rotate-90 duration-500" />
                  <div className="text-center">
                    <span className="text-sm font-bold uppercase tracking-[0.4em] block mb-2">Añadir Nuevo Bloque</span>
                    <p className="text-xs opacity-60">Personaliza tu narrativa de impacto</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Editor Settings Panel */}
      <aside className="w-80 bg-surface-container-high border-l border-outline-variant/10 flex flex-col shrink-0 shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
        <div className="p-6 border-b border-outline-variant/10 bg-surface-container-highest">
          <div className="flex items-center gap-2 mb-1">
            {activeBlock === 'colors' ? <Palette className="w-4 h-4 text-primary" /> : 
             activeBlock === 'create-block' ? <Layers className="w-4 h-4 text-secondary" /> :
             activeBlock === 'settings' ? <Settings className="w-4 h-4 text-primary" /> :
             <Edit3 className="w-4 h-4 text-primary" />}
            <h3 className="font-bold text-primary text-xs uppercase tracking-widest">
              {activeBlock === 'colors' ? 'Estilo Global' : 
               activeBlock === 'create-block' ? 'Gestor de Widgets' :
               activeBlock === 'settings' ? 'Configuración' :
               'Propiedades del Bloque'}
            </h3>
          </div>
          <p className="text-[10px] text-on-surface-variant font-bold opacity-60">
            {activeBlock === 'colors' ? 'Configuración Visual' : 
             activeBlock === 'create-block' ? 'Añadir nuevo contenido' :
             activeBlock === 'settings' ? 'Global y Metadata' :
             'Configuración de Bloque'}
          </p>
        </div>

        <div className="p-6 overflow-y-auto flex flex-col gap-8 flex-grow">
          {activeBlock === 'settings' ? (
            <div className="space-y-8">
              {/* Settings Fields */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Nombre del Proyecto</label>
                <input 
                  type="text" 
                  value={metadata.name}
                  onChange={(e) => setMetadata({ name: e.target.value })}
                  className="w-full bg-surface-container-lowest border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary transition-all text-primary font-bold shadow-sm"
                  placeholder="Ej: Reforestación Urbana"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Descripción Corta</label>
                <textarea 
                  rows={4}
                  value={metadata.description}
                  onChange={(e) => setMetadata({ description: e.target.value })}
                  className="w-full bg-surface-container-lowest border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary transition-all text-on-surface-variant leading-relaxed shadow-sm resize-none"
                  placeholder="Describe la misión principal..."
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">URL Imagen Portada</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={metadata.image}
                    onChange={(e) => setMetadata({ image: e.target.value })}
                    className="flex-grow bg-surface-container-lowest border-none rounded-xl p-4 text-[10px] focus:ring-2 focus:ring-primary transition-all text-outline font-mono shadow-sm"
                  />
                  <button className="p-4 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors">
                    <CloudUpload className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Estatus de Visibilidad</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setMetadata({ isActive: true })}
                    className={cn(
                      "py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                      metadata.isActive ? "bg-emerald-500 text-white shadow-lg" : "bg-surface-container-lowest text-outline"
                    )}
                  >
                    Activo
                  </button>
                  <button
                    onClick={() => setMetadata({ isActive: false })}
                    className={cn(
                      "py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                      !metadata.isActive ? "bg-error text-white shadow-lg" : "bg-surface-container-lowest text-outline"
                    )}
                  >
                    Inactivo
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Área Estratégica</label>
                <select
                  value={metadata.strategicArea}
                  onChange={(e) => setMetadata({ strategicArea: e.target.value })}
                  className="w-full bg-surface-container-lowest border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary outline-none text-primary font-bold shadow-sm appearance-none"
                >
                  {['Educación', 'Salud', 'Medio Ambiente', 'Cultura', 'Desarrollo Social'].map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : activeBlock === 'colors' ? (
            <>
              {/* Color Selection */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Color Primario</label>
                  <div className="flex flex-wrap gap-2">
                    {colorPresets.map((color) => (
                      <button 
                        key={color}
                        onClick={() => setStyles({ primaryColor: color })}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 transition-all",
                          primaryColor === color ? "border-primary scale-110 shadow-md" : "border-transparent"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <input 
                    type="color" 
                    value={primaryColor}
                    onChange={(e) => setStyles({ primaryColor: e.target.value })}
                    className="w-full h-10 rounded-lg cursor-pointer bg-surface-container-lowest p-1"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Color Secundario</label>
                  <div className="flex flex-wrap gap-2">
                    {colorPresets.map((color) => (
                      <button 
                        key={color}
                        onClick={() => setStyles({ secondaryColor: color })}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 transition-all",
                          secondaryColor === color ? "border-primary scale-110 shadow-md" : "border-transparent"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <input 
                    type="color" 
                    value={secondaryColor}
                    onChange={(e) => setStyles({ secondaryColor: e.target.value })}
                    className="w-full h-10 rounded-lg cursor-pointer bg-surface-container-lowest p-1"
                  />
                </div>
              </div>

              {/* Font Selection */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Type className="w-4 h-4 text-outline" />
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Familia de Texto</label>
                </div>
                <div className="flex flex-col gap-2">
                  {fonts.map((font) => (
                    <button
                      key={font.name}
                      onClick={() => setStyles({ fontFamily: font.name })}
                      className={cn(
                        "w-full p-4 rounded-xl text-left transition-all border",
                        fontFamily === font.name 
                          ? "bg-primary-container/10 border-primary text-primary font-bold" 
                          : "bg-surface-container-lowest border-transparent hover:bg-surface-container-low"
                      )}
                      style={{ fontFamily: font.name }}
                    >
                      {font.name}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : activeBlock === 'create-block' ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                <PlusCircle className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-primary">Listo para expandir</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Selecciona una plantilla en el lienzo central para añadirla a tu estructura.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Field: Title */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Título del Bloque</label>
                <input 
                  type="text" 
                  defaultValue={blocks.find(b => b.id === activeBlock)?.name || ""}
                  className="w-full bg-surface-container-lowest border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary transition-all text-primary font-bold shadow-sm"
                />
              </div>

              {/* Field: Image Upload */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Imagen / Icono</label>
                <div className="relative group aspect-video rounded-xl overflow-hidden bg-surface-container shadow-inner border border-outline-variant/10">
                  <img 
                    alt="thumbnail" 
                    className="w-full h-full object-cover" 
                    src="https://picsum.photos/seed/block-thumb/400/225"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2 text-white">
                      <CloudUpload className="w-6 h-6" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Cargar Nueva</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Field: Block Text */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Contenido</label>
                <textarea 
                  rows={5}
                  defaultValue="Personaliza el contenido de este bloque para reflejar el impacto social de tu iniciativa."
                  className="w-full bg-surface-container-lowest border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary transition-all text-on-surface-variant leading-relaxed shadow-sm resize-none"
                />
              </div>
            </>
          )}
        </div>

        <div className="p-6 bg-surface-container-highest border-t border-outline-variant/10 flex flex-col gap-3">
          <button className={cn(
            "w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg active:scale-95",
            activeBlock === 'create-block' ? "bg-secondary text-white" : "bg-primary text-white"
          )}>
            {activeBlock === 'colors' ? 'Guardar Estilo' : 
             activeBlock === 'create-block' ? 'Explorar Más' :
             activeBlock === 'settings' ? 'Guardar Configuración' :
             'Actualizar Bloque'}
          </button>
          {(!['colors', 'create-block', 'settings'].includes(activeBlock)) && (
            <button 
              onClick={() => deleteBlock(activeBlock)}
              className="w-full bg-transparent text-error py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-error/5 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" /> Eliminar este Bloque
            </button>
          )}
        </div>
      </aside>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-3xl w-full max-w-4xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-lowest">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <previewTemplate.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-primary">Vista Previa: {previewTemplate.name}</h3>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest opacity-60">Maqueta de Bloque</p>
                </div>
              </div>
              <button 
                onClick={() => setPreviewTemplate(null)}
                className="p-2 rounded-full hover:bg-surface-container-high text-outline transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-12 bg-surface-container-low/30">
              <div className="max-w-2xl mx-auto">
                {previewTemplate.type === 'hero' && (
                  <div className="rounded-2xl overflow-hidden shadow-xl bg-slate-900 relative aspect-video">
                    <img 
                      src="https://picsum.photos/seed/preview-hero/1200/800" 
                      className="w-full h-full object-cover opacity-60"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end p-12 bg-gradient-to-t from-primary/80 to-transparent">
                      <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tighter">Título de Impacto</h1>
                      <p className="text-white/80 font-light">Descripción breve del proyecto y su trascendencia social.</p>
                    </div>
                  </div>
                )}
                {previewTemplate.type === 'metrics' && (
                  <div className="bg-white rounded-2xl p-12 shadow-xl border border-outline-variant/10 grid grid-cols-3 gap-8 text-center">
                    <div className="space-y-2">
                      <span className="text-4xl font-extrabold text-primary tracking-tighter">100+</span>
                      <p className="text-[10px] text-outline uppercase font-bold tracking-widest">Métrica A</p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-4xl font-extrabold text-primary tracking-tighter">5k</span>
                      <p className="text-[10px] text-outline uppercase font-bold tracking-widest">Métrica B</p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-4xl font-extrabold text-primary tracking-tighter">95%</span>
                      <p className="text-[10px] text-outline uppercase font-bold tracking-widest">Métrica C</p>
                    </div>
                  </div>
                )}
                {previewTemplate.type === 'narrative' && (
                  <div className="bg-white rounded-2xl p-12 shadow-xl border border-outline-variant/10 space-y-6">
                    <h3 className="text-2xl font-bold text-primary tracking-tight">Título Narrativo</h3>
                    <p className="text-on-surface-variant leading-relaxed font-light text-lg">
                      Este bloque permite contar la historia detrás del proyecto, destacando los valores y el compromiso de los participantes en la iniciativa social.
                    </p>
                    <div className="pl-6 border-l-4 border-primary/20 italic text-outline">
                      "Una cita inspiradora que resalte el valor humano del proyecto."
                    </div>
                  </div>
                )}
                {['gallery', 'volunteer'].includes(previewTemplate.type) && (
                  <div className="bg-white rounded-2xl p-12 shadow-xl border border-outline-variant/10 flex flex-col items-center justify-center gap-4 min-h-[300px]">
                    <previewTemplate.icon className="w-16 h-16 text-primary opacity-20" />
                    <p className="text-sm font-bold text-primary uppercase tracking-widest">Maqueta de {previewTemplate.name}</p>
                    <p className="text-xs text-outline text-center max-w-xs">Este bloque incluirá elementos interactivos específicos para {previewTemplate.name.toLowerCase()}.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-outline-variant/10 bg-surface-container-lowest flex justify-end gap-4">
              <button 
                onClick={() => setPreviewTemplate(null)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-outline hover:bg-surface-container-high transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  addBlock(previewTemplate.type, previewTemplate.name, previewTemplate.icon);
                  setPreviewTemplate(null);
                }}
                className="px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-secondary text-white shadow-lg hover:brightness-110 transition-all"
              >
                Añadir al Proyecto
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
