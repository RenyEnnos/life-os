import { useAccessibilityStore } from '@/shared/stores/accessibilityStore';

type AccessibilityPreferenceKey = 'reducedMotion' | 'highContrast';

interface AccessibilitySettingsProps {
    className?: string;
}

// Font size percentage mapping
const FONT_SIZE_PERCENTAGES: Record<string, number> = {
    'small': 85,
    'medium': 100,
    'large': 115,
    'extra-large': 130,
};

// Reverse mapping from percentage to store value
const PERCENTAGE_TO_FONT_SIZE: Record<number, string> = {
    85: 'small',
    100: 'medium',
    115: 'large',
    130: 'extra-large',
};

export default function AccessibilitySettings({ className = '' }: AccessibilitySettingsProps) {
    const { reducedMotion, highContrast, fontSize, toggleReducedMotion, toggleHighContrast, setFontSize } = useAccessibilityStore();

    const currentFontSizePercentage = FONT_SIZE_PERCENTAGES[fontSize] || 100;

    const accessibilityList = [
        {
            key: 'reducedMotion' as AccessibilityPreferenceKey,
            title: 'Reduced Motion',
            description: 'Minimize animations and transitions throughout the interface.',
        },
        {
            key: 'highContrast' as AccessibilityPreferenceKey,
            title: 'High Contrast',
            description: 'Increase color contrast for better readability.',
        },
    ];

    const handleToggle = (key: AccessibilityPreferenceKey) => {
        if (key === 'reducedMotion') {
            toggleReducedMotion();
        } else if (key === 'highContrast') {
            toggleHighContrast();
        }
    };

    const handleFontSizeChange = (value: number) => {
        const fontSizeValue = PERCENTAGE_TO_FONT_SIZE[value] as 'small' | 'medium' | 'large' | 'extra-large';
        if (fontSizeValue) {
            setFontSize(fontSizeValue);
        }
    };

    return (
        <div className={className}>
            <div className="bg-glass-surface backdrop-blur-xl border border-glass-border rounded-2xl p-6 lg:p-8 flex flex-col gap-8 shadow-2xl">
                <div>
                    <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-6">Accessibility</h3>
                    <div className="flex flex-col gap-6">
                        {accessibilityList.map((pref) => (
                            <div key={pref.key} className="flex items-center justify-between gap-4">
                                <div className="flex flex-col gap-1 pr-4">
                                    <span className="text-sm font-medium text-white">{pref.title}</span>
                                    <span className="text-xs text-zinc-500">{pref.description}</span>
                                </div>
                                <label className="flex items-center cursor-pointer relative" htmlFor={pref.key}>
                                    <input
                                        className="sr-only peer"
                                        id={pref.key}
                                        type="checkbox"
                                        checked={pref.key === 'reducedMotion' ? reducedMotion : highContrast}
                                        onChange={() => handleToggle(pref.key)}
                                    />
                                    <div className="w-12 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner transition-colors duration-300" />
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full h-px bg-white/5" />

                <div>
                    <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-6">Display</h3>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1 pr-4">
                            <span className="text-sm font-medium text-white">Font Size</span>
                            <span className="text-xs text-zinc-500">Adjust the base font size percentage for better readability.</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-zinc-500 font-medium">85%</span>
                            <input
                                type="range"
                                min="85"
                                max="130"
                                step="5"
                                value={currentFontSizePercentage}
                                onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                                className="flex-1 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all"
                            />
                            <span className="text-xs text-zinc-500 font-medium">130%</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-zinc-600">Current size: {currentFontSizePercentage}%</span>
                            <button
                                onClick={() => setFontSize('medium')}
                                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                            >
                                Reset to default
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
