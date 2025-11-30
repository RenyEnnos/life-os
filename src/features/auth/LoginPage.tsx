import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Eye, EyeOff, Sun, Moon } from 'lucide-react';
import ProgressBar from '@/components/ui/ProgressBar';
import { useTheme } from '@/hooks/useTheme';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { toggleTheme, isDark } = useTheme();
    const { login } = useAuth();
    const { updateThemePreference } = useAuth();
    const navigate = useNavigate();

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
            else if (msg.includes('ACCOUNT_LOCKED')) setError('Conta bloqueada temporariamente. Tente novamente mais tarde.');
            else setError('Falha no login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    const [strengthPct, setStrengthPct] = useState(0);
    const strengthLabel = strengthPct < 40 ? 'FRACA' : strengthPct < 80 ? 'MÉDIA' : 'FORTE';
    const cardBg = isDark ? 'bg-background' : 'bg-white text-black';
    const inputCls = isDark ? 'bg-background border-border text-gray-100' : 'bg-white border-border text-black';
    useEffect(() => {
        const id = setTimeout(() => {
            let s = 0;
            if (password.length >= 8) s++;
            if (/[A-Z]/.test(password)) s++;
            if (/[a-z]/.test(password)) s++;
            if (/[0-9]/.test(password)) s++;
            if (/[^A-Za-z0-9]/.test(password)) s++;
            setStrengthPct(Math.min(5, s) * 20);
        }, 300);
        return () => clearTimeout(id);
    }, [password]);

    return (
        <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-background' : 'bg-gray-100'} p-4 transition-colors`}>
            <Card className={`w-full max-w-md border-primary/20 ${cardBg} transition-all duration-300`}
            >
                <CardHeader className="text-center">
                    <h1 className="text-3xl font-bold text-primary tracking-widest font-mono glow-text mb-2">
                        LIFE OS
                    </h1>
                    <CardTitle>Acesso ao Sistema</CardTitle>
                    <div className="mt-3 flex items-center justify-center gap-2">
                        <Button variant="outline" size="icon" aria-label="Alternar tema" aria-pressed={!isDark} onClick={() => { toggleTheme(); updateThemePreference(isDark ? 'light' : 'dark'); }}>
                            {isDark ? <Sun size={16} /> : <Moon size={16} />}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded mb-4 font-mono">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-mono text-gray-400">Email</label>
                            <input
                                id="email"
                                type="email"
                                required
                                className={`w-full ${inputCls} border rounded-md p-2 focus:border-primary focus:outline-none font-mono transition-colors`}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-mono text-gray-400">Senha</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className={`w-full ${inputCls} border rounded-md p-2 pr-10 focus:border-primary focus:outline-none font-mono transition-colors`}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {password && (
                                <div className="mt-2 space-y-1">
                                    <div className="flex items-center justify-between text-xs font-mono">
                                        <span>FORÇA DA SENHA</span>
                                        <span className={strengthPct < 40 ? 'text-destructive' : strengthPct < 80 ? 'text-yellow-400' : 'text-green-400'}>{strengthLabel}</span>
                                    </div>
                                    <ProgressBar value={strengthPct} />
                                </div>
                            )}
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'ACESSANDO...' : 'ENTRAR'}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm text-gray-500 font-mono">
                        Não tem conta?{' '}
                        <Link to="/register" className="text-primary hover:underline">
                            Registrar
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
