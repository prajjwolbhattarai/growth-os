

import React, { useState } from 'react';
import { User, AttributionModel, Webhook } from '../types';
import Modal from './ui/Modal';

type SettingsTab = 'general' | 'users' | 'data' | 'notifications' | 'security';

const SettingsView: React.FC<{users: User[], webhooks: Webhook[]}> = ({ users: initialUsers, webhooks: initialWebhooks }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('users');

  const renderContent = () => {
    switch (activeTab) {
      case 'general': return <GeneralSettings />;
      case 'users': return <UserManagement initialUsers={initialUsers} />;
      case 'data': return <DataPreferences />;
      case 'notifications': return <NotificationsSettings />;
      case 'security': return <SecuritySettings initialWebhooks={initialWebhooks} />;
      default: return null;
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
      <p className="text-slate-600 mb-8">Manage your workspace, users, and preferences.</p>
      
      <div className="flex border-b border-slate-200 mb-8">
        <TabButton label="User Management" isActive={activeTab === 'users'} onClick={() => setActiveTab('users')} />
        <TabButton label="General" isActive={activeTab === 'general'} onClick={() => setActiveTab('general')} />
        <TabButton label="Data Preferences" isActive={activeTab === 'data'} onClick={() => setActiveTab('data')} />
        <TabButton label="Notifications" isActive={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
        <TabButton label="Security" isActive={activeTab === 'security'} onClick={() => setActiveTab('security')} />
      </div>

      <div>{renderContent()}</div>
    </div>
  );
};

const TabButton: React.FC<{ label: string, isActive: boolean, onClick: () => void }> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors duration-200 ${isActive ? 'border-brand-blue-600 text-brand-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
  >
    {label}
  </button>
);

const SettingsCard: React.FC<{ title: string; description: string; children: React.ReactNode; }> = ({ title, description, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/75 mb-6">
        <div className="border-b border-slate-200 pb-4 mb-4">
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            <p className="text-sm text-slate-500">{description}</p>
        </div>
        <div>{children}</div>
    </div>
);

const FormRow: React.FC<{ label: string; children: React.ReactNode; error?: string }> = ({ label, children, error }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-1 md:gap-x-4 mb-4 items-start">
        <label className="text-sm font-medium text-slate-700 md:pt-2">{label}</label>
        <div className="md:col-span-2">
            {children}
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    </div>
);

const ToggleSwitch: React.FC<{ enabled: boolean; setEnabled: (enabled: boolean) => void }> = ({ enabled, setEnabled }) => (
    <button
        type="button"
        className={`${enabled ? 'bg-brand-blue-600' : 'bg-slate-300'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-blue-500 focus:ring-offset-2`}
        role="switch"
        aria-checked={enabled}
        onClick={() => setEnabled(!enabled)}
    >
        <span className={`${enabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
    </button>
);

const GeneralSettings: React.FC = () => (
    <SettingsCard title="General Settings" description="Update your workspace's basic information.">
        <FormRow label="Workspace Name">
            <input type="text" defaultValue="My Marketing Hub" className="w-full max-w-sm p-2 border border-slate-300 rounded-lg" />
        </FormRow>
        <FormRow label="Timezone">
            <select defaultValue="Europe/Berlin" className="w-full max-w-sm p-2 border border-slate-300 rounded-lg">
                <option>America/New_York (GMT-4)</option>
                <option>Europe/London (GMT+1)</option>
                <option>Europe/Berlin (GMT+2)</option>
                <option>Asia/Tokyo (GMT+9)</option>
            </select>
        </FormRow>
        <FormRow label="Currency">
            <select defaultValue="EUR" className="w-full max-w-sm p-2 border border-slate-300 rounded-lg">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
            </select>
        </FormRow>
    </SettingsCard>
);

const UserManagement: React.FC<{initialUsers: User[]}> = ({initialUsers}) => {
    const [users, setUsers] = useState(initialUsers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
    const [errors, setErrors] = useState<{name?: string, email?: string}>({});

    const handleOpenModal = (user: User | null) => {
        setEditingUser(user || { name: '', email: '', role: 'Viewer' });
        setIsModalOpen(true);
        setErrors({});
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };
    
    const validate = () => {
      const newErrors: {name?: string, email?: string} = {};
      if (!editingUser?.name?.trim()) newErrors.name = "Name is required.";
      if (!editingUser?.email?.trim()) {
        newErrors.email = "Email is required.";
      } else if (!/\S+@\S+\.\S+/.test(editingUser.email)) {
        newErrors.email = "Email is invalid.";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }

    const handleSaveUser = () => {
        if (!validate() || !editingUser) return;

        if (editingUser.id) { // Editing existing user
            setUsers(users.map(u => u.id === editingUser.id ? editingUser as User : u));
        } else { // Adding new user
            const newUser: User = {
                ...editingUser,
                id: `usr_${Date.now()}`,
                avatarUrl: `https://i.pravatar.cc/150?u=${editingUser.email}`,
                lastActive: 'Just now'
            } as User;
            setUsers([...users, newUser]);
        }
        handleCloseModal();
    };

    return (
        <SettingsCard title="User Management" description="Invite new users and manage their roles.">
            <div className="flex justify-end mb-4">
                <button onClick={() => handleOpenModal(null)} className="bg-brand-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-blue-700">Invite User</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3">Last Active</th>
                            <th className="px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4 flex items-center">
                                    <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full mr-4" />
                                    <div>
                                        <div className="font-semibold text-slate-800">{user.name}</div>
                                        <div className="text-slate-500">{user.email}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{user.role}</td>
                                <td className="px-6 py-4">{user.lastActive}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleOpenModal(user)} className="font-medium text-brand-blue-600 hover:underline">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingUser?.id ? 'Edit User' : 'Invite User'}>
                {editingUser && (
                    <div className="space-y-4">
                        <FormRow label="Full Name" error={errors.name}>
                            <input 
                                type="text"
                                value={editingUser.name}
                                onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                                className="w-full p-2 border border-slate-300 rounded-lg"
                            />
                        </FormRow>
                        <FormRow label="Email Address" error={errors.email}>
                            <input 
                                type="email"
                                value={editingUser.email}
                                onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                                className="w-full p-2 border border-slate-300 rounded-lg"
                            />
                        </FormRow>
                        <FormRow label="Role">
                            <select 
                                value={editingUser.role}
                                onChange={e => setEditingUser({...editingUser, role: e.target.value as User['role']})}
                                className="w-full p-2 border border-slate-300 rounded-lg"
                            >
                                <option>Admin</option>
                                <option>Manager</option>
                                <option>Analyst</option>
                                <option>Viewer</option>
                            </select>
                        </FormRow>
                         <div className="flex justify-end gap-2 pt-4">
                            <button onClick={handleCloseModal} className="bg-slate-200 text-slate-800 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300">Cancel</button>
                            <button onClick={handleSaveUser} className="bg-brand-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-blue-700">{editingUser.id ? "Save Changes" : "Send Invite"}</button>
                        </div>
                    </div>
                )}
            </Modal>
        </SettingsCard>
    );
};

const DataPreferences: React.FC = () => (
    <SettingsCard title="Data Preferences" description="Control how data is processed and displayed.">
         <FormRow label="Default Attribution Model">
            <select defaultValue={AttributionModel.LastTouch} className="w-full max-w-sm p-2 border border-slate-300 rounded-lg">
                {Object.values(AttributionModel).map(m => <option key={m} value={m}>{m}</option>)}
            </select>
        </FormRow>
        <FormRow label="Data Refresh Interval">
             <select defaultValue="daily" className="w-full max-w-sm p-2 border border-slate-300 rounded-lg">
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
            </select>
        </FormRow>
    </SettingsCard>
);


const NotificationsSettings: React.FC = () => {
    const [budgetAlerts, setBudgetAlerts] = useState(true);
    const [perfAlerts, setPerfAlerts] = useState(true);
    
    return (
        <SettingsCard title="Notifications" description="Configure when and how you receive alerts.">
            <FormRow label="Budget Pacing Alerts">
                <ToggleSwitch enabled={budgetAlerts} setEnabled={setBudgetAlerts} />
            </FormRow>
            <FormRow label="Performance Drop Alerts">
                 <ToggleSwitch enabled={perfAlerts} setEnabled={setPerfAlerts} />
            </FormRow>
        </SettingsCard>
    );
}

const SecuritySettings: React.FC<{initialWebhooks: Webhook[]}> = ({initialWebhooks}) => {
    const [twoFa, setTwoFa] = useState(false);
    
    return (
      <>
        <SettingsCard title="Access Control" description="Manage your workspace's security settings.">
          <FormRow label="Enable Two-Factor Authentication (2FA)">
                <ToggleSwitch enabled={twoFa} setEnabled={setTwoFa} />
          </FormRow>
            <FormRow label="API Key">
              <div className="flex items-center gap-2">
                  <input type="text" readOnly value="ucih_prod_••••••••••••••••••••1234" className="w-full max-w-sm p-2 border bg-slate-100 border-slate-300 rounded-lg font-mono" />
                  <button className="text-sm font-semibold text-brand-blue-600">Revoke</button>
              </div>
          </FormRow>
        </SettingsCard>
        <WebhookManagement initialWebhooks={initialWebhooks} />
      </>
    )
};

const WebhookManagement: React.FC<{initialWebhooks: Webhook[]}> = ({initialWebhooks}) => {
    const [webhooks, setWebhooks] = useState(initialWebhooks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    return (
         <SettingsCard title="Webhook Configuration" description="Send automated events to external services.">
            <div className="flex justify-end mb-4">
                <button onClick={() => setIsModalOpen(true)} className="bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-800">Add Webhook</button>
            </div>
            <div className="space-y-3">
                {webhooks.map(hook => (
                    <div key={hook.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                        <div>
                            <p className="font-mono text-sm text-slate-800">{hook.url}</p>
                            <p className="text-xs text-slate-500">Event: <span className="font-semibold">{hook.event.replace(/_/g, ' ')}</span></p>
                        </div>
                        <div className="flex items-center gap-4">
                            <ToggleSwitch enabled={hook.isActive} setEnabled={(val) => setWebhooks(hooks => hooks.map(h => h.id === hook.id ? {...h, isActive: val} : h))} />
                             <button className="text-sm font-semibold text-red-600 hover:underline">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Webhook">
                 <div className="space-y-4">
                     <FormRow label="Endpoint URL">
                         <input type="url" placeholder="https://example.com/webhook" className="w-full p-2 border border-slate-300 rounded-lg" />
                     </FormRow>
                     <FormRow label="Event to Trigger">
                         <select className="w-full p-2 border border-slate-300 rounded-lg">
                             <option value="budget_overspend">Budget Overspend</option>
                             <option value="churn_risk_high">Churn Risk High</option>
                             <option value="new_lead">New Lead</option>
                             <option value="campaign_ended">Campaign Ended</option>
                         </select>
                     </FormRow>
                     <div className="flex justify-end gap-2 pt-4">
                        <button onClick={() => setIsModalOpen(false)} className="bg-slate-200 text-slate-800 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300">Cancel</button>
                        <button onClick={() => setIsModalOpen(false)} className="bg-brand-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-blue-700">Add Webhook</button>
                    </div>
                 </div>
            </Modal>
        </SettingsCard>
    )
}


export default SettingsView;
