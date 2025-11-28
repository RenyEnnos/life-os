import React from 'react';
import { Card, Button } from '../components/Widgets';

export const Settings: React.FC = () => {
    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-white text-4xl font-black tracking-tighter font-display">Settings & Dev Mode</h1>
            
            <div className="flex flex-col gap-8 max-w-4xl">
                <section>
                    <h2 className="text-xl font-bold mb-4 border-b border-[#224922] pb-2 text-primary">General</h2>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between p-4 bg-[#142e14]/50 border border-[#224922] rounded-sm">
                            <div className="flex items-center gap-4">
                                <span className="material-symbols-outlined">contrast</span>
                                <span>Dark Mode</span>
                            </div>
                             <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 size-4 bg-white rounded-full"></div></div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-[#142e14]/50 border border-[#224922] rounded-sm">
                             <div className="flex items-center gap-4">
                                <span className="material-symbols-outlined">language</span>
                                <span>Language</span>
                            </div>
                            <select className="bg-[#102310] border border-[#224922] rounded-sm px-2 py-1 text-sm">
                                <option>English (US)</option>
                                <option>Español</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-4 border-b border-[#224922] pb-2 text-primary">Dev Mode / Logs</h2>
                    <div className="bg-black p-4 rounded-sm border border-[#224922] font-mono text-xs text-green-500 overflow-x-auto">
                        <pre className="whitespace-pre-wrap">
{`> System initialized...
> Loading modules: [Tasks, Habits, Health, Finance]... OK
> Connecting to database... OK
> User: Dev User (ID: 8080)
> IA calls count today: 142
> Average IA response time: 23ms
> Last sync: 2024-10-27 14:32:01 UTC
> Recent IA Errors:
  [WARN] High latency detected (150ms) for habit suggestion service
> Listening for new events...
_`}
                        </pre>
                    </div>
                </section>
                
                 <section>
                    <h2 className="text-xl font-bold mb-4 border-b border-[#224922] pb-2 text-red-400">Danger Zone</h2>
                    <div className="flex gap-4 p-4 bg-red-900/10 border border-red-900/30 rounded-sm">
                        <Button variant="secondary" onClick={() => alert('Exporting...')}>Export Data (JSON)</Button>
                        <button className="px-4 py-2 bg-red-900/20 text-red-400 border border-red-900/50 rounded-sm hover:bg-red-900/40 font-bold text-sm">Delete Account</button>
                    </div>
                </section>
            </div>
        </div>
    );
};
