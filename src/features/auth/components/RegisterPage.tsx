import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { registerSchema, type RegisterFormData } from '@/shared/schemas/auth';
import { Button } from '@/shared/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';
import { motion, useMotionValue, useTransform, useSpring, Variants } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';

export default function RegisterPage() {
    const [error, setError] = useState<React.ReactNode>(null);
    const [loading, setLoading] = useState(false);
    const { register: registerUser, user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            inviteCode: '',
            password: '',
            confirmPassword: '',
        }
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const onSubmit = async (data: RegisterFormData) => {
        setError(null);

        try {
            setLoading(true);
            const normalizedEmail = data.email.trim().toLowerCase();
            const normalizedName = `${data.firstName} ${data.lastName}`.trim();
            await registerUser({
                email: normalizedEmail,
                password: data.password,
                name: normalizedName,
                inviteCode: data.inviteCode.trim(),
            });
            
            setError(
                <div className="text-green-400">
                    Convite ativado com sucesso. Sua conta beta ja pode acessar o Life OS.
                </div>
            );
        } catch (err: any) {
            console.error('Registration Error:', err);
            
            const msg = err?.message || '';
            let userFriendlyError: React.ReactNode = 'Falha ao criar conta.';
            
            if (msg.includes('User already registered')) {
                userFriendlyError = 'Este e-mail já está cadastrado.';
            } else if (msg.includes('Password should be at least 6 characters')) {
                userFriendlyError = 'A senha deve ter no mínimo 6 caracteres.';
            } else {
                userFriendlyError = msg || 'Ocorreu um erro inesperado no cadastro.';
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
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <motion.div variants={itemVariants} className="space-y-2">
                                    <label className="text-sm font-mono dark:text-gray-300 text-gray-700 font-medium ml-1">Nome</label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-3 h-5 w-5 dark:text-gray-400 text-gray-500 group-focus-within:text-primary transition-colors z-10" />
                                        <Input
                                            type="text"
                                            className="pl-10"
                                            {...register('firstName')}
                                            placeholder="Nome"
                                            error={errors.firstName?.message}
                                        />
                                    </div>
                                </motion.div>
                                <motion.div variants={itemVariants} className="space-y-2">
                                    <label className="text-sm font-mono dark:text-gray-300 text-gray-700 font-medium ml-1">Sobrenome</label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-3 h-5 w-5 dark:text-gray-400 text-gray-500 group-focus-within:text-primary transition-colors z-10" />
                                        <Input
                                            type="text"
                                            className="pl-10"
                                            {...register('lastName')}
                                            placeholder="Sobrenome"
                                            error={errors.lastName?.message}
                                        />
                                    </div>
                                </motion.div>
                            </div>
                            <motion.div variants={itemVariants} className="space-y-2">
                                <label className="text-sm font-mono dark:text-gray-300 text-gray-700 font-medium ml-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 dark:text-gray-400 text-gray-500 group-focus-within:text-primary transition-colors z-10" />
                                    <Input
                                        type="email"
                                        className="pl-10"
                                        {...register('email')}
                                        placeholder="seu@email.com"
                                        error={errors.email?.message}
                                    />
                                </div>
                            </motion.div>
                            <motion.div variants={itemVariants} className="space-y-2">
                                <label className="text-sm font-mono dark:text-gray-300 text-gray-700 font-medium ml-1">Codigo de convite</label>
                                <div className="relative group">
                                    <KeyRound className="absolute left-3 top-3 h-5 w-5 dark:text-gray-400 text-gray-500 group-focus-within:text-primary transition-colors z-10" />
                                    <Input
                                        type="text"
                                        className="pl-10 uppercase"
                                        {...register('inviteCode')}
                                        placeholder="LIFEOS-INVITE"
                                        error={errors.inviteCode?.message}
                                    />
                                </div>
                                <p className="text-xs text-gray-500">
                                    O beta fechado libera acesso apenas para parceiros convidados pela Aevum Labs.
                                </p>
                            </motion.div>
                            <motion.div variants={itemVariants} className="space-y-2">
                                <label className="text-sm font-mono dark:text-gray-300 text-gray-700 font-medium ml-1">Senha</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 dark:text-gray-400 text-gray-500 group-focus-within:text-primary transition-colors z-10" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        className="pl-10 pr-10"
                                        {...register('password')}
                                        placeholder="••••••••"
                                        error={errors.password?.message}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors z-10"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </motion.div>
                            <motion.div variants={itemVariants} className="space-y-2">
                                <label className="text-sm font-mono dark:text-gray-300 text-gray-700 font-medium ml-1">Confirmar Senha</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 dark:text-gray-400 text-gray-500 group-focus-within:text-primary transition-colors z-10" />
                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="pl-10 pr-10"
                                        {...register('confirmPassword')}
                                        placeholder="••••••••"
                                        error={errors.confirmPassword?.message}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors z-10"
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
