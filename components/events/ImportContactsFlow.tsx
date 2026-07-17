import React, { useState, useEffect } from 'react';
import { EVI } from './Icons';

type Step = 'intro' | 'uploading' | 'matching' | 'results' | 'sending';

export function ImportContactsFlow({ 
  onClose 
}: { 
  onClose: () => void 
}) {
  const [step, setStep] = useState<Step>('intro');

  useEffect(() => {
    if (step === 'uploading') {
      const t = setTimeout(() => setStep('matching'), 1500);
      return () => clearTimeout(t);
    }
    if (step === 'matching') {
      const t = setTimeout(() => setStep('results'), 2000);
      return () => clearTimeout(t);
    }
    if (step === 'sending') {
      const t = setTimeout(() => onClose(), 1800);
      return () => clearTimeout(t);
    }
  }, [step, onClose]);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'var(--ligo-paper)',
      zIndex: 150,
      display: 'flex',
      flexDirection: 'column',
      padding: 'max(env(safe-area-inset-top, 56px), 56px) 24px max(env(safe-area-inset-bottom, 40px), 40px)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--orange)' }}>
          Invite Members
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--ink)', cursor: 'pointer' }}>
          <EVI.Close />
        </button>
      </div>

      {step === 'intro' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--ink)', lineHeight: 0.9, letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: 16 }}>
            Upload your<br/>guest list.
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(20,17,13,0.6)', lineHeight: 1.4, marginBottom: 40 }}>
            Drop in a CSV with names and phone numbers. We'll automatically invite members who have the app, and text the rest.
          </p>

          <div 
            onClick={() => setStep('uploading')}
            style={{ padding: 24, background: '#fff', borderRadius: 16, border: '2px dashed rgba(20,17,13,0.2)', textAlign: 'center', marginBottom: 24, cursor: 'pointer' }}
          >
            <div style={{ width: 48, height: 48, background: 'rgba(20,17,13,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--ink)' }}>
              <EVI.Invite />
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Upload CSV File</div>
            <div style={{ fontSize: 13, color: 'rgba(20,17,13,0.5)', marginTop: 4 }}>Members.csv, Roster.xlsx</div>
          </div>

          <button 
            onClick={() => setStep('uploading')}
            style={{ width: '100%', padding: 20, borderRadius: 16, background: 'var(--ink)', color: '#fff', fontSize: 16, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', cursor: 'pointer', marginTop: 'auto' }}
          >
            Select File
          </button>
        </div>
      )}

      {(step === 'uploading' || step === 'matching' || step === 'sending') && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div className="spinner" style={{ width: 48, height: 48, border: '4px solid rgba(249,115,22,0.2)', borderTopColor: 'var(--orange)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: 24 }} />
          <h2 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--ink)', textTransform: 'uppercase', marginBottom: 8 }}>
            {step === 'uploading' ? 'Uploading list...' : step === 'matching' ? 'Matching accounts...' : 'Sending Invites...'}
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(20,17,13,0.6)' }}>
            {step === 'uploading' ? 'Reading 85 rows from SigEpRoster.csv' : step === 'matching' ? 'Cross-referencing phone numbers with LIGO users' : 'Dispatching 27 SMS texts and 58 push notifications'}
          </p>
          <style>{`
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          `}</style>
        </div>
      )}

      {step === 'results' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: 64, height: 64, background: 'var(--orange)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: 24 }}>
            <EVI.Check style={{ width: 32, height: 32 }} />
          </div>
          
          <h2 style={{ fontSize: 40, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--ink)', lineHeight: 0.9, letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: 32 }}>
            List processed.
          </h2>

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(20,17,13,0.06)', overflow: 'hidden', marginBottom: 40 }}>
            <div style={{ padding: 20, borderBottom: '1px solid rgba(20,17,13,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>58</div>
                <div style={{ fontSize: 13, color: 'rgba(20,17,13,0.6)', fontWeight: 500 }}>Matched on LIGO</div>
              </div>
              <div style={{ color: 'var(--orange)', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(249,115,22,0.1)', padding: '4px 10px', borderRadius: 20 }}>
                In-App Push
              </div>
            </div>
            <div style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>27</div>
                <div style={{ fontSize: 13, color: 'rgba(20,17,13,0.6)', fontWeight: 500 }}>New Contacts</div>
              </div>
              <div style={{ color: 'var(--ink)', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(20,17,13,0.05)', padding: '4px 10px', borderRadius: 20 }}>
                SMS Invite
              </div>
            </div>
          </div>

          <button 
            onClick={() => setStep('sending')}
            style={{ width: '100%', padding: 20, borderRadius: 16, background: 'var(--ink)', color: '#fff', fontSize: 16, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', cursor: 'pointer', marginTop: 'auto' }}
          >
            Send Invites
          </button>
        </div>
      )}
    </div>
  );
}
