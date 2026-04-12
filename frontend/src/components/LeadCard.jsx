import React from 'react';
import { MoreHorizontal, Activity, ArrowRight } from 'lucide-react';

export default function LeadCard({ company, status, time }) {
    return (
        <div className="glass-panel" style={{ padding: '1rem', width: 'auto', borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', border: '1px solid var(--input-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <h5 style={{ fontWeight: 600, color: 'var(--text-color)', fontSize: '0.95rem' }}>{company}</h5>
                <MoreHorizontal size={16} color="var(--text-muted)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                <Activity size={12} />
                {status}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{time}</span>
                <ArrowRight size={14} color="var(--primary-color)" />
            </div>
        </div>
    );
}
