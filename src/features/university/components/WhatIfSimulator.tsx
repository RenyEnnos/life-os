import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Calculator, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Course } from '../types';
import { clsx } from 'clsx';
import { animate } from 'animejs';

interface WhatIfSimulatorProps {
    courses: Course[];
}

export function WhatIfSimulator({ courses }: WhatIfSimulatorProps) {
    const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
    const [targetGrade, setTargetGrade] = useState<number>(7.0);
    const [result, setResult] = useState<{ required: number; difficulty: 'easy' | 'medium' | 'hard' | 'impossible' } | null>(null);

    const handleSimulate = () => {
        const course = courses.find(c => c.id === selectedCourseId);
        if (!course) return;

        const currentGrade = course.grade || 0;
        // Mock assumption: 40% of grade is remaining
        const remainingWeight = 0.4;
        const currentWeight = 0.6;

        // Formula: Target = (Current * CurrentWeight) + (Required * RemainingWeight)
        // Required = (Target - (Current * CurrentWeight)) / RemainingWeight
        // Simplified Logic for Demo:

        // Let's assume 'grade' in course is the CURRENT average. 
        // We need to know 'how much is worth remaining'.
        // For simplicity: We want to maintain 'targetGrade' as the Final Grade.
        // If we have 60% completed with 'currentGrade', what do we need on the 40%?

        const alreadyAchieved = currentGrade * currentWeight;
        const neededTotal = targetGrade;
        const neededFromRemaining = neededTotal - alreadyAchieved;
        const requiredScore = neededFromRemaining / remainingWeight;

        let difficulty: 'easy' | 'medium' | 'hard' | 'impossible' = 'medium';
        if (requiredScore > 10) difficulty = 'impossible';
        else if (requiredScore > 9) difficulty = 'hard';
        else if (requiredScore < 6) difficulty = 'easy';

        setResult({
            required: parseFloat(requiredScore.toFixed(1)),
            difficulty
        });
    };

    return (
        <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                    <Calculator size={20} />
                    What-If Simulator
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-mono text-zinc-500 mb-1">COURSE</label>
                        <select
                            className="w-full bg-zinc-800 border-zinc-700 rounded p-2 text-sm text-white focus:ring-purple-500"
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                        >
                            {courses.map(c => (
                                <option key={c.id} value={c.id}>{c.name} (Curr: {c.grade})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-zinc-500 mb-1">TARGET FINAL GRADE</label>
                        <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={targetGrade}
                            onChange={(e) => setTargetGrade(parseFloat(e.target.value))}
                            className="w-full bg-zinc-800 border-zinc-700 rounded p-2 text-sm text-white focus:ring-purple-500"
                        />
                    </div>
                </div>

                <Button onClick={handleSimulate} className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-2">
                    <Sparkles size={16} />
                    Calculate Required Score
                </Button>

                {result && (
                    <div className="mt-4 p-4 bg-black/20 rounded-lg border border-purple-500/20 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-400 text-sm">You need to score:</span>
                            <span className={clsx("text-2xl font-bold font-mono",
                                result.difficulty === 'impossible' ? 'text-red-500' :
                                    result.difficulty === 'hard' ? 'text-orange-500' :
                                        result.difficulty === 'easy' ? 'text-green-500' : 'text-yellow-500'
                            )}>
                                {result.difficulty === 'impossible' ? '> 10.0' : result.required}
                            </span>
                        </div>

                        <div className="mt-2 flex gap-2 items-start text-xs text-zinc-500">
                            <AlertCircle size={14} className="mt-0.5 shrink-0" />
                            <p>
                                {result.difficulty === 'impossible' ? "Mathematically impossible with current weight distribution. Extra credit needed." :
                                    result.difficulty === 'hard' ? "High active study mode required. Focus on this subject." :
                                        result.difficulty === 'easy' ? "You are consistent. Maintain current effort." :
                                            "Achievable with standard preparation."}
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
