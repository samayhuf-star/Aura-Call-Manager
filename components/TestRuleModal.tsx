import React, { useState } from 'react';
import { TargetGroup, Target, RoutingRule } from '../types';
import { XIcon, BeakerIcon } from './icons/UIIcons';

interface TestRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  rules: RoutingRule[];
  groups: TargetGroup[];
  targets: Target[];
}

interface SimulationResult {
    matchedRule: RoutingRule | null;
    routedGroup: TargetGroup | null;
    routedTarget: Target | null;
    message: string;
}

const TestRuleModal: React.FC<TestRuleModalProps> = ({ isOpen, onClose, rules, groups, targets }) => {
  const [testTime, setTestTime] = useState(new Date().toTimeString().substring(0, 5));
  const [testDay, setTestDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }));
  const [testCallerId, setTestCallerId] = useState('');
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  const groupMap = new Map<string, TargetGroup>(groups.map(g => [g.id, g]));
  const targetMap = new Map<string, Target>(targets.map(t => [t.id, t]));

  const handleRunTest = () => {
    // --- Simulation Logic ---

    let matchedRule: RoutingRule | null = null;

    // 1. Iterate through rules by priority
    for (const rule of rules) {
        let allCriteriaMet = true;

        if (rule.criteria.length > 0) {
            // 2. Check each criterion for the current rule
            for (const criterion of rule.criteria) {
                if (criterion.type === 'TimeOfDay') {
                    const { from, to } = criterion.value;
                    const testTimeNum = parseInt(testTime.replace(':', ''), 10);
                    const fromNum = parseInt(from.replace(':', ''), 10);
                    const toNum = parseInt(to.replace(':', ''), 10);

                    // Handle overnight ranges (e.g., 17:00 to 09:00)
                    if (fromNum > toNum) {
                        if (!(testTimeNum >= fromNum || testTimeNum < toNum)) {
                            allCriteriaMet = false;
                            break;
                        }
                    } else { // Handle same-day ranges
                        if (!(testTimeNum >= fromNum && testTimeNum < toNum)) {
                            allCriteriaMet = false;
                            break;
                        }
                    }
                }

                if (criterion.type === 'DayOfWeek') {
                    if (!criterion.value.includes(testDay)) {
                        allCriteriaMet = false;
                        break;
                    }
                }

                if (criterion.type === 'CallerID') {
                    const pattern = criterion.value;
                    // A CallerID rule requires a pattern to be set in the rule.
                    if (!pattern) {
                        allCriteriaMet = false;
                        break;
                    }
                    // The test caller ID must start with the specified pattern.
                    if (!testCallerId.startsWith(pattern)) {
                        allCriteriaMet = false;
                        break;
                    }
                }
            }
        }
        
        // 3. If all criteria for this rule are met, we have a match
        if (allCriteriaMet) {
            matchedRule = rule;
            break; // Stop checking rules
        }
    }
    
    // 4. Process the match
    if (matchedRule) {
        const routedGroup = groupMap.get(matchedRule.actionValue) || null;
        let routedTarget: Target | null = null;
        let message = `Call matched Rule #${matchedRule.priority}.`;

        if(routedGroup) {
            // 5. Simulate weighted routing to find a specific target
            let sum = 0;
            const rand = Math.random() * 100; // Random number between 0 and 100
            
            for (const weightedTarget of routedGroup.targets) {
                sum += weightedTarget.weight;
                if (rand < sum) {
                    routedTarget = targetMap.get(weightedTarget.targetId) || null;
                    break;
                }
            }
        }
        setSimulationResult({ matchedRule, routedGroup, routedTarget, message });

    } else {
        setSimulationResult({ matchedRule: null, routedGroup: null, routedTarget: null, message: 'No matching rule found for these criteria. The call would be rejected.' });
    }
  };
  
  const handleClose = () => {
    setSimulationResult(null);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300" aria-modal="true" role="dialog">
      <div className="bg-background-card rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <div className="flex justify-between items-center p-6 border-b border-border-color">
          <h2 className="text-xl font-bold text-text-primary">Test Call Routing</h2>
          <button type="button" onClick={handleClose} className="text-text-secondary hover:text-text-primary">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
            <p className="text-sm text-text-secondary">Simulate an incoming call with the following criteria to see how it will be routed.</p>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="testTime" className="block text-sm font-medium text-text-secondary mb-1">Time of Day (24hr)</label>
                    <input type="time" id="testTime" value={testTime} onChange={e => setTestTime(e.target.value)} className="w-full bg-background-light border border-border-color rounded-lg p-2 focus:ring-2 focus:ring-brand-primary outline-none" />
                </div>
                <div>
                    <label htmlFor="testDay" className="block text-sm font-medium text-text-secondary mb-1">Day of Week</label>
                    <select id="testDay" value={testDay} onChange={e => setTestDay(e.target.value)} className="w-full bg-background-light border border-border-color rounded-lg p-2 focus:ring-2 focus:ring-brand-primary outline-none">
                        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor="testCallerId" className="block text-sm font-medium text-text-secondary mb-1">Caller ID</label>
                <input
                    type="text"
                    id="testCallerId"
                    value={testCallerId}
                    onChange={e => setTestCallerId(e.target.value)}
                    className="w-full bg-background-light border border-border-color rounded-lg p-2 focus:ring-2 focus:ring-brand-primary outline-none"
                    placeholder="Enter a test phone number"
                />
            </div>

            <button onClick={handleRunTest} className="w-full mt-2 flex items-center justify-center px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold rounded-lg shadow-md transition-all duration-300">
                <BeakerIcon className="w-5 h-5 mr-2" />
                Run Test
            </button>

            {simulationResult && (
                 <div className="mt-4 pt-4 border-t border-border-color">
                    <h3 className="text-lg font-semibold text-text-primary mb-3">Simulation Result</h3>
                    <div className="bg-background-light p-4 rounded-lg space-y-2 text-sm">
                        <p className="text-text-primary">{simulationResult.message}</p>
                        {simulationResult.routedGroup && (
                            <p>➡️ Routed to Group: <span className="font-semibold text-brand-secondary">{simulationResult.routedGroup.name}</span></p>
                        )}
                         {simulationResult.routedTarget && (
                            <p>🎯 Final Destination: <span className="font-semibold text-brand-secondary">{simulationResult.routedTarget.name}</span></p>
                        )}
                    </div>
                </div>
            )}
        </div>

        <div className="flex justify-end items-center p-6 bg-background-light rounded-b-xl">
          <button type="button" onClick={handleClose} className="px-4 py-2 bg-background-card border border-border-color hover:bg-border-color text-text-primary font-semibold rounded-lg transition-all duration-300">
            Close
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeInScale { from { opacity: 0; transform: scale(.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in-scale { animation: fadeInScale 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default TestRuleModal;
