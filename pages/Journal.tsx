import React from 'react';
import { Card, Button, Badge } from '../components/Widgets';

export const Journal: React.FC = () => {
    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
            {/* Sidebar List */}
            <div className="w-full lg:w-1/3 flex flex-col gap-4">
                <div>
                    <h1 className="text-white text-4xl font-black tracking-tighter font-display mb-2">Journal</h1>
                    <p className="text-primary text-sm font-mono">Build your knowledge base.</p>
                </div>
                
                <Card className="flex-1 overflow-hidden flex flex-col p-4 bg-[#142e14]/50">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold">Entries</h3>
                        <Button variant="ghost" icon="add">New</Button>
                    </div>
                    <div className="flex flex-col gap-2 overflow-y-auto pr-2">
                        {[
                            { title: 'Morning Standup Notes', preview: 'Discussed Q4 goals...', time: '10:05 AM', active: true },
                            { title: 'Lunch with Alex', preview: 'Brainstormed marketing...', time: '1:30 PM', active: false },
                            { title: 'Evening Reflection', preview: 'Reflecting on achievements...', time: '9:00 PM', active: false },
                        ].map((entry, i) => (
                            <div key={i} className={`p-3 rounded-sm border cursor-pointer transition-all ${entry.active ? 'bg-[#224922] border-primary' : 'bg-[#102310] border-transparent hover:border-[#224922]'}`}>
                                <div className="flex justify-between mb-1">
                                    <h4 className={`font-bold text-sm ${entry.active ? 'text-white' : 'text-white/80'}`}>{entry.title}</h4>
                                    <span className="text-[10px] font-mono text-white/40">{entry.time}</span>
                                </div>
                                <p className="text-xs text-white/50 truncate">{entry.preview}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Editor Area */}
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
                <Card className="flex-1 flex flex-col p-6 bg-[#142e14]/50 border-white/5 relative">
                    <div className="absolute top-0 right-0 p-4 flex gap-2">
                        <span className="text-xs font-mono text-white/30">Markdown Supported</span>
                    </div>
                    <input 
                        type="text" 
                        defaultValue="Morning Standup Notes" 
                        className="bg-transparent text-3xl font-bold text-white border-0 border-b border-[#224922] focus:border-primary focus:ring-0 px-0 pb-2 mb-4 font-display" 
                    />
                    
                    <div className="flex gap-2 mb-4 pb-2 border-b border-[#224922]">
                        {['format_bold', 'format_italic', 'format_list_bulleted', 'link'].map(icon => (
                            <button key={icon} className="p-1.5 rounded-sm hover:bg-white/5 text-white/60 hover:text-white">
                                <span className="material-symbols-outlined text-lg">{icon}</span>
                            </button>
                        ))}
                    </div>

                    <textarea 
                        className="flex-1 bg-transparent border-none focus:ring-0 text-white/80 font-mono text-sm leading-relaxed resize-none p-0"
                        defaultValue={`Discussed Q4 goals and blockers for the new feature release.\n\n- Finalize the UI mockups by EOD.\n- **Action Item:** Sync with the backend team about API latency.`}
                    ></textarea>

                    <div className="mt-4 pt-4 border-t border-[#224922] flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-white/40 text-xs font-bold uppercase">Tags:</span>
                            <Badge color="blue">#work</Badge>
                            <Badge color="blue">#planning</Badge>
                        </div>
                    </div>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-[#102310] p-4 border border-[#224922] rounded-sm">
                        <h4 className="font-bold text-sm mb-2 text-white/80">Mood & Sentiment</h4>
                        <div className="flex gap-2">
                             <Badge color="green">Focused</Badge>
                             <Badge color="green">Productive</Badge>
                             <Badge color="purple">Creative</Badge>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};
