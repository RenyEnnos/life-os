import React from 'react'
import LowIAControls from './LowIAControls'

export default { title: 'Dev/LowIAControls', component: LowIAControls }

export const Disabled = () => <LowIAControls lowIA={false} autoClassifyFinance={true} onSave={(p)=>console.log(p)} />
export const Enabled = () => <LowIAControls lowIA={true} autoClassifyFinance={false} onSave={(p)=>console.log(p)} />
