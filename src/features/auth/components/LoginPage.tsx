import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { loginSchema, type LoginFormData } from '@/shared/schemas/auth';

import { MagneticButton } from '@/shared/ui/MagneticButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring, Variants } from 'framer-motion';

export default function LoginPage() {
    const [error, setError] = useState<React.ReactNode>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isRecovering, setIsRecovering] = useState(false);
    const { login, resetPassword, user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const recoveryEmail = watch('email');
    const recoveryErrorFallback = 'Erro ao enviar link. Tente novamente.';

    const getErrorMessage = (value: unknown): string | null => {
        if (value instanceof Error) {
            return value.message.trim() || null;
        }

        if (
            typeof value === 'object' &&
            value !== null &&
            'message' in value &&
            typeof value.message === 'string'
        ) {
            return value.message.trim() || null;
        }

        return null;
    };

    // 3D Tilt Effect Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

    // Redirect if already logged in
    useEffect(() => {
        if (user && !authLoading) {
            navigate('/', { replace: true });
        }
    }, [user, authLoading, navigate]);

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

    const logAuthAttempt = (status: string, emailUsed: string) => {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event: 'LOGIN_ATTEMPT',
            status,
            email: emailUsed,
            userAgent: navigator.userAgent
        };
        console.log('[AUTH_LOG]', JSON.stringify(logEntry));
    };

    const onSubmit = async (data: LoginFormData) => {
        try {
            setError(null);
            setSuccessMessage('');
            setIsSubmitting(true);
            await login({ email: data.email.trim().toLowerCase(), password: data.password });
            logAuthAttempt('SUCCESS', data.email);
            navigate('/');
        } catch (err: any) {
            console.error('Login Error:', err);
            let userFriendlyError: React.ReactNode = 'Falha no login. Verifique suas credenciais.';
            let logStatus = 'UNKNOWN_ERROR';

            const msg = err?.message || '';
            
            if (msg.includes('Invalid login credentials') || msg.includes('invalid_credentials')) {
                userFriendlyError = 'E-mail ou senha incorretos.';
                logStatus = 'INVALID_CREDENTIALS';
            } else if (msg.includes('Email not confirmed')) {
                userFriendlyError = 'Por favor, confirme seu e-mail antes de acessar.';
                logStatus = 'EMAIL_NOT_CONFIRMED';
            } else if (msg.includes('too many requests')) {
                userFriendlyError = 'Muitas tentativas. Tente novamente mais tarde.';
                logStatus = 'RATE_LIMITED';
            } else {
                userFriendlyError = msg || 'Ocorreu um erro inesperado no acesso.';
            }

            setError(userFriendlyError);
            logAuthAttempt(logStatus, data.email);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRecovery = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!recoveryEmail) {
            setError('Por favor, informe seu e-mail.');
            return;
        }
        try {
            setError('');
            setSuccessMessage('');
            setIsSubmitting(true);
            await resetPassword(recoveryEmail);
            setSuccessMessage('Link de recuperação enviado! Verifique seu e-mail.');
            logAuthAttempt('RECOVERY_REQUESTED', recoveryEmail);
        } catch (err) {
            console.error(err);
            setError(getErrorMessage(err) ?? recoveryErrorFallback);
            logAuthAttempt('RECOVERY_FAILED', recoveryEmail);
        } finally {
            setIsSubmitting(false);
        }
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05, // Faster stagger
                delayChildren: 0.1 // Shorter delay
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 10, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 120 }
        }
    };

    return (
        <div data-testid="login-page-container" className="min-h-screen flex items-center justify-center p-4 animated-gradient-bg overflow-hidden relative perspective-1000">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
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
                <Card className="glass-panel border-primary/20 transform-gpu">
                    <CardHeader className="text-center">
                        <motion.div variants={itemVariants} className="transform-gpu translate-z-10">
                            <h1 className="text-4xl font-bold text-primary tracking-widest font-mono glow-text mb-2">
                                LIFE OS
                            </h1>
                        </motion.div>
                        <motion.div variants={itemVariants} className="transform-gpu translate-z-5">
                            <CardTitle className="text-xl text-gray-200">
                                {isRecovering ? 'Recuperar Senha' : 'Acesso ao Sistema'}
                            </CardTitle>
                        </motion.div>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                data-testid="login-error-message"
                                className="bg-destructive/10 text-destructive text-sm p-4 rounded-lg mb-4 font-mono border border-destructive/20 flex items-start gap-3"
                            >
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    {error}
                                </div>
                            </motion.div>
                        )}
                        {successMessage && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                data-testid="login-success-message"
                                className="bg-green-500/10 text-green-400 text-sm p-3 rounded mb-4 font-mono border border-green-500/20"
                            >
                                {successMessage}
                            </motion.div>
                        )}

                        {isRecovering ? (
                            <form onSubmit={handleRecovery} data-testid="recovery-form" className="space-y-4">
                                <motion.div variants={itemVariants} className="space-y-2">
                                    <p className="text-sm text-gray-400 mb-4">
                                        Digite seu e-mail para receber um link de recuperação de senha.
                                    </p>
                                    <label htmlFor="recovery-email" className="text-sm font-mono text-gray-400 ml-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500 z-10" />
                                        <Input
                                            id="recovery-email"
                                            type="email"
                                            data-testid="recovery-email-input"
                                            className="pl-10"
                                            {...register('email')}
                                            placeholder="seu@email.com"
                                            error={errors.email?.message}
                                        />
                                    </div>
                                </motion.div>
                                <motion.div variants={itemVariants} className="pt-2 flex flex-col gap-3">
                                    <MagneticButton
                                        type="submit"
                                        data-testid="recovery-submit-button"
                                        className="w-full h-12 text-lg font-bold tracking-wide shadow-lg shadow-primary/20 hover:shadow-primary/40 bg-primary text-black rounded-md"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'ENVIANDO...' : 'ENVIAR LINK'}
                                    </MagneticButton>
                                    <button
                                        type="button"
                                        data-testid="back-to-login-button"
                                        onClick={() => { setIsRecovering(false); setError(''); setSuccessMessage(''); }}
                                        className="text-sm text-gray-400 hover:text-white flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <ArrowLeft size={14} /> Voltar ao Login
                                    </button>
                                </motion.div>
                            </form>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} data-testid="login-form" className="space-y-4">
                                <motion.div variants={itemVariants} className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-mono text-gray-400 ml-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500 z-10" />
                                        <Input
                                            id="email"
                                            type="email"
                                            data-testid="login-email-input"
                                            className="pl-10"
                                            {...register('email')}
                                            placeholder="seu@email.com"
                                            error={errors.email?.message}
                                        />
                                    </div>
                                </motion.div>
                                <motion.div variants={itemVariants} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label htmlFor="password" className="text-sm font-mono text-gray-400 ml-1">Senha</label>
                                        <button
                                            type="button"
                                            onClick={() => setIsRecovering(true)}
                                            className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors"
                                        >
                                            Esqueci minha senha
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500 z-10" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            data-testid="login-password-input"
                                            className="pl-10 pr-10"
                                            {...register('password')}
                                            placeholder="••••••••"
                                            error={errors.password?.message}
                                        />
                                        <button
                                            type="button"
                                            aria-label={showPassword ? "ocultar senha" : "exibir senha"}
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-gray-500 hover:text-gray-300 transition-colors z-10"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </motion.div>
                                <motion.div variants={itemVariants} className="pt-2">
                                    <MagneticButton
                                        type="submit"
                                        data-testid="login-submit-button"
                                        className="w-full h-12 text-lg font-bold tracking-wide shadow-lg shadow-primary/20 hover:shadow-primary/40 bg-primary text-black rounded-md"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2 justify-center">
                                                <span className="animate-spin">⏳</span> ACESSANDO...
                                            </span>
                                        ) : 'ENTRAR'}
                                    </MagneticButton>
                                </motion.div>
                            </form>
                        )}
                        {!isRecovering && (
                            <motion.div variants={itemVariants} className="mt-6 text-center text-sm text-gray-500 font-mono">
                                Não tem conta?{' '}
                                <Link to="/register" className="text-primary hover:text-primary/80 hover:underline transition-colors font-semibold">
                                    Registrar
                                </Link>
                            </motion.div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
