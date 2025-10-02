import React from 'react';

const Settings: React.FC = () => {
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-background-light min-h-full text-text-primary">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-text-secondary mt-1">Manage your account and preferences.</p>
            </div>

            {/* Profile Settings */}
            <div className="bg-background-card p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold border-b border-border-color pb-3 mb-4">Profile</h3>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                            <input type="text" id="fullName" defaultValue="Alex Doe" className="w-full bg-background-light border border-border-color rounded-lg p-2 focus:ring-2 focus:ring-brand-primary outline-none" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
                            <input type="email" id="email" defaultValue="alex.doe@auracall.com" className="w-full bg-background-light border border-border-color rounded-lg p-2 focus:ring-2 focus:ring-brand-primary outline-none" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="company" className="block text-sm font-medium text-text-secondary mb-1">Company</label>
                        <input type="text" id="company" defaultValue="AuraCall Inc." className="w-full bg-background-light border border-border-color rounded-lg p-2 focus:ring-2 focus:ring-brand-primary outline-none" />
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold rounded-lg shadow-md transition-all duration-300">Save Changes</button>
                    </div>
                </form>
            </div>

             {/* API Settings */}
             <div className="bg-background-card p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold border-b border-border-color pb-3 mb-4">API Access</h3>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-text-secondary">Your API Key allows you to integrate AuraCall with other services.</p>
                        <div className="mt-2 flex items-center gap-4 bg-background-light border border-border-color rounded-lg p-3">
                            <span className="font-mono text-sm text-text-secondary flex-1">ac_********************************</span>
                            <button className="text-brand-secondary text-sm font-semibold hover:text-brand-primary">Copy</button>
                            <button className="text-red-400 text-sm font-semibold hover:text-red-500">Revoke</button>
                        </div>
                    </div>
                    <div className="pt-2">
                         <button className="px-4 py-2 bg-background-light border border-border-color hover:bg-border-color text-white font-semibold rounded-lg transition-all duration-300">Generate New Key</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
