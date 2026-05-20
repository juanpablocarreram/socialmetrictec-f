import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, ChevronDown, CheckCircle2, Clock } from 'lucide-react';
import { useState } from 'react';

export default function Directory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');

  const projects = [
    {
      title: 'BioHuertos: Regeneración Urbana',
      category: 'Sostenibilidad',
      description: 'Implementación de sistemas de agricultura vertical y captación de agua pluvial en zonas de alta densidad poblacional.',
      impact: 85,
      campus: 'Monterrey',
      year: 2024,
      status: 'Activo',
      image: 'https://picsum.photos/seed/garden/800/600'
    },
    {
      title: 'Alfabetización Digital 4.0',
      category: 'Educación',
      description: 'Plataforma de código abierto diseñada para facilitar el aprendizaje de programación básica en comunidades rurales.',
      impact: 62,
      campus: 'Santa Fe',
      year: 2023,
      status: 'Finalizado',
      image: 'https://picsum.photos/seed/tablet/800/600'
    },
    {
      title: 'Clínicas Móviles de Prevención',
      category: 'Salud',
      description: 'Unidades médicas equipadas con tecnología de telemedicina para diagnóstico temprano en regiones de difícil acceso.',
      impact: 94,
      campus: 'Guadalajara',
      year: 2024,
      status: 'Activo',
      image: 'https://picsum.photos/seed/clinic/800/600'
    },
    {
      title: 'Reintegración Proactiva',
      category: 'Justicia Social',
      description: 'Programa de capacitación técnica y acompañamiento legal para personas en proceso de reinserción social.',
      impact: 48,
      campus: 'Querétaro',
      year: 2024,
      status: 'Activo',
      image: 'https://picsum.photos/seed/center/800/600'
    },
    {
      title: 'Acuífero Inteligente',
      category: 'Sostenibilidad',
      description: 'Desarrollo de sensores IoT para el monitoreo en tiempo real de la calidad del agua en cuencas urbanas.',
      impact: 76,
      campus: 'Puebla',
      year: 2023,
      status: 'Finalizado',
      image: 'https://picsum.photos/seed/water/800/600'
    },
    {
      title: 'Mentoría Intergeneracional',
      category: 'Educación',
      description: 'Programa que vincula a profesionales jubilados con estudiantes de bachillerato para fortalecer la orientación vocacional.',
      impact: 54,
      campus: 'Toluca',
      year: 2024,
      status: 'Activo',
      image: 'https://picsum.photos/seed/hands/800/600'
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         project.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' ? project.status === 'Activo' : project.status === 'Finalizado');
    
    const matchesArea = areaFilter === 'all' || project.category === areaFilter;

    return matchesSearch && matchesStatus && matchesArea;
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Search Section */}
      <section className="bg-surface-container py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-screen-2xl mx-auto flex flex-col items-center text-center">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-body text-xs uppercase tracking-[0.3em] text-primary mb-4 font-bold"
          >
            Repositorio de Impacto Social
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-primary mb-12 tracking-tighter leading-tight max-w-4xl"
          >
            Descubre el Legado de la Transformación Colectiva.
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-3xl relative group"
          >
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className="w-6 h-6 text-outline group-focus-within:text-primary transition-colors" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, palabra clave o disciplina..." 
              className="w-full pl-16 pr-8 py-6 bg-surface-container-lowest border-none shadow-sm rounded-2xl font-body text-lg focus:ring-2 focus:ring-primary transition-all outline-none"
            />
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-surface py-8 px-6 md:px-12 border-b border-outline-variant/15 sticky top-[73px] z-40 glass-header">
        <div className="max-w-screen-2xl mx-auto flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full border border-outline-variant/10">
              <Filter className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary">Filtrar por:</span>
            </div>
            
            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-surface-container-high border-none rounded-lg py-2 pl-4 pr-10 text-sm font-semibold text-secondary focus:ring-primary cursor-pointer hover:bg-surface-container-highest transition-colors outline-none appearance-none"
              >
                <option value="all">Estado de Actividad</option>
                <option value="active">Activos</option>
                <option value="inactive">Finalizados</option>
              </select>
              <ChevronDown className="w-4 h-4 text-secondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                className="bg-surface-container-high border-none rounded-lg py-2 pl-4 pr-10 text-sm font-semibold text-secondary focus:ring-primary cursor-pointer hover:bg-surface-container-highest transition-colors outline-none appearance-none"
              >
                <option value="all">Área de Impacto</option>
                {Array.from(new Set(projects.map(p => p.category))).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-secondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          
          <div className="text-on-surface-variant text-sm font-medium">
            Mostrando <span className="font-bold text-primary">{filteredProjects.length}</span> proyectos
          </div>
        </div>
      </section>

      {/* Project Grid */}
      <section className="px-6 md:px-12 py-16 max-w-screen-2xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProjects.map((project, idx) => (
            <Link 
              key={idx}
              to="/project/1"
              className="flex flex-col bg-surface-container-lowest group cursor-pointer tonal-card rounded-2xl p-2"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx % 3) * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col h-full"
              >
                <div className="relative aspect-video overflow-hidden rounded-xl mb-6">
                  <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    src={project.image} 
                    alt={project.title}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-primary-container text-on-primary px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      {project.category}
                    </span>
                    <span className={cn(
                      "px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm",
                      project.status === 'Activo' ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                    )}>
                      {project.status === 'Activo' ? <Clock className="w-2.5 h-2.5" /> : <CheckCircle2 className="w-2.5 h-2.5" />}
                      {project.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col flex-grow px-4 pb-4">
                  <h3 className="text-xl font-bold text-primary mb-3 leading-snug group-hover:text-primary-container transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant line-clamp-3 mb-6 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="mt-auto">
                    <div className="pt-4 flex justify-end items-center text-[10px] font-bold text-outline uppercase tracking-wider border-t border-outline-variant/10">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {project.year}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
        
        {filteredProjects.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-on-surface-variant text-lg">No se encontraron proyectos que coincidan con tu búsqueda.</p>
          </div>
        )}
        
        {filteredProjects.length > 0 && (
          <div className="mt-16 flex justify-center">
            <button className="flex items-center gap-3 px-8 py-4 bg-surface-container-high text-primary font-bold rounded-lg hover:bg-surface-container-highest transition-colors group">
              Cargar más proyectos
              <ChevronDown className="w-5 h-5 transition-transform group-hover:translate-y-1" />
            </button>
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="bg-surface-container-low py-24 px-6 md:px-12 border-t border-outline-variant/10">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center md:text-left">
          {[
            { label: 'Beneficiarios Directos', value: '1,240' },
            { label: 'Campus Participantes', value: '35' },
            { label: 'Horas de Voluntariado', value: '2.4M' },
            { label: 'Índice de Sostenibilidad', value: '89%' },
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <div className="text-4xl md:text-5xl font-extrabold text-primary tracking-tighter">{stat.value}</div>
              <div className="text-[10px] md:text-xs uppercase tracking-widest text-on-surface-variant font-bold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
