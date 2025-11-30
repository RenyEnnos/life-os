import React from 'react'
import DevLogsPanel from './DevLogsPanel'

export default { title: 'Dev/DevLogsPanel', component: DevLogsPanel }

export const Idle = () => <DevLogsPanel calls={0} avgMs={0} errors={0} />
export const Active = () => <DevLogsPanel calls={42} avgMs={180} errors={1} />
export const HighErrors = () => <DevLogsPanel calls={100} avgMs={250} errors={12} />
