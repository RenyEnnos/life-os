import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';

import { MagneticButton } from '@/shared/ui/MagneticButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring, Variants } from 'framer-motion';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    // 3D Tilt Effect Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

    // Better:
    const { user } = useAuth();
    useEffect(() => {
        if (user && !loading) {
            navigate('/', { replace: true });
        }
    }, [user, loading, navigate]);

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
        try {
            setError('');
            setLoading(true);
            await login({ email, password });
            navigate('/');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : '';
            if (msg.includes('USER_NOT_FOUND')) setError('Usuário não encontrado.');
            else if (msg.includes('WRONG_PASSWORD')) setError('Senha incorreta.');
            else if (msg.includes('ACCOUNT_LOCKED')) setError('Conta bloqueada temporariamente.');
            else setError('Falha no login. Verifique suas credenciais.');
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
                            <CardTitle className="text-xl text-gray-200">Acesso ao Sistema</CardTitle>
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
                            <motion.div variants={itemVariants} className="space-y-2">
                                <label className="text-sm font-mono text-gray-400 ml-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                                    <input
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
                                <label className="text-sm font-mono text-gray-400 ml-1">Senha</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="w-full rounded-md pl-10 pr-10 py-3 text-white font-mono bg-white/5 border border-white/10 focus:border-primary/60 focus:ring-2 focus:ring-primary/30 placeholder:text-zinc-500"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
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
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2 justify-center">
                                            <span className="animate-spin">⏳</span> ACESSANDO...
                                        </span>
                                    ) : 'ENTRAR'}
                                </MagneticButton>
                            </motion.div>
                        </form>
                        <motion.div variants={itemVariants} className="mt-6 text-center text-sm text-gray-500 font-mono">
                            Não tem conta?{' '}
                            <Link to="/register" className="text-primary hover:text-primary/80 hover:underline transition-colors font-semibold">
                                Registrar
                            </Link>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
