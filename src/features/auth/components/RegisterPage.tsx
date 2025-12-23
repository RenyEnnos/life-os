import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { Button } from '@/shared/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { motion, useMotionValue, useTransform, useSpring, Variants } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

import { ApiError } from '@/shared/api/http';

type ValidationDetail = {
    path?: string | string[];
    message: string;
};

const isValidationDetail = (detail: unknown): detail is ValidationDetail => {
    if (!detail || typeof detail !== 'object') {
        return false;
    }
    const candidate = detail as { message?: unknown };
    return typeof candidate.message === 'string';
};

export default function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<React.ReactNode>(null);
    const [loading, setLoading] = useState(false);
    const { register, user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (user && !authLoading) {
            navigate('/', { replace: true });
        }
    }, [user, authLoading, navigate]);

    // 3D Tilt Effect Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXFromCenter = e.clientX - rect.left - width / 2;
        const mouseYFromCenter = e.clientY - rect.top - height / 2;
        x.set(mouseXFromCenter / width);
        y.set(mouseYFromCenter / height);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Client-side validation
        if (!firstName.trim() || !lastName.trim()) {
            return setError('Por favor, preencha nome e sobrenome.');
        }
        if (!email.trim()) {
            return setError('O e-mail é obrigatório.');
        }
        if (password.length < 6) {
            return setError('A senha deve ter no mínimo 6 caracteres.');
        }
        if (password !== confirmPassword) {
            return setError('As senhas não conferem');
        }

        try {
            setLoading(true);
            const normalizedEmail = email.trim().toLowerCase();
            const normalizedName = `${firstName} ${lastName}`.trim();
            await register({ email: normalizedEmail, password, name: normalizedName });
            navigate('/');
        } catch (err: unknown) {
            console.error('Registration Error:', err);
            
            let userFriendlyError: React.ReactNode = 'Falha ao criar conta.';
            
            if (err instanceof ApiError && err.status === 400 && err.details) {
                 userFriendlyError = (
                    <div className="flex flex-col gap-1">
                        <span className="font-semibold">Atenção</span>
                        {Array.isArray(err.details) ? (
                            <ul className="list-disc pl-4 space-y-0.5">
                                {err.details.filter(isValidationDetail).map((detail, i: number) => {
                                    const field = Array.isArray(detail.path)
                                        ? detail.path.join('.')
                                        : (detail.path || 'Campo desconhecido');
                                    let msg = detail.message;
                                    
                                    // Translate fallback if backend sends raw Zod "Required"
                                    if (msg === "Required") {
                                        if (field.includes('email')) msg = "O e-mail é obrigatório.";
                                        else if (field.includes('password')) msg = "A senha é obrigatória.";
                                        else if (field.includes('name')) msg = "O nome é obrigatório.";
                                        else msg = "Preencha todos os campos.";
                                    }
                                    
                                    return <li key={i}>{msg}</li>;
                                })}
                            </ul>
                        ) : (
                            <span>{JSON.stringify(err.details)}</span>
                        )}
                    </div>
                );
            } else if (err instanceof ApiError && err.status === 400 && err.message.includes('already exists')) {
                userFriendlyError = 'Este e-mail já está cadastrado.';
            }

            setError(userFriendlyError);
        } finally {
            setLoading(false);
        }
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 animated-gradient-bg overflow-hidden relative perspective-1000 bg-background transition-colors duration-300">
            {/* Theme follows browser preference; no manual toggle */}

            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full max-w-md relative z-10"
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <Card className="glass-panel border-primary/20 transform-gpu dark:bg-zinc-900/30 bg-white/70 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="text-center">
                        <motion.div variants={itemVariants} className="transform-gpu translate-z-10">
                            <h1 className="text-4xl font-bold text-primary tracking-widest font-mono glow-text mb-2">
                                LIFE OS
                            </h1>
                        </motion.div>
                        <motion.div variants={itemVariants} className="transform-gpu translate-z-5">
                            <CardTitle className="text-xl dark:text-gray-200 text-gray-800 font-semibold">Novo Usuário</CardTitle>
                        </motion.div>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-destructive/10 text-destructive text-sm p-3 rounded mb-4 font-mono border border-destructive/20"
                            >
                                {error}
                            </motion.div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <motion.div variants={itemVariants} className="space-y-2">
                                    <label className="text-sm font-mono dark:text-gray-300 text-gray-700 font-medium ml-1">Nome</label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-3 h-5 w-5 dark:text-gray-400 text-gray-500 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            className={cn(
                                                "w-full rounded-md pl-10 pr-3 py-3 font-mono input-premium focus:outline-none transition-all duration-200",
                                                "dark:bg-white/5 dark:text-gray-100 dark:border-white/10 dark:placeholder:text-zinc-500",
                                                "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 border shadow-sm",
                                                "focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                                            )}
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="Nome"
                                        />
                                    </div>
                                </motion.div>
                                <motion.div variants={itemVariants} className="space-y-2">
                                    <label className="text-sm font-mono dark:text-gray-300 text-gray-700 font-medium ml-1">Sobrenome</label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-3 h-5 w-5 dark:text-gray-400 text-gray-500 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            className={cn(
                                                "w-full rounded-md pl-10 pr-3 py-3 font-mono input-premium focus:outline-none transition-all duration-200",
                                                "dark:bg-white/5 dark:text-gray-100 dark:border-white/10 dark:placeholder:text-zinc-500",
                                                "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 border shadow-sm",
                                                "focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                                            )}
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Sobrenome"
                                        />
                                    </div>
                                </motion.div>
                            </div>
                            <motion.div variants={itemVariants} className="space-y-2">
                                <label className="text-sm font-mono dark:text-gray-300 text-gray-700 font-medium ml-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 dark:text-gray-400 text-gray-500 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        className={cn(
                                            "w-full rounded-md pl-10 pr-3 py-3 font-mono input-premium focus:outline-none transition-all duration-200",
                                            "dark:bg-white/5 dark:text-gray-100 dark:border-white/10 dark:placeholder:text-zinc-500",
                                            "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 border shadow-sm",
                                            "focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                                        )}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="seu@email.com"
                                    />
                                </div>
                            </motion.div>
                            <motion.div variants={itemVariants} className="space-y-2">
                                <label className="text-sm font-mono dark:text-gray-300 text-gray-700 font-medium ml-1">Senha</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 dark:text-gray-400 text-gray-500 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className={cn(
                                            "w-full rounded-md pl-10 pr-10 py-3 font-mono input-premium focus:outline-none transition-all duration-200",
                                            "dark:bg-white/5 dark:text-gray-100 dark:border-white/10 dark:placeholder:text-zinc-500",
                                            "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 border shadow-sm",
                                            "focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                                        )}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </motion.div>
                            <motion.div variants={itemVariants} className="space-y-2">
                                <label className="text-sm font-mono dark:text-gray-300 text-gray-700 font-medium ml-1">Confirmar Senha</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 dark:text-gray-400 text-gray-500 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        className={cn(
                                            "w-full rounded-md pl-10 pr-10 py-3 font-mono input-premium focus:outline-none transition-all duration-200",
                                            "dark:bg-white/5 dark:text-gray-100 dark:border-white/10 dark:placeholder:text-zinc-500",
                                            "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 border shadow-sm",
                                            "focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                                        )}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </motion.div>
                            <motion.div variants={itemVariants} className="pt-2">
                                <Button
                                    type="submit"
                                    className="w-full h-12 text-lg font-bold tracking-wide shadow-lg shadow-primary/20 hover:shadow-primary/40"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="animate-spin">⏳</span> CRIANDO...
                                        </span>
                                    ) : 'CRIAR CONTA'}
                                </Button>
                            </motion.div>
                        </form>
                        <motion.div variants={itemVariants} className="mt-6 text-center text-sm text-gray-500 font-mono">
                            Já tem conta?{' '}
                            <Link to="/login" className="text-primary hover:text-primary/80 hover:underline transition-colors font-semibold">
                                Entrar
                            </Link>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
