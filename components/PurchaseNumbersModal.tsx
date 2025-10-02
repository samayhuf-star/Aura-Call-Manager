import React, { useState, useMemo } from 'react';
import { TrackedNumber } from '../types';
import { generateAvailableNumbers } from '../data/mockData';
import { XIcon } from './icons/UIIcons';

interface PurchaseNumbersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (numbers: TrackedNumber[]) => void;
}

const PurchaseNumbersModal: React.FC<PurchaseNumbersModalProps> = ({ isOpen, onClose, onPurchase }) => {
  const [step, setStep] = useState<'search' | 'confirm'>('search');
  const [areaCode, setAreaCode] = useState('800');
  const [quantity, setQuantity] = useState(1);
  const [searchResults, setSearchResults] = useState<TrackedNumber[]>([]);
  const [selectedNumbers, setSelectedNumbers] = useState<TrackedNumber[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const PRICE_PER_NUMBER = 1.00; // $1.00 per number per month

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSearchResults(generateAvailableNumbers(areaCode, quantity));
      setSelectedNumbers([]);
      setIsLoading(false);
    }, 1000);
  };

  const handleSelectNumber = (number: TrackedNumber) => {
    setSelectedNumbers(prev => {
      const isSelected = prev.some(n => n.id === number.id);
      if (isSelected) {
        return prev.filter(n => n.id !== number.id);
      } else {
        if (prev.length < quantity) {
          return [...prev, number];
        }
      }
      return prev;
    });
  };
  
  const handleProceed = () => {
    if (selectedNumbers.length === quantity) {
      setStep('confirm');
    }
  };

  const resetState = () => {
    setStep('search');
    setSearchResults([]);
    setSelectedNumbers([]);
    setIsLoading(false);
  };
  
  const handleClose = () => {
    resetState();
    onClose();
  }

  const handleConfirmPurchase = () => {
    onPurchase(selectedNumbers);
    handleClose();
  };

  const totalCost = useMemo(() => selectedNumbers.length * PRICE_PER_NUMBER, [selectedNumbers]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300" aria-modal="true" role="dialog">
      <div className="bg-background-card rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <div className="flex justify-between items-center p-6 border-b border-border-color">
          <h2 className="text-xl font-bold text-text-primary">
            {step === 'search' ? 'Purchase Tracking Numbers' : 'Confirm Your Purchase'}
          </h2>
          <button onClick={handleClose} className="text-text-secondary hover:text-text-primary">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {step === 'search' ? (
          // Step 1: Search Form & Results
          <div className="p-6">
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label htmlFor="areaCode" className="block text-sm font-medium text-text-secondary mb-1">Area Code</label>
                  <input type="text" id="areaCode" value={areaCode} onChange={e => setAreaCode(e.target.value)} className="w-full bg-background-light border border-border-color rounded-lg p-2 focus:ring-2 focus:ring-brand-primary outline-none" required />
                </div>
                 <div>
                  <label htmlFor="numberType" className="block text-sm font-medium text-text-secondary mb-1">Number Type</label>
                  <select id="numberType" className="w-full bg-background-light border border-border-color rounded-lg p-2 focus:ring-2 focus:ring-brand-primary outline-none">
                    <option>Local</option>
                    <option>Toll-Free</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-text-secondary mb-1">Quantity</label>
                  <input type="number" id="quantity" value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} min="1" className="w-full bg-background-light border border-border-color rounded-lg p-2 focus:ring-2 focus:ring-brand-primary outline-none" required />
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold rounded-lg shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? 'Searching...' : 'Search for Numbers'}
              </button>
            </form>

            {isLoading && <div className="text-center p-8 text-text-secondary">Finding available numbers...</div>}
            
            {searchResults.length > 0 && !isLoading && (
              <div className="mt-6 max-h-60 overflow-y-auto pr-2">
                 <p className="text-sm text-text-secondary mb-2">Please select {quantity} number(s) from the list below:</p>
                <ul className="space-y-2">
                  {searchResults.map(num => (
                    <li key={num.id} onClick={() => handleSelectNumber(num)} className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${selectedNumbers.some(n => n.id === num.id) ? 'bg-brand-primary/20' : 'bg-background-light hover:bg-border-color'}`}>
                      <span className="font-mono text-text-primary">{num.phoneNumber}</span>
                       <input type="checkbox" readOnly checked={selectedNumbers.some(n => n.id === num.id)} className="form-checkbox h-5 w-5 text-brand-primary bg-background-light border-border-color rounded focus:ring-brand-primary" />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex justify-end">
                <button onClick={handleProceed} disabled={selectedNumbers.length !== quantity} className="px-6 py-2 bg-brand-secondary hover:bg-brand-primary text-white font-semibold rounded-lg shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    Proceed ({selectedNumbers.length}/{quantity})
                </button>
            </div>
          </div>
        ) : (
          // Step 2: Confirmation
          <div className="p-6">
             <div className="bg-background-light p-4 rounded-lg mb-6">
                <h3 className="text-text-primary font-semibold mb-2">Selected Numbers:</h3>
                <ul className="space-y-1">
                    {selectedNumbers.map(num => (
                        <li key={num.id} className="font-mono text-text-secondary">{num.phoneNumber}</li>
                    ))}
                </ul>
            </div>
            <div className="bg-background-light p-4 rounded-lg mb-6 text-center">
                 <p className="text-text-secondary">Total Monthly Cost</p>
                 <p className="text-3xl font-bold text-text-primary">${totalCost.toFixed(2)}</p>
                 <p className="text-xs text-text-secondary mt-1">Billed monthly. You can cancel anytime.</p>
            </div>
             <div className="mt-6 flex justify-between items-center">
                <button onClick={() => setStep('search')} className="px-6 py-2 bg-background-light border border-border-color hover:bg-border-color text-white font-semibold rounded-lg transition-all duration-300">
                    Back
                </button>
                <button onClick={handleConfirmPurchase} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300">
                    Confirm Purchase
                </button>
            </div>
          </div>
        )}
      </div>
       <style>{`
            @keyframes fadeInScale {
                from { opacity: 0; transform: scale(.95); }
                to { opacity: 1; transform: scale(1); }
            }
            .animate-fade-in-scale { animation: fadeInScale 0.2s ease-out forwards; }
        `}</style>
    </div>
  );
};

export default PurchaseNumbersModal;
