import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function PrivacyPage() {
    return (
        <>
            <Helmet>
                <title>Política de Privacidade | Life OS</title>
                <meta name="description" content="Política de privacidade do Life OS - Protegemos seus dados e respeitamos sua privacidade conforme a LGPD (Lei Geral de Proteção de Dados) e outras disposições legais aplicáveis." />
                <meta name="keywords" content="privacidade, LGPD, GDPR, proteção de dados, Life OS" />
                <link rel="canonical" href="https://life-os.app/privacy" />
            </Helmet>
            
            <div className="min-h-screen bg-background text-foreground p-8">
                <div className="max-w-4xl mx-auto p-8">
                    <div className="glass-panel border-primary/20 rounded-2xl">
                        <div className="p-8">
                            <h1 className="text-3xl font-bold text-primary mb-6">Política de Privacidade</h1>
                            
                            <p className="text-muted-foreground mb-4">
                                Última atualização: {new Date().toLocaleDateString('pt-BR')}
                            </p>
                            
                            <section className="space-y-8">
                                <div>
                                    <h2 className="text-xl font-semibold text-primary mb-4">1. Quais dados coletamos?</h2>
                                    <p className="text-muted-foreground mb-4">
                                        Coletamos as seguintes informações pessoais:
                                    </p>
                                    <ul className="list-disc list-inside space-y-3 ml-6">
                                        <li>• <strong>Email:</strong> Endereço de e-mail que você fornece ao criar conta</li>
                                        <li>• <strong>Nome:</strong> Seu nome completo ou nome de exibição</li>
                                        <li>• <strong>Planejamento:</strong> Objetivos, compromissos, revisões, planos, check-ins, reflexões e feedback que você fornecer</li>
                                        <li>• <strong>Preferências:</strong> Tema, idioma e estado de onboarding</li>
                                    </ul>
                                </div>
                                
                                <div>
                                    <h2 className="text-xl font-semibold text-primary mb-4">2. Como usamos seus dados?</h2>
                                    <p className="text-muted-foreground mb-4">
                                        Seus dados são usados das seguintes formas:
                                    </p>
                                    <ul className="list-disc list-inside space-y-3 ml-6">
                                        <li>• <strong>Autenticação e Perfil:</strong> Para acessar sua conta, manter seu perfil atualizado</li>
                                        <li>• <strong>Funcionalidade:</strong> Para fornecer o ciclo de planejamento pessoal do MVP</li>
                                        <li>• <strong>Recuperação:</strong> Para restaurar o workspace após uma redefinição explícita</li>
                                        <li>• <strong>Diagnóstico:</strong> Apenas códigos e nomes técnicos estáveis, sem texto pessoal</li>
                                    </ul>
                                </div>
                                
                                <div>
                                    <h2 className="text-xl font-semibold text-primary mb-4">3. Com quem compartilhamos seus dados?</h2>
                                    <p className="text-muted-foreground mb-4">
                                        Seus dados são compartilhados apenas com:
                                    </p>
                                    <ul className="list-disc list-inside space-y-3 ml-6">
                                        <li>• <strong>Você:</strong> Através do Login, apenas você tem acesso ao seu usuário e dados</li>
                                        <li>• <strong>Operação:</strong> O mantenedor pode acessar o armazenamento apenas para operação, incidente ou restauração autorizada</li>
                                        <li>• <strong>Processadores externos:</strong> Google Analytics, Sentry Replay e encaminhamento externo de erros estão desativados</li>
                                    </ul>
                                </div>
                                
                                <div>
                                    <h2 className="text-xl font-semibold text-primary mb-4">4. Seus direitos</h2>
                                    <p className="text-muted-foreground mb-4">
                                        Você tem os seguintes direitos:
                                    </p>
                                    <ul className="list-disc list-inside space-y-3 ml-6">
                                        <li>• <strong>Acesso:</strong> A qualquer momento, solicitar acesso completo a todos os seus dados pessoais (copiar, exportar, excluir) através da nossa interface</li>
                                        <li>• <strong>Portabilidade:</strong> Baixar imediatamente os dados suportados em JSON estruturado nas Configurações</li>
                                        <li>• <strong>Retificação:</strong> Solicitar correção de quaisquer dados pessoais incompletos ou imprecisos</li>
                                        <li> <strong>Eliminação:</strong> Solicitar a exclusão completa e definitiva de sua conta e todos os dados associados</li>
                                    </ul>
                                </div>
                                
                                <div>
                                    <h2 className="text-xl font-semibold text-primary mb-4">5. Cookies e Tecnologias</h2>
                                    <p className="text-muted-foreground mb-4">
                                        Utilizamos cookies para melhorar sua experiência:
                                    </p>
                                    <ul className="list-disc list-inside space-y-3 ml-6">
                                        <li><strong>Cookies Essenciais:</strong> Para manter sua sessão ativa, funcionalidades básicas do aplicativo</li>
                                        <li><strong>Analytics e replay:</strong> Desativados nos modos suportados do MVP</li>
                                    </ul>
                                </div>
                                
                                <div>
                                    <h2 className="text-xl font-semibold text-primary mb-4">6. Segurança dos Dados</h2>
                                    <p className="text-muted-foreground mb-4">
                                        Implementamos as seguintes medidas de segurança:
                                    </p>
                                    <ul className="list-disc list-inside space-y-3 ml-6">
                                        <li>• <strong>Criptografia:</strong> Senhas armazenadas com hash bcrypt (um algoritmo de criptografia de mão única)</li>
                                        <li>• <strong>Autenticação:</strong> Tokens JWT com tempo de expiração de 7 dias, HTTP-only cookies para tokens (não acessível via JavaScript)</li>
                                        <li>• <strong>Conexão Segura:</strong> Toda comunicação entre seu navegador e servidor usa HTTPS (TLS 1.3)</li>
                                        <li>• <strong>Backup:</strong> Backups automáticos diários dos dados em locais seguros e isolados</li>
                                        <li>• <strong>Monitoramento:</strong> Logs de acesso e atividades registrados para fins de segurança e auditoria</li>
                                        <li> <strong>Proteção GDPR/LGPD:</strong> Base legal em operadores da União Europeia para transferências internacionais</li>
                                    </ul>
                                </div>
                                
                                <div>
                                    <h2 className="text-xl font-semibold text-primary mb-4">7. Mudanças nesta Política</h2>
                                    <p className="text-muted-foreground mb-4">
                                        Qualquer mudança futura nesta política será notificada através de:
                                    </p>
                                    <ul className="list-disc list-inside space-y-3 ml-6">
                                        <li>• Avisos na aplicação</li>
                                        <li>• Email para usuários cadastrados</li>
                                        <li>• Atualização deste documento em nosso site</li>
                                    </ul>
                                </div>
                                
                                <div className="mt-12 pt-6 border-t border-white/10">
                                    <p className="text-sm text-muted-foreground">
                                        Data da última atualização: {new Date().toLocaleDateString('pt-BR')}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Esta política foi revisada e aprovada em 03/02/2026 por Pedro (fundador do Life OS).
                                    </p>
                                </div>
                                
                                <div className="text-center mt-8">
                                    <Link 
                                        to="/" 
                                        className="text-primary hover:text-primary/80 font-medium underline"
                                    >
                                        Voltar ao Life OS
                                    </Link>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
