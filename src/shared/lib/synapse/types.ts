import { LucideIcon } from 'lucide-react';

export type SynapseGroup = 'actions' | 'missions' | 'rituals' | 'resources' | 'memory' | 'nexus';

export interface SynapseCommand {
    id: string;
    label: string;
    description?: string;
    icon?: LucideIcon;
    group: SynapseGroup;
    shortcut?: string[];
    action: () => void;
    keywords?: string[];
}

export interface SynapsePattern {
    id: string;
    regex: RegExp;
    groups: string[];
    handler: (matches: RegExpMatchArray) => SynapseAction;
}

export interface SynapseAction {
    type: string;
    payload: Record<string, unknown>;
}

export const SYNAPSE_GROUP_LABELS: Record<SynapseGroup, string> = {
    actions: 'Actions',
    missions: 'Missions',
    rituals: 'Rituals',
    resources: 'Resources',
    memory: 'Memory',
    nexus: 'Nexus',
};

export const SYNAPSE_GROUP_ORDER: SynapseGroup[] = [
    'actions',
    'missions',
    'rituals',
    'resources',
    'memory',
    'nexus',
];
