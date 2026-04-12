import React from 'react';

export default function KanbanColumn({ title, count, color, children }) {
    return (
        <div style={{ background: 'var(--input-bg)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }}></div>
                    <h4 style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-color)' }}>{title}</h4>
                </div>
                <span style={{ background: 'var(--surface-color)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>{count}</span>
            </div>
            {children}
        </div>
    );
}
