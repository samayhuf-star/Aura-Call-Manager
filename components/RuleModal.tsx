import React, { useState, useEffect } from 'react';
import { RoutingRule, TargetGroup } from '../types';
import { XIcon, PlusIcon, TrashIcon } from './icons/UIIcons';

interface RuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: RoutingRule) => void;
  rule: RoutingRule | null;
  groups: TargetGroup[];
  nextPriority: number;
}

const WEEK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const defaultRule: Omit<RoutingRule, 'id'> = {
    priority: 0,
    criteria: [],
    action: 'RouteTo',
    actionValue: ''
};

const RuleModal: React.FC<RuleModalProps> = ({ isOpen, onClose, onSave, rule, groups, nextPriority }) => {
  const [formData, setFormData] = useState<Partial<RoutingRule>>(defaultRule);

  useEffect(() => {
    if (isOpen) {
      if (rule) {
        setFormData(rule);
      } else {
        setFormData({ ...defaultRule, priority: nextPriority, actionValue: groups[0]?.id || '' });
      }
    }
  }, [rule, isOpen, groups, nextPriority]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'action' && value === 'Block') {
        setFormData(prev => ({ ...prev, action: value, actionValue: '' }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newPriority = parseInt(e.target.value, 10);
    if (isNaN(newPriority)) {
        newPriority = nextPriority;
    }
    setFormData(prev => ({...prev, priority: newPriority}));
  };
  
  const addCriterion = () => {
      const newCriterion = { type: 'DayOfWeek' as const, value: [] };
      setFormData(prev => ({...prev, criteria: [...(prev.criteria || []), newCriterion]}));
  };
  
  const removeCriterion = (index: number) => {
      setFormData(prev => ({...prev, criteria: (prev.criteria || []).filter((_, i) => i !== index)}));
  };

  const updateCriterion = (index: number, field: 'type' | 'value', value: any) => {
      const newCriteria = [...(formData.criteria || [])];
      if (field === 'type') {
          let initialValue: any;
          switch (value) {
            case 'DayOfWeek':
              initialValue = [];
              break;
            case 'TimeOfDay':
              initialValue = { from: '09:00', to: '17:00' };
              break;
            case 'CallerID':
              initialValue = '';
              break;
            default:
              initialValue = null;
          }
          newCriteria[index] = { type: value, value: initialValue };
      } else {
          newCriteria[index].value = value;
      }
      setFormData(prev => ({...prev, criteria: newCriteria}));
  };
  
  const handleDayToggle = (critIndex: number, day: string) => {
    const currentDays: string[] = formData.criteria?.[critIndex].value || [];
    const newDays = currentDays.includes(day) ? currentDays.filter(d => d !== day) : [...currentDays, day];
    updateCriterion(critIndex, 'value', newDays);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as RoutingRule);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300" aria-modal="true" role="dialog">
      <form onSubmit={handleSubmit} className="bg-background-card rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <div className="flex justify-between items-center p-6 border-b border-border-color">
          <h2 className="text-xl font-bold text-text-primary">
            {rule ? 'Edit Routing Rule' : 'Create New Routing Rule'}
          </h2>
          <button type="button" onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Priority */}
            <div>
                 <label htmlFor="priority" className="block text-sm font-medium text-text-primary mb-1">Priority</label>
                 <p className="text-xs text-text-secondary mb-2">Set the execution order for this rule. 1 is highest.</p>
                 <input
                    type="number"
                    id="priority"
                    name="priority"
                    value={formData.priority || ''}
                    onChange={handlePriorityChange}
                    className="w-24 bg-background-light border border-border-color rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                    min="1"
                    max={rule ? nextPriority - 1 : nextPriority}
                    required
                />
            </div>

            {/* Criteria Section */}
            <div>
                <h3 className="text-base font-semibold text-text-primary mb-2">IF the following criteria match:</h3>
                <div className="space-y-3 bg-background-light p-4 rounded-lg">
                    {(formData.criteria || []).map((crit, index) => (
                        <div key={index} className="bg-background-dark p-3 rounded-md border border-border-color">
                            <div className="flex items-center justify-between mb-3">
                                <select value={crit.type} onChange={(e) => updateCriterion(index, 'type', e.target.value)} className="bg-background-light border border-border-color rounded-md p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none">
                                    <option value="DayOfWeek">Day of Week</option>
                                    <option value="TimeOfDay">Time of Day</option>
                                    <option value="CallerID">Caller ID</option>
                                </select>
                                <button type="button" onClick={() => removeCriterion(index)} className="p-1 text-red-400 hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>
                            </div>
                            {crit.type === 'DayOfWeek' && (
                                <div className="flex flex-wrap gap-2">
                                    {WEEK_DAYS.map(day => (
                                        <button key={day} type="button" onClick={() => handleDayToggle(index, day)} className={`px-2.5 py-1.5 text-xs rounded-full border transition-colors ${crit.value.includes(day) ? 'bg-brand-primary border-brand-primary text-white' : 'bg-background-light border-border-color text-text-secondary hover:border-gray-500'}`}>
                                            {day.substring(0,3)}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {crit.type === 'TimeOfDay' && (
                                <div className="flex items-center gap-2">
                                    <input type="time" value={crit.value.from} onChange={e => updateCriterion(index, 'value', {...crit.value, from: e.target.value})} className="bg-background-light border border-border-color rounded-md p-2 text-sm w-full focus:ring-2 focus:ring-brand-primary outline-none" />
                                    <span className="text-text-secondary">to</span>
                                    <input type="time" value={crit.value.to} onChange={e => updateCriterion(index, 'value', {...crit.value, to: e.target.value})} className="bg-background-light border border-border-color rounded-md p-2 text-sm w-full focus:ring-2 focus:ring-brand-primary outline-none" />
                                </div>
                            )}
                            {crit.type === 'CallerID' && (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={crit.value || ''}
                                        onChange={e => updateCriterion(index, 'value', e.target.value)}
                                        className="w-full bg-background-light border border-border-color rounded-md p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                                        placeholder="e.g., (555) 123-4567 or (555)"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addCriterion} className="w-full mt-2 flex items-center justify-center p-2 text-sm border-2 border-dashed border-border-color rounded-lg text-text-secondary hover:bg-border-color hover:text-text-primary">
                        <PlusIcon className="w-4 h-4 mr-1"/> Add Criterion
                    </button>
                    {(formData.criteria?.length === 0) && <p className="text-xs text-text-secondary text-center py-2">No criteria set. This rule will apply to all calls.</p>}
                </div>
            </div>
            
            {/* Action Section */}
            <div>
                 <h3 className="text-base font-semibold text-text-primary mb-2">THEN perform this action:</h3>
                 <div className="bg-background-light p-4 rounded-lg flex items-center gap-4">
                     <select name="action" value={formData.action} onChange={handleChange} className="bg-background-dark border border-border-color rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none">
                         <option value="RouteTo">Route To</option>
                         <option value="Block">Block Call</option>
                     </select>
                     {formData.action === 'RouteTo' && (
                        <select name="actionValue" value={formData.actionValue} onChange={handleChange} className="w-full bg-background-dark border border-border-color rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none">
                            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </select>
                     )}
                 </div>
            </div>
        </div>

        <div className="flex justify-end items-center p-6 bg-background-light rounded-b-xl space-x-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-background-card border border-border-color hover:bg-border-color text-text-primary font-semibold rounded-lg transition-all duration-300">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold rounded-lg shadow-md transition-all duration-300">
            Save Rule
          </button>
        </div>
      </form>
      <style>{`
        @keyframes fadeInScale { from { opacity: 0; transform: scale(.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in-scale { animation: fadeInScale 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default RuleModal;
