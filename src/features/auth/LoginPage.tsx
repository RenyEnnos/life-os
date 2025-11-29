import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login({ email, password });
            navigate('/');
        } catch (err) {
            setError('Falha no login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md border-primary/20">
                <CardHeader className="text-center">
                    <h1 className="text-3xl font-bold text-primary tracking-widest font-mono glow-text mb-2">
                        LIFE OS
                    </h1>
                    <CardTitle>Acesso ao Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded mb-4 font-mono">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-mono text-gray-400">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-background border border-border rounded-md p-2 text-gray-100 focus:border-primary focus:outline-none font-mono"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-mono text-gray-400">Senha</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-background border border-border rounded-md p-2 text-gray-100 focus:border-primary focus:outline-none font-mono"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
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
