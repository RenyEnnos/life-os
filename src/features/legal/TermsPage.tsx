import { Helmet } from 'react-helmet-async';

export default function TermsPage() {
    return (
        <>
            <Helmet>
                <title>Termos de Uso | Life OS</title>
                <meta name="description" content="Termos de uso do serviço Life OS - Conheça seus direitos e responsabilidades ao utilizar nossa plataforma de produtividade pessoal." />
                <meta name="keywords" content="termos de uso, termos, Life OS, LGPD" />
                <link rel="canonical" href="https://life-os.app/terms" />
            </Helmet>
            
            <div className="min-h-screen bg-background text-foreground p-8">
                <div className="max-w-4xl mx-auto p-8">
                    <div className="glass-panel border-primary/20 rounded-2xl">
                        <div className="p-8">
                            <h1 className="text-3xl font-bold text-primary mb-6">Termos de Uso</h1>
                            
                            <p className="text-muted-foreground mb-4">
                                Última atualização: {new Date().toLocaleDateString('pt-BR')}
                            </p>
                            
                            <section className="space-y-8">
                                <div>
                                    <h2 className="text-xl font-semibold text-primary mb-4">1. Aceitação dos Termos</h2>
                                    <p className="text-muted-foreground mb-4">
                                        Ao criar sua conta no Life OS, você concorda com estes Termos de Uso e nossa Política de Privacidade.
                                    </p>
                                    <p className="text-muted-foreground mb-4">
                                        Ao continuar usando o Life OS, você confirma que leu e entende estes termos e políticas.
                                    </p>
                                </div>
                                
                                <div>
                                    <h2 className="text-xl font-semibold text-primary mb-4">2. Serviços do Life OS</h2>
                                    <p className="text-muted-foreground mb-4">
                                        O Life OS oferece os seguintes serviços:
                                    </p>
                                    <ul className="list-disc list-inside space-y-3 ml-6">
                                        <li>• <strong>Gerenciamento de Tarefas:</strong> Criar, editar, excluir e organizar suas tarefas diárias</li>
                                        <li>• <strong>Tracking de Hábitos:</strong> Registrar e acompanhar seus hábitos diários com gráficos de consistência</li>
                                        <li>• <strong>Finanças Pessoais:</strong> Registrar receitas, despesas e categorias com tags inteligentes</li>
                                        <li>• <strong>Journal:</strong> Escrever diariamente com editor rico e receber insights de IA</li>
                                        <li>• <strong>Saúde e Bem-estar:</strong> Registrar métricas de saúde, lembretes de medicação e monitorar progresso</li>
                                        <li>• <strong>Projetos:</strong> Criar projetos, definir objetivos e realizar análises SWOT com IA</li>
                                        <li>• <strong>Universitário:</strong> Gerenciar cursos, notas e simular cenários acadêmicos</li>
                                        <li>• <strong>Assistente de IA:</strong> Chat com IA para sugestões contextuais, gerar planos semanais e responder perguntas</li>
                                        <li>• <strong>Gamificação:</strong> Sistema de XP, níveis e conquistas para engajamento</li>
                                        <li><strong>Modo Foco:</strong> Timer Pomodoro com overlay "Santuary" para foco profundo</li>
                                    </ul>
                                </div>
                                
                                <div>
                                    <h2 className="text-xl font-semibold text-primary mb-4">3. Comportamento do Usuário</h2>
                                    <p className="text-muted-foreground mb-4">
                                        Ao usar o Life OS, você concorda em:
                                    </p>
                                    <ul className="list-disc list-inside space-y-3 ml-6">
                                        <li>• Fornecer informações verdadeiras e precisas ao se cadastro</li>
                                        <li>• Não compartilhar suas credenciais de acesso com outros usuários</li>
                                        <li>• Não tentar contornar as medidas de segurança do sistema</li>
                                        <li>• Respeitar a propriedade intelectual da Life OS e de outros usuários</li>
                                        <li>• Reportar bugs ou problemas de forma construtiva</li>
                                    </ul>
                                </div>
                                
                                <div>
                                    <h2 className="text-xl font-semibold text-primary mb-4">4. Propriedade Intelectual</h2>
                                    <p className="text mb-6">
                                        O Life OS, sua interface, design, código, documentação e conteúdo são protegidos por direitos autorais e propriedade intelectual.
                                    </p>
                                    <p className="text-muted-foreground mb-4">
                                        <strong>Uso Permitido:</strong> Você pode usar o Life OS para fins pessoais e comerciais, desde que respeite estes termos.
                                    </p>
                                    <p className="text-muted-foreground mb-4">
                                        <strong>Uso Proibido:</strong> Não é permitido:
                                    </p>
                                    <ul className="list-disc list-inside space-y-3 ml-6">
                                        <li> Copiar, modificar ou redistribuir qualquer parte do sistema sem autorização</li>
                                        <li> Tentar engenharia reversa para descobrir vulnerabilidades</li>
                                        <li> Uso excessivo da API de IA ou outros recursos automatizados que possa impactar a performance</li>
                                        <li> Spam ou qualquer comportamento abusivo que prejudique outros usuários</li>
                                    </ul>
                                </div>
                                
                                <div>
                                    <h2 className="text-xl font-semibold text-primary mb-4">5. Limitação de Responsabilidade</h2>
                                    <p className="text-muted-foreground mb-4">
                                        O Life OS não se responsabiliza por:
                                    </p>
                                    <ul className="list-disc list-inside space-y-3 ml-6">
                                        <li> Perdas danos ou danos indiretos resultantes do uso inadequado do serviço</li>
                                        <li> Conteúdo gerado por IA ou outros usuários</li>
                                        <li> Falhas no funcionamento que não foram causadas diretamente por nós</li>
                                    </ul>
                                </div>
                                
                                <div>
                                    <h2 className="text-xl font-semibold text-primary mb-4">6. Alterações nos Termos</h2>
                                    <p className="text-muted-foreground mb-4">
                                        Qualquer alteração nestes termos será comunicada através:
                                    </p>
                                    <ul className="list-disc list-inside space-y-3 ml-6">
                                        <li> Avisos na aplicação</li>
                                        <li> Email para usuários cadastrados</li>
                                        <li> Atualização deste documento em nosso site</li>
                                    </ul>
                                </div>
                                
                                <div className="mt-12 pt-6 border-t border-white/10">
                                    <p className="text-sm text-muted-foreground">
                                        Data da última atualização: {new Date().toLocaleDateString('pt-BR')}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Estes termos foram revisados e aprovados em 03/02/2026 por Pedro (fundador do Life OS).
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
