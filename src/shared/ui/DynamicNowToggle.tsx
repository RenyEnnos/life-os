import { motion } from 'framer-motion';
import { Sparkles, Eye, EyeOff } from 'lucide-react';
import { useDynamicNowStore } from '../stores/dynamicNowStore';

interface DynamicNowToggleProps {
    hiddenCount?: number;
    hiddenReason?: string | null;
}

/**
 * Dynamic Now Toggle Component
 * 
 * Shows a toggle switch to enable/disable Dynamic Now filtering,
 * along with information about hidden tasks when applicable.
 */
export function DynamicNowToggle({ hiddenCount = 0, hiddenReason }: DynamicNowToggleProps) {
    const { isEnabled, showHiddenTasks, toggle, toggleShowHidden } = useDynamicNowStore();

    return (
        <div className="dynamic-now-toggle">
            <div className="dynamic-now-toggle-header">
                <button
                    onClick={toggle}
                    className={`dynamic-now-switch ${isEnabled ? 'enabled' : ''}`}
                    aria-label={isEnabled ? 'Disable Dynamic Now' : 'Enable Dynamic Now'}
                >
                    <motion.div
                        className="dynamic-now-switch-thumb"
                        animate={{ x: isEnabled ? 20 : 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                </button>
                <div className="dynamic-now-label">
                    <Sparkles size={14} className="dynamic-now-icon" />
                    <span>Dynamic Now</span>
                </div>
            </div>

            {isEnabled && hiddenCount > 0 && hiddenReason && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="dynamic-now-info"
                >
                    <span className="dynamic-now-reason">{hiddenReason}</span>
                    <button
                        onClick={toggleShowHidden}
                        className="dynamic-now-show-btn"
                        aria-label={showHiddenTasks ? 'Hide tasks' : 'Show hidden tasks'}
                    >
                        {showHiddenTasks ? (
                            <><EyeOff size={12} /> Hide</>
                        ) : (
                            <><Eye size={12} /> Show</>
                        )}
                    </button>
                </motion.div>
            )}

            <style>{`
        .dynamic-now-toggle {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
        }

        .dynamic-now-toggle-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .dynamic-now-switch {
          position: relative;
          width: 44px;
          height: 24px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .dynamic-now-switch.enabled {
          background: var(--color-success, #2e9f73);
        }

        .dynamic-now-switch-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 18px;
          height: 18px;
          background: white;
          border-radius: 50%;
        }

        .dynamic-now-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--color-text);
        }

        .dynamic-now-icon {
          color: var(--color-text-muted);
        }

        .dynamic-now-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .dynamic-now-reason {
          font-size: 11px;
          color: var(--color-text-muted);
        }

        .dynamic-now-show-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: var(--color-text-muted);
          background: rgba(255, 255, 255, 0.06);
          border: none;
          border-radius: 4px;
          padding: 4px 8px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .dynamic-now-show-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--color-text);
        }
      `}</style>
        </div>
    );
}

export default DynamicNowToggle;
