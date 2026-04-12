import React from 'react';

export default function StatCard({ title, value, trend, icon }) {
    return (
        <div className="glass-panel" style={{ padding: '1.5rem', width: 'auto', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>{title}</p>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-color)' }}>{value}</h3>
                </div>
                <div style={{ padding: '0.5rem', background: 'var(--input-bg)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                    {icon}
                </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 500 }}>{trend}</p>
        </div>
    );
}
