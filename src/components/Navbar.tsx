import { Link, useLocation } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {useAuth} from '../context/AuthContext'
import { 
  ChevronDown, 
  Plus, 
  Check, 
  CloudUpload, 
  X, 
  LayoutGrid,
  HeartHandshake,
  Leaf,
  Stethoscope,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Project {
  id: string;
  name: string;
  image: string;
  area: string;
}

const MOCK_PROJECTS: Project[] = [
  { 
    id: '1', 
    name: 'Reforestación Monterrey', 
    image: 'https://picsum.photos/seed/forest/200/200',
    area: 'Medio Ambiente'
  },
  { 
    id: '2', 
    name: 'Clínica Comunitaria', 
    image: 'https://picsum.photos/seed/health/200/200',
    area: 'Salud'
  },
  { 
    id: '3', 
    name: 'Tutorías Académicas', 
    image: 'https://picsum.photos/seed/education/200/200',
    area: 'Educación'
  },
];

const STRATEGIC_AREAS = [
  { name: 'Educación', icon: GraduationCap },
  { name: 'Salud', icon: Stethoscope },
  { name: 'Medio Ambiente', icon: Leaf },
  { name: 'Cultura', icon: LayoutGrid },
  { name: 'Desarrollo Social', icon: HeartHandshake }
];

export default function Navbar() {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [currentProject, setCurrentProject] = useState<Project>(MOCK_PROJECTS[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const {user, logout} = useAuth();

  const navLinks = [
    { name: 'Explorar', path: '/' },
    { name: 'Directorio', path: '/directory' },
    { name: 'Editor', path: '/editor' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Admin', path: '/admin' },
  ];
  /* Filters appearing links based on the state of the user */
  const finalNavLinks = navLinks.filter(({name})=>{
    const isLoggedIn = user !== null;
    const isAdmin = user?.is_admin;
    if (name === 'Admin') return isAdmin;
    if(name == 'Editor' || name == 'Dashboard'){
      return !isAdmin && isLoggedIn
    }
    return true;
  })
  const userImage = user && user?.is_admin ?"https://www.shutterstock.com/image-vector/simple-outline-user-configuration-setting-600nw-2636195015.jpg":"https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProjectSelect = (project: Project) => {
    setCurrentProject(project);
    setIsDropdownOpen(false);
  };

  return (
    <header className="w-full sticky top-0 z-50 glass-header border-b border-outline-variant/10 bg-white/80 backdrop-blur-md">
      <nav className="flex justify-between items-center px-6 md:px-12 py-3 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <img 
              alt="Tec de Monterrey Logo" 
              className="h-8 w-auto object-contain transition-transform group-hover:scale-110" 
              src="https://upload.wikimedia.org/wikipedia/commons/4/47/Logo_del_ITESM.svg"
              referrerPolicy="no-referrer"
            />
            <span className="text-xl font-bold text-primary tracking-tighter font-headline hidden lg:block">
              SocialMetricTec
            </span>
          </Link>
          {/* Project Switcher */}
          {user && !user?.is_admin &&
          (<div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={cn(
                "flex items-center gap-3 px-3 py-1.5 rounded-full transition-all duration-300 border border-outline-variant/10 hover:bg-surface-container-low group",
                isDropdownOpen ? "bg-surface-container-low ring-2 ring-primary/20" : "bg-transparent"
              )}
            >
              <div className="relative group/avatar">
                <img 
                  src={currentProject.image} 
                  alt={currentProject.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm transition-transform group-hover/avatar:scale-105"
                />
                <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-0.5 shadow-sm border border-white">
                  <ChevronDown className={cn("w-3 h-3 transition-transform duration-300", isDropdownOpen && "rotate-180")} />
                </div>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-outline uppercase tracking-widest leading-none mb-1">Proyecto Actual</p>
                <p className="text-xs font-bold text-primary truncate max-w-[120px] md:max-w-[180px]">{currentProject.name}</p>
              </div>
            </button>

            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-outline-variant/10 overflow-hidden z-50 p-2"
              >
                <div className="px-3 py-2 mb-2">
                  <p className="text-[10px] font-extrabold text-outline uppercase tracking-[0.2em]">Seleccionar Proyecto</p>
                </div>
                
                <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => handleProjectSelect(project)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl transition-all group",
                        currentProject.id === project.id 
                          ? "bg-primary/5 text-primary" 
                          : "hover:bg-surface-container-low text-on-surface-variant"
                      )}
                    >
                      <img 
                        src={project.image} 
                        alt={project.name}
                        className="w-10 h-10 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform"
                      />
                      <div className="text-left flex-grow truncate">
                        <p className="text-xs font-bold truncate">{project.name}</p>
                        <p className="text-[9px] text-outline uppercase tracking-wider font-bold">{project.area}</p>
                      </div>
                      {currentProject.id === project.id && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-outline-variant/5">
                  <Link
                    to="/create-project"
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-primary font-bold hover:bg-primary/5 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                      <Plus className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-xs uppercase tracking-widest">Crear Nuevo Proyecto</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>)
          }
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-8 items-center font-headline text-sm font-semibold tracking-tight">
            {finalNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "transition-all duration-300 ease-in-out pb-1 border-b-2 whitespace-nowrap",
                  location.pathname === link.path 
                    ? "text-primary border-primary" 
                    : "text-on-surface-variant border-transparent hover:text-primary hover:border-primary/30"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="h-6 w-px bg-outline-variant/20 hidden md:block" />
          {/* The button just appears if user is not logged in*/}
          {!user && (<Link 
            to="/login"
            className="bg-primary-container text-on-primary px-6 py-2 rounded-md font-headline text-sm font-semibold tracking-tight hover:brightness-110 transition-all active:scale-95 whitespace-nowrap"
          >
            Iniciar Sesión
          </Link>)}
          
          {/* User Profile Switcher */}
          {/* If there is a user the profile photo with dropdown menu will appear on NavBar */}
          { user && (<div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={cn(
                "flex items-center gap-2 p-1 rounded-full transition-all duration-300 hover:bg-surface-container-low group border border-transparent",
                isProfileOpen ? "bg-surface-container-low border-outline-variant/10 shadow-sm" : "bg-transparent"
              )}
            >
              <div className="w-9 h-9 rounded-full border-2 border-white shadow-sm overflow-hidden bg-primary/5">
                <img src={userImage} alt="User Profile" className="w-full h-full object-cover" />
              </div>
              <ChevronDown className={cn("w-4 h-4 text-outline transition-transform duration-300 mr-1", isProfileOpen && "rotate-180")} />
            </button>

            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-outline-variant/10 overflow-hidden z-50 p-2"
              >
                <div className="p-4 bg-surface-container-low rounded-xl mb-2">
                  <p className="text-xs font-extrabold text-primary truncate leading-tight">{user.username}</p>
                  <p className="text-[10px] text-outline truncate font-medium">{user.email}</p>
                </div>
                
                <div className="space-y-1">
                  <button className="w-full flex items-center gap-3 p-3 rounded-xl text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-all text-left group">
                    <div className="text-[10px] font-bold uppercase tracking-widest">Configuración avanzada de cuenta</div>
                  </button>
                  <div className="h-px bg-outline-variant/5 my-1" />
                  <Link 
                    to="/login"
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-error hover:bg-error/5 transition-all"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest">Cerrar Sesión</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>)
          }
        </div>
      </nav>

    </header>
  );
}
