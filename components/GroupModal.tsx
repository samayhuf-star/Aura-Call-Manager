import React, { useState, useEffect, useMemo } from 'react';
import { TargetGroup, Target } from '../types';
import { XIcon, PlusIcon, TrashIcon, DragHandleIcon } from './icons/UIIcons';

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (group: TargetGroup) => void;
  group: TargetGroup | null;
  targets: Target[];
}

const GroupModal: React.FC<GroupModalProps> = ({ isOpen, onClose, onSave, group, targets }) => {
  const [formData, setFormData] = useState<Partial<TargetGroup>>({ name: '', targets: [] });
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(group || { name: '', targets: [{ targetId: targets[0]?.id || '', weight: 100 }] });
    }
  }, [group, isOpen, targets]);
  
  const totalWeight = useMemo(() => {
    return (formData.targets || []).reduce((sum, t) => sum + Number(t.weight || 0), 0);
  }, [formData.targets]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTargetChange = (index: number, field: 'targetId' | 'weight', value: string | number) => {
    const newTargets = [...(formData.targets || [])];
    if(field === 'targetId') {
      newTargets[index].targetId = value as string;
    } else {
      newTargets[index].weight = Number(value);
    }
    setFormData(prev => ({ ...prev, targets: newTargets }));
  };

  const addTarget = () => {
      const newTargets = [...(formData.targets || []), { targetId: '', weight: 0 }];
      setFormData(prev => ({...prev, targets: newTargets}));
  }
  
  const removeTarget = (index: number) => {
      const newTargets = [...(formData.targets || [])];
      newTargets.splice(index, 1);
      setFormData(prev => ({...prev, targets: newTargets}));
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newTargets = [...(formData.targets || [])];
    const draggedItem = newTargets[draggedIndex];
    
    // Remove from original position
    newTargets.splice(draggedIndex, 1);
    // Insert at new position
    newTargets.splice(dropIndex, 0, draggedItem);
    
    setFormData(prev => ({...prev, targets: newTargets}));
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(totalWeight !== 100) {
        alert('Total weight for all targets must equal 100.');
        return;
    }
    onSave(formData as TargetGroup);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300" aria-modal="true" role="dialog">
      <form onSubmit={handleSubmit} className="bg-background-card rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <div className="flex justify-between items-center p-6 border-b border-border-color">
          <h2 className="text-xl font-bold text-text-primary">
            {group ? 'Edit Target Group' : 'Create New Target Group'}
          </h2>
          <button type="button" onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Group Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full bg-background-light border border-border-color rounded-lg p-2 focus:ring-2 focus:ring-brand-primary outline-none" required />
          </div>
          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-2">Targets & Weighting</h4>
            <div className="space-y-2">
                {(formData.targets || []).map((t, index) => (
                    <div 
                        key={index} 
                        className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${draggedIndex === index ? 'bg-brand-primary/20' : 'bg-background-light'}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="cursor-move text-text-secondary/50 hover:text-text-secondary">
                          <DragHandleIcon className="w-5 h-5" />
                        </div>
                        <select
                            value={t.targetId}
                            onChange={(e) => handleTargetChange(index, 'targetId', e.target.value)}
                            className="flex-1 bg-background-dark border border-border-color rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                        >
                            <option value="">Select a target</option>
                            {targets.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                        </select>
                        <input
                            type="number"
                            value={t.weight}
                            onChange={(e) => handleTargetChange(index, 'weight', e.target.value)}
                            className="w-20 bg-background-dark border border-border-color rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                            placeholder="%"
                            min="0" max="100"
                        />
                        <button type="button" onClick={() => removeTarget(index)} className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-full">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
            <button type="button" onClick={addTarget} className="mt-2 flex items-center text-sm text-brand-secondary hover:text-brand-primary">
                <PlusIcon className="w-4 h-4 mr-1"/> Add Target
            </button>

            <div className={`mt-4 text-sm font-semibold text-right ${totalWeight === 100 ? 'text-green-400' : 'text-red-400'}`}>
                Total Weight: {totalWeight}%
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center p-6 bg-background-light rounded-b-xl space-x-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-background-card border border-border-color hover:bg-border-color text-text-primary font-semibold rounded-lg transition-all duration-300">
            Cancel
          </button>
          <button 
            type="submit"
            disabled={totalWeight !== 100} 
            className="px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold rounded-lg shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Group
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

export default GroupModal;
