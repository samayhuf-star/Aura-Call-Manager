import React, { useState, useMemo } from 'react';
import { RoutingRule, TargetGroup, Target } from '../types';
import { mockTargets } from '../data/mockData';
import { PlusIcon, EditIcon, TrashIcon, BeakerIcon, DragHandleIcon } from './icons/UIIcons';
import GroupModal from './GroupModal';
import RuleModal from './RuleModal';
import TestRuleModal from './TestRuleModal';

const initialGroups: TargetGroup[] = [
  { id: 'tg1', name: 'Weekday Sales', targets: [{ targetId: 't1', weight: 60 }, { targetId: 't2', weight: 40 }] },
  { id: 'tg2', name: 'After-Hours', targets: [{ targetId: 't4', weight: 100 }] },
  { id: 'tg3', name: 'West Coast Only', targets: [{ targetId: 't2', weight: 100 }] },
];

const initialRules: RoutingRule[] = [
  { id: 'r1', priority: 1, criteria: [{ type: 'DayOfWeek', value: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] }, { type: 'TimeOfDay', value: { from: '09:00', to: '17:00' } }], action: 'RouteTo', actionValue: 'tg1' },
  { id: 'r3', priority: 2, criteria: [{ type: 'CallerID', value: '(555) 867-5309'}], action: 'Block', actionValue: ''},
  { id: 'r2', priority: 3, criteria: [], action: 'RouteTo', actionValue: 'tg2' },
];

const CallRouting: React.FC = () => {
    const [rules, setRules] = useState<RoutingRule[]>(initialRules);
    const [groups, setGroups] = useState<TargetGroup[]>(initialGroups);
    const [targets] = useState<Target[]>(mockTargets);

    const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isTestModalOpen, setIsTestModalOpen] = useState(false);
    
    const [editingRule, setEditingRule] = useState<RoutingRule | null>(null);
    const [editingGroup, setEditingGroup] = useState<TargetGroup | null>(null);
    const [draggedRuleId, setDraggedRuleId] = useState<string | null>(null);

    const groupMap = useMemo(() => new Map(groups.map(g => [g.id, g.name])), [groups]);
    
    const handleSaveRule = (ruleData: RoutingRule) => {
        let intermediateRules: RoutingRule[];
        const isEditing = !!ruleData.id;

        if (isEditing) {
            intermediateRules = rules.filter(r => r.id !== ruleData.id);
        } else {
            intermediateRules = [...rules];
        }
        
        const ruleToInsert = isEditing ? ruleData : { ...ruleData, id: `r${Date.now()}` };
        const clampedPriority = Math.max(1, Math.min(intermediateRules.length + 1, ruleToInsert.priority));
        intermediateRules.splice(clampedPriority - 1, 0, ruleToInsert);
        
        const finalRules = intermediateRules.map((rule, index) => ({
            ...rule,
            priority: index + 1
        }));
        
        setRules(finalRules);
        setIsRuleModalOpen(false);
        setEditingRule(null);
    };

    const handleSaveGroup = (groupData: TargetGroup) => {
        if (groupData.id) {
            setGroups(groups.map(g => g.id === groupData.id ? groupData : g));
        } else {
            const newGroup = { ...groupData, id: `tg${Date.now()}` };
            setGroups([...groups, newGroup]);
        }
        setIsGroupModalOpen(false);
        setEditingGroup(null);
    };

    const handleDeleteRule = (id: string) => {
        setRules(rules.filter(r => r.id !== id).map((rule, index) => ({...rule, priority: index + 1})));
    };
    
    const handleDeleteGroup = (id: string) => {
        if(rules.some(r => r.actionValue === id)) {
            alert("Cannot delete a target group that is currently used in a routing rule.");
            return;
        }
        setGroups(groups.filter(g => g.id !== id));
    };
    
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, rule: RoutingRule) => {
        setDraggedRuleId(rule.id);
        e.dataTransfer.effectAllowed = 'move';
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetRule: RoutingRule) => {
        e.preventDefault();
        if (!draggedRuleId || draggedRuleId === targetRule.id) {
            setDraggedRuleId(null);
            return;
        }
    
        let updatedRules = [...rules];
        const draggedIndex = updatedRules.findIndex(r => r.id === draggedRuleId);
        const targetIndex = updatedRules.findIndex(r => r.id === targetRule.id);
    
        const [draggedItem] = updatedRules.splice(draggedIndex, 1);
        updatedRules.splice(targetIndex, 0, draggedItem);
        
        const finalRules = updatedRules.map((rule, index) => ({
            ...rule,
            priority: index + 1,
        }));
    
        setRules(finalRules);
        setDraggedRuleId(null);
    };
    
    return (
        <>
            <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-background-light min-h-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">Call Routing</h1>
                        <p className="text-text-secondary mt-1">Define rules to route incoming calls to the correct targets.</p>
                    </div>
                    <button onClick={() => setIsTestModalOpen(true)} className="mt-4 sm:mt-0 flex items-center justify-center px-4 py-2 bg-brand-secondary hover:bg-brand-primary text-white font-semibold rounded-lg shadow-md transition-all duration-300">
                        <BeakerIcon className="w-5 h-5 mr-2"/>
                        Test Rules
                    </button>
                </div>
                
                {/* Routing Rules */}
                <div className="bg-background-card p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-text-primary">Routing Rules</h3>
                         <button onClick={() => { setEditingRule(null); setIsRuleModalOpen(true); }} className="flex items-center text-sm text-brand-secondary hover:text-brand-primary">
                            <PlusIcon className="w-5 h-5 mr-1"/> Add Rule
                        </button>
                    </div>
                    <div className="space-y-3">
                        {rules.map((rule) => (
                            <div 
                                key={rule.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, rule)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, rule)}
                                onDragEnd={() => setDraggedRuleId(null)}
                                className={`flex items-center bg-background-light p-3 rounded-lg transition-opacity ${draggedRuleId === rule.id ? 'opacity-50' : 'opacity-100'}`}
                            >
                                <DragHandleIcon className="w-5 h-5 text-text-secondary/50 cursor-grab mr-3"/>
                                <div className="w-16 flex-shrink-0 text-center text-lg font-bold text-text-secondary mr-4">{rule.priority}</div>
                                <div className="flex-1">
                                    <p className="font-semibold text-text-primary">
                                        {rule.action === 'Block' 
                                            ? <span className="text-red-400">Block Call</span>
                                            : `Route to "${groupMap.get(rule.actionValue) || 'N/A'}"`
                                        }
                                    </p>
                                    <p className="text-xs text-text-secondary mt-1">
                                        {rule.criteria.length > 0 ? `${rule.criteria.length} criteria` : 'All calls'}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => { setEditingRule(rule); setIsRuleModalOpen(true); }} className="p-2 text-text-secondary hover:bg-border-color hover:text-brand-primary rounded-full"><EditIcon /></button>
                                    <button onClick={() => handleDeleteRule(rule.id)} className="p-2 text-text-secondary hover:bg-border-color hover:text-red-500 rounded-full"><TrashIcon /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Target Groups */}
                <div className="bg-background-card p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-text-primary">Target Groups</h3>
                        <button onClick={() => { setEditingGroup(null); setIsGroupModalOpen(true); }} className="flex items-center text-sm text-brand-secondary hover:text-brand-primary">
                            <PlusIcon className="w-5 h-5 mr-1"/> Add Group
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-xs text-text-secondary uppercase bg-background-light">
                                <tr>
                                    <th className="p-4">Group Name</th>
                                    <th className="p-4">Targets</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groups.map((group) => (
                                    <tr key={group.id} className="border-b border-border-color hover:bg-background-light">
                                        <td className="p-4 text-sm font-medium text-text-primary">{group.name}</td>
                                        <td className="p-4 text-sm text-text-secondary">{group.targets.length}</td>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-2">
                                                <button onClick={() => { setEditingGroup(group); setIsGroupModalOpen(true); }} className="p-2 text-text-secondary hover:bg-border-color hover:text-brand-primary rounded-full"><EditIcon /></button>
                                                <button onClick={() => handleDeleteGroup(group.id)} className="p-2 text-text-secondary hover:bg-border-color hover:text-red-500 rounded-full"><TrashIcon /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <RuleModal
                isOpen={isRuleModalOpen}
                onClose={() => setIsRuleModalOpen(false)}
                onSave={handleSaveRule}
                rule={editingRule}
                groups={groups}
                nextPriority={rules.length + 1}
            />
            
            <GroupModal
                isOpen={isGroupModalOpen}
                onClose={() => setIsGroupModalOpen(false)}
                onSave={handleSaveGroup}
                group={editingGroup}
                targets={targets}
            />

            <TestRuleModal
                isOpen={isTestModalOpen}
                onClose={() => setIsTestModalOpen(false)}
                rules={rules}
                groups={groups}
                targets={targets}
            />
        </>
    );
};

export default CallRouting;
