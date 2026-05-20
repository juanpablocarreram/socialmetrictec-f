import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Search, 
  Shield, 
  Mail, 
  MoreVertical,
  X,
  Check,
  Filter,
  AlertCircle
} from 'lucide-react';
import api from '../lib/axios';
import { cn } from '@/src/lib/utils';

interface User {
  username: string;
  email: string;
  is_admin:Boolean;
}
interface UserCreate extends User{
  password:string,
  confirmPassword:string
}
const MOCK_USERS: User[] = [{
    username: 'leonardo',
    email: 'a01739754@tec.mx',
    is_admin: true,
  },
  {
    username: 'ana',
    email: 'ana.garcia@tec.mx',
    is_admin: false,
  },
  {
    username: 'carlos',
    email: 'c.ruiz@tec.mx',
    is_admin: false,
  },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('lideres');
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<UserCreate>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  is_admin: false
  });
  const [showAddModalError, setShowAddModalError] = useState({active: false, message: ''});

  useEffect(() => {
          api.get(`${import.meta.env.VITE_API_URL}/user/users-preview`)
          .then(res => res.data)
          .then(data => setUsers(data));
  }, []);
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Limpiar errores previos
    setShowAddModalError({ active: false, message: '' });

    // Validación
    if (!newUser?.username?.trim() || !newUser?.email?.trim() || !newUser?.password || !newUser?.confirmPassword) {
      setShowAddModalError({ active: true, message: "Por favor, completa todos los campos" });
      return;
    }
    
    if (newUser.password !== newUser.confirmPassword) {
      setShowAddModalError({ active: true, message: "Las contraseñas no coinciden" });
      return;
    }

    if (newUser.password.length < 6) {
      setShowAddModalError({ active: true, message: "La contraseña debe tener al menos 6 caracteres" });
      return;
    }

    const user: User = {
      username: newUser.username,
      email: newUser.email,
      is_admin: false
    };

    try {
      // Axios ya incluye el Token de forma automática gracias al interceptor global
      await api.post(`${import.meta.env.VITE_API_URL}/user/register`, {
        username: user.username,
        email: user.email,
        password: newUser.password
      });

      // Si la petición es exitosa
      setUsers([user, ...users]);
      setNewUser({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        is_admin: false
      });
      
      // Cerrar modal solo si fue exitoso
      setShowAddModal(false);
      setShowAddModalError({ active: false, message: '' });
    } 
    catch (error: any) {
      const errorMessage = error?.response?.data?.detail || error?.message || "Error al crear usuario";
      setShowAddModalError({ active: true, message: errorMessage });
    }
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.username !== userToDelete.username));
      setUserToDelete(null);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-surface-container-lowest">
      {/* Internal Sidebar */}
      <aside className="w-64 bg-white border-r border-outline-variant/10 p-6 space-y-8 hidden md:block">
        <div>
          <h2 className="text-[10px] font-extrabold text-outline uppercase tracking-[0.2em] mb-6">Administración</h2>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('lideres')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                activeTab === 'lideres' 
                  ? "bg-primary/5 text-primary shadow-sm" 
                  : "text-on-surface-variant hover:bg-surface-container-low"
              )}
            >
              <Users className="w-5 h-5" />
              Líderes
            </button>

          </nav>
        </div>

        <div className="pt-8 border-t border-outline-variant/5">
          <p className="text-[9px] text-outline font-medium px-4">SISTEMA v1.4.2</p>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-grow p-8 md:p-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header Actions */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Users className="w-8 h-8" />
                <h1 className="text-4xl font-extrabold tracking-tighter">Gestión de Líderes</h1>
              </div>
              <p className="text-on-surface-variant font-light text-lg italic max-w-2xl">
                Controla el acceso de los líderes de proyecto en la plataforma SocialMetricTec.
              </p>
            </div>
            
            <button 
              onClick={() => {
                setShowAddModal(true);
                setShowAddModalError({ active: false, message: '' });
                setNewUser({
                  username: '',
                  email: '',
                  password: '',
                  confirmPassword: '',
                  is_admin: false
                });
              }}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-95 transition-all group"
            >
              <UserPlus className="w-4 h-4 transition-transform group-hover:scale-110" />
              Añadir Líder
            </button>
          </div>

          {/* Filters and Table */}
          <div className="bg-white rounded-[32px] border border-outline-variant/10 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-outline-variant/5 flex items-center gap-4 bg-surface-container-lowest">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input 
                  type="text"
                  placeholder="Buscar por nombre o correo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-outline-variant/20 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <button className="p-3 border border-outline-variant/20 rounded-xl hover:bg-surface-container-low transition-colors">
                <Filter className="w-4 h-4 text-outline" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-lowest">
                    <th className="px-8 py-4 text-[10px] font-extrabold text-outline uppercase tracking-widest">Líder</th>
                    <th className="px-8 py-4 text-[10px] font-extrabold text-outline uppercase tracking-widest">Estatus</th>
                    <th className="px-8 py-4 text-[10px] font-extrabold text-outline uppercase tracking-widest text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {filteredUsers.map((user) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={user.username} 
                      className="hover:bg-surface-container-lowest transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" alt="" className="w-10 h-10 rounded-full border border-outline-variant/10" />
                          <div>
                            <p className="text-sm font-bold text-primary">{user.username}</p>
                            <p className="text-xs text-outline">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            user.status === 'Active' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-outline-variant animate-pulse"
                          )} />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-outline">
                            {user.status === 'Active' ? 'Activo' : 'Pendiente'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setUserToDelete(user)}
                            className="p-2 text-outline-variant hover:text-error hover:bg-error/5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-outline-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredUsers.length === 0 && (
              <div className="p-20 text-center space-y-4">
                <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto text-outline/30">
                  <Search className="w-10 h-10" />
                </div>
                <p className="text-on-surface-variant font-light italic">No se encontraron usuarios con ese criterio.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddModal(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl p-10 overflow-hidden"
          >
            <button 
              onClick={() => {
                setShowAddModal(false);
                setShowAddModalError({ active: false, message: '' });
              }}
              className="absolute top-6 right-6 p-2 text-outline hover:text-primary"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-extrabold text-primary tracking-tighter">Nuevo Líder</h2>
                <p className="text-on-surface-variant font-light text-sm mt-2">Crea una cuenta para un nuevo líder de proyecto.</p>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">Nombre Completo</label>
                  <input 
                    required
                    type="text" 
                    value={newUser?.username}
                    onChange={e => setNewUser({...newUser, username: e.target.value})}
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Nombre del líder"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">Correo Electrónico</label>
                  <input 
                    required
                    type="email" 
                    value={newUser?.email}
                    onChange={e => setNewUser({...newUser, email: e.target.value})}
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary outline-none"
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">Contraseña</label>
                    <input 
                      required
                      type="password" 
                      value={newUser?.password}
                      onChange={e => setNewUser({...newUser, password: e.target.value})}
                      className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">Confirmar</label>
                    <input 
                      required
                      type="password" 
                      value={newUser?.confirmPassword}
                      onChange={e => setNewUser({...newUser, confirmPassword: e.target.value})}
                      className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* NUEVO MENSAJE DE ERROR ACTUALIZADO */}
                {showAddModalError?.active && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 bg-red-50 border border-red-200/60 rounded-2xl p-4 text-red-600"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-xs font-medium tracking-wide">{showAddModalError.message}</p>
                  </motion.div>
                )}

                <div className="pt-2 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowAddModalError({ active: false, message: '' });
                    }}
                    className="flex-grow py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-low rounded-2xl"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-grow py-4 bg-primary text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Guardar Líder
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setUserToDelete(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-8 overflow-hidden"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center text-error">
                <Trash2 className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-primary tracking-tighter">¿Eliminar Líder de Proyecto?</h3>
                <p className="text-on-surface-variant font-light text-sm leading-relaxed px-4">
                  Estás a punto de eliminar a <span className="font-bold text-primary">{userToDelete.name}</span>. Esta acción <span className="font-bold text-error">no es reversible</span>.
                </p>
              </div>

              <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 text-left">
                <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Aviso Importante</p>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                  Si este líder es el único vinculado a un proyecto, dicho proyecto <span className="font-bold text-error">también se eliminará</span> de manera automática.
                </p>
              </div>

              <div className="flex gap-3 w-full pt-4">
                <button 
                  onClick={() => setUserToDelete(null)}
                  className="flex-grow py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-low rounded-2xl transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-grow py-4 bg-error text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg hover:brightness-110 active:scale-95 transition-all"
                >
                  Confirmar Eliminación
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
