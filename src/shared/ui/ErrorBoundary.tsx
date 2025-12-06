import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
    children: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
                    <div className="max-w-md w-full bg-zinc-900 border border-red-500/30 rounded-2xl p-8 text-center shadow-2xl">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                            <AlertTriangle size={32} />
                        </div>

                        <h1 className="text-2xl font-bold mb-2">Algo deu errado</h1>
                        <p className="text-zinc-400 mb-6">
                            Ocorreu um erro inesperado. Tente recarregar a página.
                        </p>

                        {this.state.error && (
                            <div className="bg-black/50 rounded-lg p-4 mb-6 text-left overflow-auto max-h-32">
                                <code className="text-xs text-red-400 font-mono">
                                    {this.state.error.toString()}
                                </code>
                            </div>
                        )}

                        <button
                            onClick={() => window.location.reload()}
                            className="bg-white text-black font-bold py-3 px-6 rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 w-full"
                        >
                            <RefreshCw size={18} />
                            Recarregar Página
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
