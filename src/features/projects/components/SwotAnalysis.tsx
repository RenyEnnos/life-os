import { Card } from '@/shared/ui/Card';

interface SwotAnalysisProps {
    swot: {
        strengths: string[];
        weaknesses: string[];
        opportunities: string[];
        threats: string[];
    } | undefined;
}

export function SwotAnalysis({ swot }: SwotAnalysisProps) {
    if (!swot) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="p-4 border-l-4 border-l-green-500 bg-surface/30">
                <h4 className="font-mono font-bold text-green-500 mb-2">FORÇAS</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {swot.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
            </Card>
            <Card className="p-4 border-l-4 border-l-red-500 bg-surface/30">
                <h4 className="font-mono font-bold text-red-500 mb-2">FRAQUEZAS</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {swot.weaknesses.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
            </Card>
            <Card className="p-4 border-l-4 border-l-blue-500 bg-surface/30">
                <h4 className="font-mono font-bold text-blue-500 mb-2">OPORTUNIDADES</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {swot.opportunities.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
            </Card>
            <Card className="p-4 border-l-4 border-l-yellow-500 bg-surface/30">
                <h4 className="font-mono font-bold text-yellow-500 mb-2">AMEAÇAS</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {swot.threats.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
            </Card>
        </div>
    );
}
