import React, { useState, useEffect } from 'react';
import { UserPlus, Users, Mail, Trash2, Edit, Save, X, CheckCircle2 } from 'lucide-react';
import { hasFeature } from '@/lib/utils';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'pending' | 'disabled';
  dateAdded: string;
}

const TeamManagement: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [editedRole, setEditedRole] = useState<'admin' | 'editor' | 'viewer'>('editor');
  const [isSending, setIsSending] = useState(false);
  const [maxTeamSize, setMaxTeamSize] = useState(3);
  const [remainingInvites, setRemainingInvites] = useState(3);

  // Check if user has access to Team Management
  const subscription = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('userSubscription') || 'null')
    : null;
  
  const hasAccess = hasFeature(subscription, 'Team member accounts (3)');

  // Load team members from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMembers = localStorage.getItem('teamMembers');
      if (savedMembers) {
        setTeamMembers(JSON.parse(savedMembers));
        
        // Update remaining invites
        const currentMembers = JSON.parse(savedMembers).length;
        setRemainingInvites(Math.max(0, maxTeamSize - currentMembers));
      } else {
        // Initialize with yourself as admin
        const currentUser = localStorage.getItem('user');
        if (currentUser) {
          const user = JSON.parse(currentUser);
          const initialTeam: TeamMember[] = [{
            id: '1',
            name: user.name || 'Account Owner',
            email: user.email || 'owner@example.com',
            role: 'admin',
            status: 'active',
            dateAdded: new Date().toISOString()
          }];
          setTeamMembers(initialTeam);
          localStorage.setItem('teamMembers', JSON.stringify(initialTeam));
          setRemainingInvites(Math.max(0, maxTeamSize - 1));
        }
      }
    }
  }, [maxTeamSize]);

  if (!hasAccess) {
    return (
      <div className="p-6 bg-amber-50 rounded-lg border border-amber-200">
        <h3 className="text-lg font-medium text-amber-800 mb-2">Business Plan Feature</h3>
        <p className="text-amber-700 mb-4">
          Team Management is available exclusively for Business plan subscribers.
          Upgrade to invite up to 3 team members to collaborate on listings.
        </p>
        <a
          href="/premium"
          className="inline-block px-4 py-2 bg-amber-600 text-white rounded-md font-medium hover:bg-amber-700"
        >
          Upgrade to Business
        </a>
      </div>
    );
  }

  const handleInvite = () => {
    if (!inviteEmail || remainingInvites <= 0) return;
    
    setIsSending(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const newMember: TeamMember = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
        name: inviteEmail.split('@')[0], // Use email name as temporary name
        email: inviteEmail,
        role: inviteRole,
        status: 'pending',
        dateAdded: new Date().toISOString()
      };
      
      const updatedMembers = [...teamMembers, newMember];
      setTeamMembers(updatedMembers);
      localStorage.setItem('teamMembers', JSON.stringify(updatedMembers));
      
      setInviteEmail('');
      setShowInviteForm(false);
      setIsSending(false);
      setRemainingInvites(prev => prev - 1);
    }, 1500);
  };

  const handleRemoveMember = (id: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      const updatedMembers = teamMembers.filter(member => member.id !== id);
      setTeamMembers(updatedMembers);
      localStorage.setItem('teamMembers', JSON.stringify(updatedMembers));
      setRemainingInvites(prev => prev + 1);
    }
  };

  const handleEditMember = (id: string) => {
    const member = teamMembers.find(m => m.id === id);
    if (member) {
      setEditingMember(id);
      setEditedRole(member.role);
    }
  };

  const handleSaveEdit = (id: string) => {
    const updatedMembers = teamMembers.map(member => 
      member.id === id ? { ...member, role: editedRole } : member
    );
    setTeamMembers(updatedMembers);
    localStorage.setItem('teamMembers', JSON.stringify(updatedMembers));
    setEditingMember(null);
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'editor':
        return 'Editor';
      case 'viewer':
        return 'Viewer';
      default:
        return role;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-600" />
          Team Management
        </h2>
        <div className="text-sm text-gray-500">
          {remainingInvites > 0 ? (
            <span>{remainingInvites} invites remaining</span>
          ) : (
            <span>Team limit reached</span>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-gray-600 mb-6">
          Invite team members to collaborate on listings and manage your account.
        </p>
        
        {/* Team Members List */}
        <div className="mb-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name/Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Added
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teamMembers.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingMember === member.id ? (
                      <select
                        value={editedRole}
                        onChange={(e) => setEditedRole(e.target.value as 'admin' | 'editor' | 'viewer')}
                        className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 rounded-md"
                        disabled={member.role === 'admin'}
                      >
                        <option value="admin">Administrator</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getRoleLabel(member.role)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      member.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : member.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(member.dateAdded)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingMember === member.id ? (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleSaveEdit(member.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Save className="h-5 w-5" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-2">
                        {member.role !== 'admin' && (
                          <>
                            <button
                              onClick={() => handleEditMember(member.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleRemoveMember(member.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Invite Form */}
        {showInviteForm ? (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Invite Team Member</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                    placeholder="colleague@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'editor' | 'viewer')}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md"
                >
                  <option value="editor">Editor (can create and edit listings)</option>
                  <option value="viewer">Viewer (can only view listings)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowInviteForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                disabled={!inviteEmail || isSending || remainingInvites <= 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSending ? 'Sending...' : 'Send Invitation'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => setShowInviteForm(true)}
              disabled={remainingInvites <= 0}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Invite Team Member
            </button>
          </div>
        )}
        
        {/* Role explanations */}
        <div className="mt-8 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Account Roles Explained</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start">
              <span className="inline-flex items-center justify-center h-5 w-5 rounded bg-blue-100 text-blue-800 font-medium mr-2">A</span>
              <div>
                <p className="font-medium">Administrator</p>
                <p className="text-gray-500">Full account access, can manage team members and billing.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="inline-flex items-center justify-center h-5 w-5 rounded bg-blue-100 text-blue-800 font-medium mr-2">E</span>
              <div>
                <p className="font-medium">Editor</p>
                <p className="text-gray-500">Can create and edit listings, but can't manage the account.</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="inline-flex items-center justify-center h-5 w-5 rounded bg-blue-100 text-blue-800 font-medium mr-2">V</span>
              <div>
                <p className="font-medium">Viewer</p>
                <p className="text-gray-500">Can only view listings and analytics, no editing capabilities.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement; 