export function ChevronDown() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MenuIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
      <path d="M4 8h18M4 13h18M4 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ServiceIcon({ name, className = 'ic' }) {
  const common = { className, viewBox: '0 0 32 32', fill: 'none', 'aria-hidden': true };
  if (name === 'tax') {
    return (
      <svg {...common}>
        <path d="M10 4h12l4 4v20H6V8l4-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M19 12l-6 8M13 13h.01M19 19h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === 'people') {
    return (
      <svg {...common}>
        <circle cx="16" cy="11" r="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 27c0-5 4.5-8 10-8s10 3 10 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === 'legal') {
    return (
      <svg {...common}>
        <path d="M16 4v24M8 28h16M16 7l8 2-3 7a3.5 3.5 0 01-5 0l8-2M16 7L8 9l3 7a3.5 3.5 0 005 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M5 8c0-1.7 4.9-3 11-3s11 1.3 11 3-4.9 3-11 3-11-1.3-11-3z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 8v8c0 1.7 4.9 3 11 3s11-1.3 11-3V8M5 16v8c0 1.7 4.9 3 11 3s11-1.3 11-3v-8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ContactIcon({ type }) {
  if (type === 'mail') {
    return <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  }
  if (type === 'phone') {
    return <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-3 2c1 2 3 4 5 5l2-3 5 2v4c0 1-1 2-2 2C10 21 3 14 3 6c0-1 1-2 2-2z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>;
  }
  if (type === 'clock') {
    return <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  }
  return <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c-3.9 0-7 3-7 6.8 0 5 7 12.2 7 12.2s7-7.2 7-12.2C19 5 15.9 2 12 2z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><circle cx="12" cy="9" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>;
}
