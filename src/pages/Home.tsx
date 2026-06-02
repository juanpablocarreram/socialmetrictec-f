import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowRight, School, HeartPulse, Leaf, Handshake, Landmark, Cpu, CheckCircle2, Users, Globe, Target, BarChart3, Coins,Utensils,Heart,GraduationCap,Droplet,Sun,Briefcase,TrendingDown,RefreshCcw,Fish,Trees,Scale,Building2 } from 'lucide-react';
import { listProjects, formatArea, ProjectSummary } from '@/src/services/projectService';

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<ProjectSummary[]>([]);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);

  useEffect(() => {
    listProjects()
      .then((all) => {
        setProjects(all)
        setFeaturedProjects(all.slice(0, 4))} )
      .catch(console.error);
  }, []);

  const metrics = [
    { label: 'Proyectos Activos', value: '450+', icon: Target },
    { label: 'Voluntarios Registrados', value: '12k', icon: Users },
    { label: 'Estados Alcanzados', value: '32', icon: Globe },
    { label: 'Impacto Directo', value: '8.5m', icon: BarChart3 },
  ];

  const areaCounts = projects.reduce((acc, project) => {
    const areaKey = project.impact_area?.toLowerCase() || '';
    acc[areaKey] = (acc[areaKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const impactAreas = [
    { 
      title: '1. Fin de la Pobreza', 
      matchValue: 'ods 1 fin de la pobreza', // Identificador para buscar en el conteo
      description: 'Programas de apoyo social, generación de ingresos estables y erradicación de vulnerabilidad económica.', 
      count: areaCounts['ods 1 fin de la pobreza'] || 0, // Si no hay proyectos, pone 0
      icon: Coins 
    },
    { 
      title: '2. Hambre Cero', 
      matchValue: 'ods 2 hambre cero',
      description: 'Seguridad alimentaria, optimización de agricultura sostenible y comedores comunitarios eficientes.', 
      count: areaCounts['ods 2 hambre cero'] || 0, 
      icon: Utensils 
    },
    { 
      title: '3. Salud y Bienestar', 
      matchValue: 'ods 3 salud y bienestar',
      description: 'Atención médica primaria, salud mental comunitaria y fomento de estilos de vida saludables.', 
      count: areaCounts['ods 3 salud y bienestar'] || 0, 
      icon: Heart 
    },
    { 
      title: '4. Educación de Calidad', 
      matchValue: 'ods 4 educación de calidad',
      description: 'Reducción de brechas educativas, regularización académica y fomento de alfabetización digital.', 
      count: areaCounts['ods 4 educación de calidad'] || 0, 
      icon: GraduationCap 
    },
    { 
      title: '5. Igualdad de Género', 
      matchValue: 'ods 5 igualdad de genero',
      description: 'Prevención de violencia, empoderamiento femenino y equidad de oportunidades en la comunidad.', 
      count: areaCounts['ods 5 igualdad de genero'] || 0, 
      icon: Users 
    },
    { 
      title: '6. Agua Limpia y Saneamiento', 
      matchValue: 'ods 6 agua limpia y saneamiento',
      description: 'Acceso a agua potable, sistemas de filtración biológica y concientización sobre recursos hídricos.', 
      count: areaCounts['ods 6 agua limpia y saneamiento'] || 0, 
      icon: Droplet 
    },
    { 
      title: '7. Energía Asequible y No Contaminante', 
      matchValue: 'ods 7 energia asequible y no contaminante',
      description: 'Transición energética, instalación de celdas solares y reducción del consumo de combustibles.', 
      count: areaCounts['ods 7 energia asequible y no contaminante'] || 0, 
      icon: Sun 
    },
    { 
      title: '8. Trabajo Decente y Crecimiento Económico', 
      matchValue: 'ods 8 trabajo decente y crecimiento economico',
      description: 'Inclusión laboral, capacitación técnica para el empleo y fortalecimiento de comercios locales.', 
      count: areaCounts['ods 8 trabajo decente y crecimiento economico'] || 0, 
      icon: Briefcase 
    },
    { 
      title: '9. Industria, Innovación e Infraestructura', 
      matchValue: 'ods 9 industria innovacion e infraestructura',
      description: 'Desarrollo de infraestructura comunitaria, conectividad digital y adopción de tecnologías limpias.', 
      count: areaCounts['ods 9 industria innovacion e infraestructura'] || 0, 
      icon: Cpu 
    },
    { 
      title: '10. Reducción de las Desigualdades', 
      matchValue: 'ods 10 reduccion de las desigualdades',
      description: 'Inclusión social de minorías, apoyo integral a personas con discapacidad y justicia económica.', 
      count: areaCounts['ods 10 reduccion de las desigualdades'] || 0, 
      icon: TrendingDown 
    },
    { 
      title: '11. Ciudades y Comunidades Sostenibles', 
      matchValue: 'ods 11 ciudades y comunidades sostenibles',
      description: 'Optimización de espacios públicos, movilidad urbana compartida y viviendas dignas resilientes.', 
      count: areaCounts['ods 11 ciudades y comunidades sostenibles'] || 0, 
      icon: Building2
    },
    { 
      title: '12. Producción y Consumo Responsables', 
      matchValue: 'ods 12 produccion y consumo responsables',
      description: 'Modelos de economía circular, reducción drástica de mermas y gestión de residuos sólidos.', 
      count: areaCounts['ods 12 produccion y consumo responsables'] || 0, 
      icon: RefreshCcw 
    },
    { 
      title: '13. Acción por el Clima', 
      matchValue: 'ods 13 accion por el clima',
      description: 'Estrategias de mitigación ambiental, reforestación urbana y reducción de huella de carbono.', 
      count: areaCounts['ods 13 accion por el clima'] || 0, 
      icon: Leaf 
    },
    { 
      title: '14. Vida Submarina', 
      matchValue: 'ods 14 vida submarina',
      description: 'Limpieza de cuerpos de agua, conservación de flora marina y control de vertidos contaminantes.', 
      count: areaCounts['ods 14 vida submarina'] || 0, 
      icon: Fish 
    },
    { 
      title: '15. Vida de Ecosistemas Terrestres', 
      matchValue: 'ods 15 vida de ecosistemas terrestres',
      description: 'Regeneración biológica de suelos, protección de biodiversidad local y rescate de áreas verdes.', 
      count: areaCounts['ods 15 vida de ecosistemas terrestres'] || 0, 
      icon: Trees 
    },
    { 
      title: '16. Paz, Justicia e Instituciones Sólidas', 
      matchValue: 'ods 16 paz justicia e instituciones solidas',
      description: 'Resolución pacífica de conflictos, fomento a la legalidad y transparencia en comités vecinales.', 
      count: areaCounts['ods 16 paz justicia e instituciones solidas'] || 0, 
      icon: Scale 
    },
    { 
      title: '17. Alianzas para Lograr los Objetivos', 
      matchValue: 'ods 17 alianzas para lograr los objetivos',
      description: 'Vinculación multisectorial, convenios universitarios y redes operativas de voluntariado social.', 
      count: areaCounts['ods 17 alianzas para lograr los objetivos'] || 0, 
      icon: Handshake 
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-surface py-20 md:py-32 px-6 md:px-12">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-3/5 space-y-8"
          >
            <span className="text-primary font-bold tracking-widest uppercase text-xs">Legado Institucional y Social</span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-primary tracking-tighter leading-tight">
              Construyendo el futuro a través del <span className="text-primary-container">impacto social</span>.
            </h1>
            <p className="text-xl text-on-surface-variant leading-relaxed max-w-2xl font-light">
              Nuestra plataforma académica documenta, gestiona y potencializa las iniciativas que transforman realidades en México y el mundo.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link 
                to="/directory"
                className="bg-primary text-on-primary px-8 py-4 rounded-md font-bold transition-all hover:scale-105 shadow-lg inline-block"
              >
                Explorar Proyectos
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-2/5 relative"
          >
            <div className="w-full aspect-[4/5] bg-surface-container-low rounded-2xl overflow-hidden relative shadow-2xl">
              <img 
                className="w-full h-full object-cover opacity-90" 
                src="https://picsum.photos/seed/campus/800/1000" 
                alt="Campus"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="bg-surface-container py-20 px-6 md:px-12">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          {metrics.map((metric, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="space-y-2"
            >
              <span className="text-4xl md:text-5xl font-extrabold text-primary tracking-tighter">{metric.value}</span>
              <p className="text-xs md:text-sm uppercase tracking-widest text-on-surface-variant font-semibold">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="bg-surface py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold text-primary mb-4 tracking-tight">Proyectos Destacados</h2>
              <p className="text-on-surface-variant leading-relaxed">Selección curada de iniciativas con mayor incidencia social durante el último ciclo académico.</p>
            </div>
            <Link 
              to="/directory" 
              className="text-primary font-bold flex items-center gap-2 hover:underline underline-offset-4 group"
            >
              Ver todos los proyectos <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {featuredProjects.map((project, idx) => {
              const isLarge = idx % 3 === 0;
              return (
                <motion.div
                  key={project.project_id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className={cn(
                    'group rounded-2xl overflow-hidden tonal-card',
                    isLarge ? 'md:col-span-8' : 'md:col-span-4',
                  )}
                >
                  <div className={cn('flex flex-col h-full', isLarge ? 'md:flex-row' : '')}>
                    <div className={cn('overflow-hidden', isLarge ? 'md:w-1/2 h-64 md:h-full' : 'h-64')}>
                      <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        src={project.cover_image_url || 'https://picsum.photos/seed/project/800/600'}
                        alt={project.project_name}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className={cn('p-8 md:p-10 flex flex-col justify-center space-y-6', isLarge ? 'md:w-1/2' : '')}>
                      <span className="text-tertiary-container font-bold text-xs uppercase tracking-widest">
                        {formatArea(project.impact_area)}
                      </span>
                      <h3 className="text-2xl font-bold text-primary leading-tight">{project.project_name}</h3>
                      <p className="text-on-surface-variant text-sm leading-relaxed">
                        {project.description ?? 'Sin descripción.'}
                      </p>
                      <Link
                        to={`/project/${project.project_id}`}
                        className="self-start text-primary border-b-2 border-primary pb-1 font-bold hover:text-primary-container hover:border-primary-container transition-colors"
                      >
                        Ver Detalles
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {featuredProjects.length === 0 && (
              <div className="md:col-span-12 py-16 text-center text-on-surface-variant">
                Aún no hay proyectos publicados.{' '}
                <Link to="/create-project" className="text-primary font-bold hover:underline">
                  Crea el primero
                </Link>
                .
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Impact Areas */}
      <section className="bg-surface-container-low py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-screen-2xl mx-auto">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-4xl font-bold text-primary tracking-tighter">Áreas de Impacto Estratégico</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">Nuestra labor se alinea con los Objetivos de Desarrollo Sostenible (ODS) para generar un cambio sistémico.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-outline-variant/20 overflow-hidden rounded-2xl border border-outline-variant/20">
            {impactAreas.map((area, idx) => (
              <div key={idx} className="bg-surface py-16 px-12 hover:bg-surface-container-lowest transition-all group cursor-default">
                <div className="w-12 h-12 bg-primary-container/10 flex items-center justify-center rounded-full mb-8 group-hover:bg-primary-container transition-colors">
                  <area.icon className="w-6 h-6 text-primary-container group-hover:text-on-primary transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">{area.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">{area.description}</p>
                <span className="text-xs font-bold text-primary-container tracking-widest uppercase">{area.count} Proyectos</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-primary text-on-primary overflow-hidden relative">
        <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="lg:w-1/2 space-y-8">
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-tight">Tu acción es el motor del cambio.</h2>
            <p className="text-xl text-on-primary-container font-light leading-relaxed">
              Forma parte de la comunidad de impacto más grande de la institución. No importa tu perfil, hay un lugar para tu talento en el servicio social.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <button className="bg-surface-container-lowest text-primary px-10 py-5 rounded-md font-bold text-lg hover:scale-105 transition-transform shadow-xl">
                Únete como Voluntario
              </button>
              <button className="border-2 border-on-primary/30 text-on-primary px-10 py-5 rounded-md font-bold text-lg hover:bg-on-primary/10 transition-colors">
                Contactar con un Líder
              </button>
            </div>
          </div>
          
          <div className="lg:w-1/2 flex justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative w-full max-w-md bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl"
            >
              <div className="flex items-center gap-4 border-b border-white/10 pb-6 mb-6">
                <div className="w-12 h-12 bg-primary-container/30 rounded-full flex items-center justify-center">
                  <HeartPulse className="w-6 h-6 text-on-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-xl">¿Por qué ser voluntario?</h4>
                  <p className="text-sm opacity-60">Transformación mutua</p>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  'Desarrollo de competencias transversales',
                  'Conexión con problemáticas reales',
                  'Validación de Servicio Social Institucional',
                  'Red de contactos en el tercer sector'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-on-primary-container" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container/20 rounded-full blur-[120px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-tertiary-container/10 rounded-full blur-[120px] -ml-48 -mb-48"></div>
      </section>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
