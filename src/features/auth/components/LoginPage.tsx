import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { authApi } from '../api/auth.api';

import { MagneticButton } from '@/shared/ui/MagneticButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring, Variants } from 'framer-motion';

import { ApiError } from '@/shared/api/http';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<React.ReactNode>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isRecovering, setIsRecovering] = useState(false);
    const { login, user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        // Em um cenário real, enviaríamos isso para um endpoint de log
        // await apiClient.post('/api/logs/auth', logEntry);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const emailClean = email.trim().toLowerCase();
        const passwordClean = password;

        // Client-side validation to avoid unnecessary API calls
        if (!emailClean || !emailClean.includes('@')) {
            setError('Por favor, insira um e-mail válido.');
            return;
        }
        if (!passwordClean || passwordClean.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        try {
            setError(null);
            setSuccessMessage('');
            setIsSubmitting(true);
            await login({ email: emailClean, password: passwordClean });
            logAuthAttempt('SUCCESS', email);
            navigate('/');
        } catch (err: unknown) {
            console.error('Login Error:', err);
            if (err instanceof ApiError && err.details) {
                console.warn('Login validation details:', err.details);
            }
            const msg = err instanceof Error ? err.message : '';
            let userFriendlyError: React.ReactNode = 'Falha no login. Verifique suas credenciais.';
            let logStatus = 'UNKNOWN_ERROR';

            // Handle Validation Errors from Zod (via ApiError)
            if (err instanceof ApiError && err.status === 400 && err.details) {
                const details = Array.isArray(err.details)
                    ? (err.details as Array<{ path?: string; message: string }>)
                    : null;
                userFriendlyError = (
                    <div className="flex flex-col gap-1">
                        <span className="font-semibold">Atenção</span>
                        {details ? (
                            <ul className="list-disc pl-4 space-y-0.5">
                                {details.map((d, i: number) => {
                                    // Use path to provide context
                                    const field = d.path || 'Campo desconhecido';
                                    let msg = d.message;
                                    if (field.includes('email') && msg.includes('invalid')) {
                                        msg = 'Formato de e-mail inválido. Ex: nome@dominio.com';
                                    }
                                    if (field.includes('password') && msg.includes('at least')) {
                                        msg = 'A senha deve ter pelo menos 6 caracteres.';
                                    }
                                    // Translate fallback if needed
                                    if (msg === "Required") {
                                        if (field.includes('email')) msg = "O e-mail é obrigatório.";
                                        else if (field.includes('password')) msg = "A senha é obrigatória.";
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
                logStatus = 'VALIDATION_FAILED';
            } else if (msg.includes('USER_NOT_FOUND') || msg.includes('Invalid login credentials')) {
                // Embora 'Usuário não encontrado' possa permitir enumeração, o requisito solicitou explicitamente
                // distinguir entre usuário não encontrado e senha incorreta se possível, 
                // mas APIs modernas geralmente retornam "Invalid login credentials" para ambos por segurança.
                // Vamos tentar inferir ou usar a mensagem genérica segura na UI, mas logar detalhado se a API permitir.
                // Se a API retornar erro específico:
                if (msg.includes('User not found')) {
                    userFriendlyError = (
                        <div className="flex flex-col gap-1">
                            <span className="font-semibold">Conta não encontrada</span>
                            <span>Verifique o e-mail digitado ou <Link to="/register" className="underline hover:text-destructive">crie uma nova conta</Link>.</span>
                        </div>
                    );
                    logStatus = 'USER_NOT_FOUND';
                } else {
                    userFriendlyError = (
                        <div className="flex flex-col gap-1">
                            <span className="font-semibold">Credenciais incorretas</span>
                            <span>Verifique seu e-mail e senha. Se esqueceu, use a <button type="button" onClick={() => { setError(null); setIsRecovering(true); }} className="underline hover:text-destructive font-medium">opção de recuperação</button>.</span>
                        </div>
                    );
                    logStatus = 'INVALID_CREDENTIALS';
                }
            } else if (msg.includes('WRONG_PASSWORD')) {
                userFriendlyError = (
                    <div className="flex flex-col gap-1">
                        <span className="font-semibold">Senha incorreta</span>
                        <span>Tente novamente ou <button type="button" onClick={() => { setError(null); setIsRecovering(true); }} className="underline hover:text-destructive font-medium">redefina sua senha</button>.</span>
                    </div>
                );
                logStatus = 'WRONG_PASSWORD';
            } else if (msg.includes('ACCOUNT_LOCKED')) {
                userFriendlyError = (
                    <div className="flex flex-col gap-1">
                        <span className="font-semibold">Conta bloqueada</span>
                        <span>Muitas tentativas falhas. Aguarde alguns minutos e tente novamente por segurança.</span>
                    </div>
                );
                logStatus = 'ACCOUNT_LOCKED';
            } else if (msg.includes('backend está rodando') || msg.includes('Failed to fetch')) {
                userFriendlyError = (
                    <div className="flex flex-col gap-1">
                        <span className="font-semibold">Servidor Indisponível</span>
                        <span>Não foi possível conectar ao servidor. Verifique se o backend está iniciado (npm run dev).</span>
                    </div>
                );
                logStatus = 'CONNECTION_ERROR';
            } else {
                userFriendlyError = (
                    <div className="flex flex-col gap-1">
                        <span className="font-semibold">Erro no acesso</span>
                        <span>Ocorreu um problema inesperado: {msg || 'Erro desconhecido'}</span>
                    </div>
                );
            }

            setError(userFriendlyError);
            logAuthAttempt(logStatus, email);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRecovery = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError('Por favor, informe seu e-mail.');
            return;
        }
        try {
            setError('');
            setSuccessMessage('');
            setIsSubmitting(true);
            await authApi.resetPassword(email);
            setSuccessMessage('Link de recuperação enviado! Verifique seu e-mail.');
            logAuthAttempt('RECOVERY_REQUESTED', email);
        } catch (err) {
            console.error(err);
            setError('Erro ao enviar link. Tente novamente.');
            logAuthAttempt('RECOVERY_FAILED', email);
        } finally {
            setIsSubmitting(false);
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
        <div className="min-h-screen flex items-center justify-center p-4 animated-gradient-bg overflow-hidden relative perspective-1000">
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
                                className="bg-green-500/10 text-green-400 text-sm p-3 rounded mb-4 font-mono border border-green-500/20"
                            >
                                {successMessage}
                            </motion.div>
                        )}

                        {isRecovering ? (
                            <form onSubmit={handleRecovery} className="space-y-4">
                                <motion.div variants={itemVariants} className="space-y-2">
                                    <p className="text-sm text-gray-400 mb-4">
                                        Digite seu e-mail para receber um link de recuperação de senha.
                                    </p>
                                    <label htmlFor="recovery-email" className="text-sm font-mono text-gray-400 ml-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                                        <input
                                            id="recovery-email"
                                            type="email"
                                            required
                                            className="w-full rounded-md pl-10 pr-3 py-3 text-white font-mono bg-white/5 border border-white/10 focus:border-primary/60 focus:ring-2 focus:ring-primary/30 placeholder:text-zinc-500"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="seu@email.com"
                                        />
                                    </div>
                                </motion.div>
                                <motion.div variants={itemVariants} className="pt-2 flex flex-col gap-3">
                                    <MagneticButton
                                        type="submit"
                                        className="w-full h-12 text-lg font-bold tracking-wide shadow-lg shadow-primary/20 hover:shadow-primary/40 bg-primary text-black rounded-md"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'ENVIANDO...' : 'ENVIAR LINK'}
                                    </MagneticButton>
                                    <button
                                        type="button"
                                        onClick={() => { setIsRecovering(false); setError(''); setSuccessMessage(''); }}
                                        className="text-sm text-gray-400 hover:text-white flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <ArrowLeft size={14} /> Voltar ao Login
                                    </button>
                                </motion.div>
                            </form>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <motion.div variants={itemVariants} className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-mono text-gray-400 ml-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            className="w-full rounded-md pl-10 pr-3 py-3 text-white font-mono bg-white/5 border border-white/10 focus:border-primary/60 focus:ring-2 focus:ring-primary/30 placeholder:text-zinc-500"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="seu@email.com"
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
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            className="w-full rounded-md pl-10 pr-10 py-3 text-white font-mono bg-white/5 border border-white/10 focus:border-primary/60 focus:ring-2 focus:ring-primary/30 placeholder:text-zinc-500"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            aria-label={showPassword ? "ocultar senha" : "exibir senha"}
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-gray-500 hover:text-gray-300 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </motion.div>
                                <motion.div variants={itemVariants} className="pt-2">
                                    <MagneticButton
                                        type="submit"
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
