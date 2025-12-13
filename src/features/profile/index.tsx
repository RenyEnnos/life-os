import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { User, Mail, Shield, Calendar, Edit2, LogOut, Camera } from 'lucide-react';
import { BentoCard, BentoGrid } from '@/shared/ui/BentoCard';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { cn } from '@/shared/lib/cn';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
    const { user, logout, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveProfile = async () => {
        try {
            setIsSaving(true);
            await updateProfile({ full_name: fullName });
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
            // Ideally show a toast error here
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const joinDate = user?.created_at
        ? new Date(user.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
        : 'Desconhecido';

    return (
        <div className="space-y-8 pb-20 max-w-5xl mx-auto">

            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Perfil de Comando</h1>
                    <p className="text-muted-foreground mt-1">Gerencie sua identidade e credenciais do sistema.</p>
                </div>
                <Button
                    variant="outline"
                    className="gap-2 border-red-500/20 hover:bg-red-500/10 hover:text-red-400 text-red-500/70"
                    onClick={handleLogout}
                >
                    <LogOut size={16} />
                    Desconectar Sistema
                </Button>
            </header>

            <BentoGrid className="grid-cols-1 md:grid-cols-3 gap-6">

                {/* Identity Card (Span 2) */}
                <BentoCard
                    title="Identidade Visual"
                    icon={User}
                    className="col-span-1 md:col-span-2 min-h-[300px]"
                >
                    <div className="flex flex-col md:flex-row items-center gap-8 h-full justify-center md:justify-start p-6">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-1 shadow-2xl shadow-indigo-500/20">
                                <div className="w-full h-full rounded-full bg-zinc-900 border-4 border-black/50 overflow-hidden flex items-center justify-center">
                                    {user?.user_metadata?.avatar_url ? (
                                        <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={48} className="text-indigo-200" />
                                    )}
                                </div>
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-zinc-800 rounded-full border border-white/10 text-white hover:bg-zinc-700 hover:scale-110 transition-all shadow-lg">
                                <Camera size={16} />
                            </button>
                        </div>

                        {/* Name Info */}
                        <div className="flex-1 w-full max-w-md space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nome de Exibição</label>
                                <div className="flex items-center gap-2">
                                    {isEditing ? (
                                        <Input
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="bg-black/20 border-white/10 h-10"
                                            autoFocus
                                        />
                                    ) : (
                                        <h2 className="text-2xl font-medium text-white">{fullName || 'Sem nome definido'}</h2>
                                    )}

                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-muted-foreground hover:text-white"
                                        onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                                    >
                                        {isEditing ? <CheckIcon className="w-4 h-4 text-green-400" /> : <Edit2 size={14} />}
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-1">
                                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                        <Shield size={12} /> Nível de Acesso
                                    </span>
                                    <p className="font-mono text-sm text-indigo-300">ADMINISTRADOR</p>
                                </div>
                                <div className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-1">
                                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                        <Calendar size={12} /> Iniciado em
                                    </span>
                                    <p className="font-mono text-sm text-zinc-300">{joinDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </BentoCard>

                {/* Account Details Card */}
                <BentoCard
                    title="Credenciais de Acesso"
                    icon={Shield}
                    className="col-span-1"
                >
                    <div className="space-y-6 pt-2">
                        <div className="space-y-2">
                            <label className="text-xs text-muted-foreground flex items-center gap-2">
                                <Mail size={14} /> Email Registrado
                            </label>
                            <div className="p-3 bg-black/40 rounded-lg border border-white/5 text-sm font-mono text-zinc-300 break-all">
                                {user?.email}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-muted-foreground flex items-center gap-2">
                                <Shield size={14} /> ID do Usuário
                            </label>
                            <div className="p-3 bg-black/40 rounded-lg border border-white/5 text-xs font-mono text-zinc-500 break-all">
                                {user?.id}
                            </div>
                        </div>
                    </div>
                </BentoCard>

            </BentoGrid>

            {/* Additional Sections (Preferences, API Keys, etc.) can go here */}
            {/* For now, just a placeholder for future settings that aren't global app settings */}

        </div>
    );
}

function CheckIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}
