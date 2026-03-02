import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { MagneticButton } from '@/shared/ui/MagneticButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring, Variants } from 'framer-motion';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<React.ReactNode>(null);
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { updatePassword } = useAuth();
    const navigate = useNavigate();

    // 3D Tilt Effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });
    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) / rect.width);
        y.set((e.clientY - rect.top - rect.height / 2) / rect.height);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            return setError('A senha deve ter pelo menos 6 caracteres.');
        }
        if (password !== confirmPassword) {
            return setError('As senhas não conferem.');
        }

        try {
            setIsSubmitting(true);
            await updatePassword(password);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            console.error('Reset Password Error:', err);
            setError(err.message || 'Falha ao atualizar senha.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 animated-gradient-bg overflow-hidden relative perspective-1000">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full max-w-md relative z-10"
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <Card className="glass-panel border-primary/20 transform-gpu">
                    <CardHeader className="text-center">
                        <motion.div variants={itemVariants}>
                            <h1 className="text-4xl font-bold text-primary tracking-widest font-mono glow-text mb-2">
                                LIFE OS
                            </h1>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <CardTitle className="text-xl text-gray-200">Redefinir Senha</CardTitle>
                        </motion.div>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-destructive/10 text-destructive text-sm p-4 rounded-lg mb-4 border border-destructive/20 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <div>{error}</div>
                            </motion.div>
                        )}
                        {success && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-green-500/10 text-green-400 text-sm p-4 rounded-lg mb-4 border border-green-500/20">
                                Senha atualizada com sucesso! Redirecionando para o login...
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <motion.div variants={itemVariants} className="space-y-2">
                                <label className="text-sm font-mono text-gray-400 ml-1">Nova Senha</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="w-full rounded-md pl-10 pr-10 py-3 text-white font-mono bg-white/5 border border-white/10 focus:border-primary/60 focus:ring-2 focus:ring-primary/30"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-500 hover:text-gray-300">
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </motion.div>
                            <motion.div variants={itemVariants} className="space-y-2">
                                <label className="text-sm font-mono text-gray-400 ml-1">Confirmar Nova Senha</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full rounded-md pl-10 pr-3 py-3 text-white font-mono bg-white/5 border border-white/10 focus:border-primary/60 focus:ring-2 focus:ring-primary/30"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                    />
                                </div>
                            </motion.div>
                            <motion.div variants={itemVariants} className="pt-2">
                                <MagneticButton
                                    type="submit"
                                    className="w-full h-12 text-lg font-bold tracking-wide shadow-lg shadow-primary/20 bg-primary text-black rounded-md"
                                    disabled={isSubmitting || success}
                                >
                                    {isSubmitting ? 'ATUALIZANDO...' : 'REDEFINIR SENHA'}
                                </MagneticButton>
                            </motion.div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
