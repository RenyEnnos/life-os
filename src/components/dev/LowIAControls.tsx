import React from 'react'
import Toggle from '../ui/Toggle'
import { Button } from '../ui/Button'

type Prefs = { lowIA: boolean; autoClassifyFinance: boolean }
type Props = { lowIA: boolean; autoClassifyFinance: boolean; onSave: (prefs: Prefs) => void }

export default function LowIAControls({ lowIA, autoClassifyFinance, onSave }: Props) {
  const [prefs, setPrefs] = React.useState<Prefs>({ lowIA, autoClassifyFinance })
  return (
    <div className="border border-green-700 p-4 bg-black/40 font-mono">
      <div className="text-green-400 mb-2">Preferências IA</div>
      <div className="flex items-center gap-2 text-green-300 mb-2"><Toggle checked={prefs.lowIA} onChange={(v: boolean)=> setPrefs({ ...prefs, lowIA: v })} /> Modo Low-IA</div>
      <div className="flex items-center gap-2 text-green-300 mb-4"><Toggle checked={prefs.autoClassifyFinance} onChange={(v: boolean)=> setPrefs({ ...prefs, autoClassifyFinance: v })} /> Classificação automática financeira</div>
      <Button onClick={()=> onSave(prefs)}>Salvar</Button>
    </div>
  )
}
