import { motion } from 'motion/react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  BookOpen, 
  BarChart3, 
  Image as ImageIcon, 
  HeartHandshake
} from 'lucide-react';

interface Block {
  id: string;
  name: string;
  type: string;
  data?: any;
}

interface PageConfig {
  blocks: Block[];
  styles: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
}

export default function ProjectDetail() {
  const { id } = useParams();
  const [config, setConfig] = useState<PageConfig | null>(null);
  const [loading, setLoading] = useState(true);

  // --- API INTEGRATION POINT ---
  // In a real application, you would fetch this data from your backend.
  // URL example: `https://your-api.com/projects/${id}`
  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      try {
        // Simulating API Call
        // const response = await fetch(`YOUR_API_URL_HERE/${id}`);
        // const data = await response.json();
        
        // Mock data that matches the unified JSON structure
        const mockData: PageConfig = {
          blocks: [
            { id: 'hero', name: 'Hero', type: 'hero' },
            { id: 'narrative', name: 'Narrativa', type: 'narrative' },
            { id: 'metrics', name: 'Métricas', type: 'metrics' },
          ],
          styles: {
            primaryColor: '#002068',
            secondaryColor: '#525d85',
            fontFamily: 'Manrope'
          }
        };
        
        setConfig(mockData);
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-surface">Cargando proyecto...</div>;
  if (!config) return <div className="min-h-screen flex items-center justify-center bg-surface text-error">No se encontró la configuración del proyecto.</div>;

  const { blocks, styles } = config;

  return (
    <div className="flex flex-col min-h-screen bg-surface" style={{ fontFamily: styles.fontFamily }}>
      {blocks.map((block) => (
        <div key={block.id} className="w-full">
          {block.type === 'hero' && (
            <section className="relative h-[85vh] w-full bg-slate-900 overflow-hidden">
              <img 
                alt="hero" 
                className="absolute inset-0 w-full h-full object-cover opacity-60" 
                src="https://picsum.photos/seed/hero-published/1920/1080"
                referrerPolicy="no-referrer"
              />
              <div className="relative h-full flex flex-col justify-center items-center text-center p-16 bg-gradient-to-b from-transparent via-primary/20 to-primary/80">
                <motion.h1 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="text-6xl md:text-8xl font-extrabold text-white leading-tight max-w-5xl mb-8 tracking-tighter"
                >
                  Redefiniendo el Legado Institucional
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl md:text-2xl text-white/90 max-w-3xl font-light leading-relaxed mb-12"
                >
                  Transformamos datos de impacto social en narrativas académicas de alto valor para el futuro.
                </motion.p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-5 rounded-full text-white font-bold uppercase tracking-widest shadow-2xl" 
                  style={{ backgroundColor: styles.primaryColor }}
                >
                  CONOCE EL IMPACTO
                </motion.button>
              </div>
            </section>
          )}

          {block.type === 'metrics' && (
            <section className="py-32 bg-surface-container-lowest">
              <div className="max-w-6xl mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-20 text-center">
                  {[
                    { label: 'Proyectos Activos', value: '450+' },
                    { label: 'Beneficiarios', value: '12k' },
                    { label: 'Tasa de Éxito', value: '98%' },
                  ].map((stat, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex flex-col gap-4"
                    >
                      <span className="text-8xl font-extrabold tracking-tighter" style={{ color: styles.primaryColor }}>{stat.value}</span>
                      <span className="text-sm text-on-surface-variant uppercase tracking-[0.4em] font-bold opacity-60 leading-tight">{stat.label}</span>
                      <div className="h-1.5 w-16 mx-auto rounded-full mt-4" style={{ backgroundColor: styles.secondaryColor + '40' }}></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {block.type === 'narrative' && (
            <section className="py-40 bg-white overflow-hidden">
              <div className="max-w-4xl mx-auto px-8 flex flex-col items-center text-center gap-16">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: 80 }}
                  className="h-1 bg-primary/20 rounded-full" 
                  style={{ backgroundColor: styles.secondaryColor + '40' }}
                />
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="text-6xl font-bold text-primary tracking-tight"
                >
                  Nuestra Misión Curatorial
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-on-surface-variant leading-relaxed text-2xl font-light"
                >
                  La curaduría académica no solo recopila información; destila la esencia del impacto social para asegurar que cada iniciativa sea medida por su valor humano y trascendencia institucional.
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="p-16 bg-surface-container-low rounded-[60px] border border-outline-variant/10 relative w-full group"
                >
                  <div className="absolute -top-12 left-16 text-[180px] text-primary/5 font-serif select-none transition-transform group-hover:scale-110">"</div>
                  <p className="text-2xl italic text-on-surface-variant leading-relaxed relative z-10 font-medium">
                    El compromiso con la sociedad es el pilar que sostiene nuestra excelencia académica. Cada dato cuenta una historia de transformación real.
                  </p>
                </motion.div>
              </div>
            </section>
          )}

          {['gallery', 'volunteer'].includes(block.type) && (
            <section className="py-32 border-y border-outline-variant/5 flex flex-col items-center justify-center min-h-[500px] bg-surface-container-low/10">
              {block.type === 'gallery' ? <ImageIcon className="w-24 h-24 text-primary opacity-20 mb-8" /> : <HeartHandshake className="w-24 h-24 text-primary opacity-20 mb-8" />}
              <h2 className="text-4xl font-bold text-primary opacity-40 uppercase tracking-widest">{block.name}</h2>
              <p className="text-outline mt-6 font-medium">Módulo {block.name} en proceso de implementación técnica.</p>
            </section>
          )}
        </div>
      ))}

      {/* Published Footer */}
      <footer className="py-32 bg-primary text-white text-center">
        <div className="max-w-4xl mx-auto px-8 space-y-12">
          <h2 className="text-5xl font-bold tracking-tighter">SocialMetricTec</h2>
          <p className="text-xl text-white/60 font-light max-w-lg mx-auto">
            Plataforma de curaduría de impacto social para la excelencia académica. Uniendo ciencia y sociedad.
          </p>
          <div className="pt-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[12px] uppercase tracking-widest opacity-50">
            <span>© 2026 Tecnológico de Monterrey</span>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Términos</a>
              <a href="#" className="hover:text-white transition-colors">Contacto</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
