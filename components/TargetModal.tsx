import React, { useState, useEffect } from 'react';
import { Target } from '../types';
import { XIcon } from './icons/UIIcons';

interface TargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (target: Target) => void;
  target: Target | null;
}

const TargetModal: React.FC<TargetModalProps> = ({ isOpen, onClose, onSave, target }) => {
  const [formData, setFormData] = useState<Partial<Target>>({
    name: '',
    buyer: '',
    destination: '',
    status: 'Active',
  });
  const [destinationError, setDestinationError] = useState<string | null>(null);

  const validatePhoneNumber = (phone: string): boolean => {
    // Validates (XXX) XXX-XXXX or XXXXXXXXXX formats
    const phoneRegex = /^(\(\d{3}\)\s?\d{3}-\d{4}|\d{10})$/;
    return phoneRegex.test(phone);
  };

  useEffect(() => {
    if (isOpen) {
      if (target) {
        setFormData(target);
      } else {
        setFormData({
          name: '',
          buyer: '',
          destination: '',
          status: 'Active',
        });
      }
      setDestinationError(null); // Reset error state when modal opens
    }
  }, [target, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'destination') {
      if (!value || validatePhoneNumber(value)) {
        setDestinationError(null);
      } else {
        setDestinationError('Invalid format. Use (XXX) XXX-XXXX or XXXXXXXXXX.');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.destination && !validatePhoneNumber(formData.destination)) {
      setDestinationError('Invalid format. Please correct the phone number.');
      return; // Prevent submission
    }
    onSave(formData as Target);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300" aria-modal="true" role="dialog">
      <form onSubmit={handleSubmit} className="bg-background-card rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <div className="flex justify-between items-center p-6 border-b border-border-color">
          <h2 className="text-xl font-bold text-text-primary">
            {target ? 'Edit Target' : 'Create New Target'}
          </h2>
          <button type="button" onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Target Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full bg-background-light border border-border-color rounded-lg p-2 focus:ring-2 focus:ring-brand-primary outline-none" required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="buyer" className="block text-sm font-medium text-text-secondary mb-1">Buyer</label>
              <input type="text" id="buyer" name="buyer" value={formData.buyer} onChange={handleChange} className="w-full bg-background-light border border-border-color rounded-lg p-2 focus:ring-2 focus:ring-brand-primary outline-none" />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-text-secondary mb-1">Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full bg-background-light border border-border-color rounded-lg p-2 focus:ring-2 focus:ring-brand-primary outline-none">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-text-secondary mb-1">Destination (Phone Number)</label>
            <input 
                type="tel" 
                id="destination" 
                name="destination" 
                value={formData.destination} 
                onChange={handleChange} 
                className={`w-full bg-background-light border rounded-lg p-2 outline-none transition-colors ${destinationError ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-border-color focus:ring-2 focus:ring-brand-primary'}`} 
                placeholder="(555) 123-4567" 
                required
                aria-invalid={!!destinationError}
                aria-describedby="destination-error"
            />
            {destinationError && <p id="destination-error" className="text-red-400 text-xs mt-1">{destinationError}</p>}
          </div>
        </div>

        <div className="flex justify-end items-center p-6 bg-background-light rounded-b-xl space-x-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-background-card border border-border-color hover:bg-border-color text-text-primary font-semibold rounded-lg transition-all duration-300">
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={!!destinationError}
            className="px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold rounded-lg shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {target ? 'Save Changes' : 'Create Target'}
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

export default TargetModal;
