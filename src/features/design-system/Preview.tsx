import { Button } from '@/shared/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card'
import { Input, TextArea } from '@/shared/ui/Input'

export default function DesignSystemPreview() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold text-foreground">Tipografia</h2>
        <p className="text-mutedForeground mt-2">Hierarquia clara com espaçamento generoso</p>
        <div className="mt-4 space-y-2">
          <div className="text-4xl font-semibold text-foreground">Display</div>
          <div className="text-2xl font-semibold text-foreground">Título</div>
          <div className="text-lg text-foreground">Subtítulo</div>
          <div className="text-base text-mutedForeground">Corpo do texto</div>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-foreground">Botões</h2>
        <div className="mt-4 flex flex-wrap gap-4">
          <Button variant="primary">Primário</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destrutivo</Button>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-foreground">Inputs</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-mutedForeground">Nome</label>
            <Input placeholder="Digite seu nome" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-mutedForeground">Sobre</label>
            <TextArea rows={4} placeholder="Conte sobre você" />
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-foreground">Cards</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-mutedForeground">Superfícies elegantes com bordas sutis e sombras discretas.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Atividade</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-mutedForeground">Layout responsivo e fluido para diferentes tamanhos de tela.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded-md bg-success/10 text-success">Sucesso</span>
                <span className="px-2 py-1 rounded-md bg-warning/10 text-warning">Aviso</span>
                <span className="px-2 py-1 rounded-md bg-destructive/10 text-destructive">Erro</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
