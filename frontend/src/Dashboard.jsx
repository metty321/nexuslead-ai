import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogOut, LayoutDashboard, Database, Bot, CreditCard, Plus, Search, ChevronDown, ArrowRight, MoreHorizontal, Activity, X } from 'lucide-react';
import StatCard from './components/StatCard';
import KanbanColumn from './components/KanbanColumn';
import LeadCard from './components/LeadCard';
import './index.css';

export default function Dashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('campaigns');
    const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [workspaces, setWorkspaces] = useState([]);
    const [activeWorkspace, setActiveWorkspace] = useState({ name: 'Loading...' });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const fetchWorkspaceDetail = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/workspace-detail?id=${id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.ok) {
                const data = await response.json();
                setActiveWorkspace(data);
            }
        } catch (err) {
            console.error("Failed to fetch detailed workspace data", err);
        }
    };

    // Fetch workspaces on component mount
    useEffect(() => {
        const fetchWorkspaces = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/paginated-workspaces?disable_pagination=true', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setWorkspaces(data);
                    if (data.length > 0) fetchWorkspaceDetail(data[0].id);
                }
            } catch (err) {
                console.error("Failed to fetch workspaces", err);
            }
        };
        fetchWorkspaces();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('http://127.0.0.1:8000/logout', { method: 'POST' });
        } catch (e) {
            console.error("Logout failed at server API", e);
        } finally {
            localStorage.removeItem('token');
            toast.success('Successfully logged out!');
            navigate('/');
        }
    };

    const handleCreateWorkspace = async (e) => {
        e.preventDefault();
        if (!newWorkspaceName.trim()) return;
        setIsCreating(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/new-workspaces', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ name: newWorkspaceName }),
            });

            if (response.ok) {
                const data = await response.json();
                const newWs = { id: data.id || Date.now(), name: data.name };
                setWorkspaces([...workspaces, newWs]);
                setActiveWorkspace(newWs);
                setIsWorkspaceModalOpen(false);
                setNewWorkspaceName('');
            } else {
                alert("Failed to create workspace. Check the console.");
            }
        } catch (err) {
            console.error(err);
            alert("Error occurred while creating workspace");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="dashboard-layout" style={{ display: 'flex', minHeight: '100vh', width: '100vw', background: 'var(--bg-color)' }}>
            {/* Sidebar */}
            <aside className="glass-panel" style={{ width: '280px', borderRadius: '0', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', padding: '1.5rem', background: 'var(--surface-color)', zIndex: 10 }}>
                <div style={{ marginBottom: '2.5rem', position: 'relative' }}>
                    <h2 className="title" style={{ fontSize: '1.5rem', textAlign: 'left', marginBottom: '0.2rem' }}>NexusLead AI</h2>
                    <div 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', padding: '0.5rem', background: 'var(--input-bg)', borderRadius: '8px', border: '1px solid var(--border-color)', position: 'relative' }}
                    >
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
                        <span style={{ fontWeight: 500, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activeWorkspace.name}</span>
                        <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                    </div>

                    {/* The Workspace Dropdown Popover */}
                    {isDropdownOpen && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.5rem', background: 'var(--bg-color)', backdropFilter: 'blur(24px)', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)', zIndex: 100, padding: '0.5rem' }}>
                            <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '0.5rem' }}>
                                {workspaces.map(ws => (
                                    <div 
                                        key={ws.id}
                                        onClick={() => { fetchWorkspaceDetail(ws.id); setIsDropdownOpen(false); }}
                                        style={{ padding: '0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', color: activeWorkspace.id === ws.id ? 'var(--primary-color)' : 'var(--text-color)', background: activeWorkspace.id === ws.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent', fontWeight: activeWorkspace.id === ws.id ? 600 : 400 }}
                                    >
                                        {ws.name}
                                    </div>
                                ))}
                            </div>
                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                                <button
                                    onClick={() => { setIsWorkspaceModalOpen(true); setIsDropdownOpen(false); }}
                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', color: 'var(--primary-color)', fontSize: '0.85rem', width: '100%', textAlign: 'left', borderRadius: '4px' }}
                                >
                                    <Plus size={14} /> Create new
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <button className={`nav-item ${activeTab === 'campaigns' ? 'active' : ''}`} onClick={() => setActiveTab('campaigns')} style={getNavItemStyle(activeTab === 'campaigns')}>
                        <LayoutDashboard size={18} />
                        Campaigns
                    </button>
                    <button className={`nav-item ${activeTab === 'agents' ? 'active' : ''}`} onClick={() => setActiveTab('agents')} style={getNavItemStyle(activeTab === 'agents')}>
                        <Bot size={18} />
                        AI Agents
                    </button>
                    <button className={`nav-item ${activeTab === 'leads' ? 'active' : ''}`} onClick={() => setActiveTab('leads')} style={getNavItemStyle(activeTab === 'leads')}>
                        <Database size={18} />
                        Lead Database
                    </button>
                    <button className={`nav-item ${activeTab === 'billing' ? 'active' : ''}`} onClick={() => setActiveTab('billing')} style={getNavItemStyle(activeTab === 'billing')}>
                        <CreditCard size={18} />
                        Billing & Usage
                    </button>
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--input-bg)', borderRadius: '12px', border: '1px solid var(--input-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                            <span style={{ color: 'var(--text-color)', fontWeight: 500 }}>AI Credits</span>
                            <span style={{ color: 'var(--primary-color)' }}>{activeWorkspace.credit_remaining !== undefined ? activeWorkspace.credit_remaining : '...'} remaining</span>
                        </div>
                        <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: '100%', background: 'var(--primary-color)', borderRadius: '3px' }}></div>
                        </div>
                    </div>

                    <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem', color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.2s', textAlign: 'left', fontSize: '0.9rem', fontWeight: 500 }} className="logout-btn">
                        <LogOut size={18} />
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto', position: 'relative', zIndex: 5 }}>
                {/* Header */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-color)', marginBottom: '0.25rem' }}>Active Campaigns</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Monitor your AI outreach performance.</p>
                    </div>
                    <button className="btn-primary" style={{ width: 'auto', margin: 0, padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={18} />
                        New Campaign
                    </button>
                </header>

                {/* Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <StatCard title="Total Leads Researched" value="1,248" trend="+12% this week" icon={<Search size={20} color="var(--primary-color)" />} />
                    <StatCard title="Emails Drafted" value="842" trend="+5% this week" icon={<Bot size={20} color="#ec4899" />} />
                    <StatCard title="Conversion Rate (Est.)" value="4.2%" trend="+1.1% this week" icon={<Activity size={20} color="#10b981" />} />
                </div>

                {/* Kanban / Task Board */}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-color)', marginBottom: '1rem' }}>SaaS Outreach Q3</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>

                    <KanbanColumn title="AI Researching" count={2} color="#f59e0b">
                        <LeadCard company="Acme Corp" status="Scraping LinkedIn & Website" time="2m ago" />
                        <LeadCard company="TechFlow Inc." status="Extracting Pain Points" time="5m ago" />
                    </KanbanColumn>

                    <KanbanColumn title="Drafting Email" count={1} color="var(--primary-color)">
                        <LeadCard company="Global Dynamics" status="Applying Consultative Tone" time="Just now" />
                    </KanbanColumn>

                    <KanbanColumn title="Ready for Review" count={3} color="#10b981">
                        <LeadCard company="Stark Industries" status="Draft Ready" time="1hr ago" />
                        <LeadCard company="Wayne Enterprises" status="Draft Ready" time="2hrs ago" />
                        <LeadCard company="Cyberdyne" status="Draft Ready" time="4hrs ago" />
                    </KanbanColumn>

                </div>
            </main>

            {/* Workspace Creation Modal */}
            {isWorkspaceModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
                    <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2rem', position: 'relative' }}>
                        <button
                            onClick={() => setIsWorkspaceModalOpen(false)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                        >
                            <X size={20} />
                        </button>
                        <h2 className="title" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Create Workspace</h2>
                        <p className="subtitle" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Create a new organizational scope for your team.</p>

                        <form onSubmit={handleCreateWorkspace}>
                            <div className="input-group">
                                <label>Workspace Name</label>
                                <input
                                    type="text"
                                    className="glass-input"
                                    placeholder="e.g. Acme Corp Sales"
                                    value={newWorkspaceName}
                                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                                    style={{ paddingLeft: '1rem' }}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-primary" disabled={isCreating} style={{ marginTop: '0.5rem', opacity: isCreating ? 0.7 : 1 }}>
                                {isCreating ? 'Creating...' : 'Create Workspace'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}

// Helper Components
function getNavItemStyle(isActive) {
    return {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        width: '100%',
        padding: '0.75rem 1rem',
        borderRadius: '10px',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        fontSize: '0.95rem',
        fontWeight: 500,
        background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.05))' : 'transparent',
        color: isActive ? 'var(--primary-color)' : 'var(--text-color)',
        borderLeft: isActive ? '3px solid var(--primary-color)' : '3px solid transparent',
        transition: 'all 0.2s',
    };
}

