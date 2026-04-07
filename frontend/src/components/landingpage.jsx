import { useState } from 'react';

function Landingpage() {
  const [query, setQuery] = useState('');

  function handleSearch() {
    if (query.trim()) {
      alert(`Searching for: ${query}`);
      // Later: navigate to results page or call your API
    }
  }

  return (
    <div style={{
        background: 'grey',
      minHeight: '440px',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '60px 24px 80px'
    }}>
      {/* Badge */}
      <div style={{
        background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)',
        color: '#fff', fontSize: 12, padding: '5px 16px',
        borderRadius: 20, marginBottom: 22
      }}>
        Public Document Recovery Service
      </div>

      {/* Title */}
      <h1 style={{ color: '#fff', fontSize: 42, fontWeight: 700, textAlign: 'center', marginBottom: 14 }}>
        Find Your Lost ID
      </h1>

      {/* Subtitle */}
      <p style={{
        color: 'rgba(255,255,255,0.85)', fontSize: 15,
        textAlign: 'center', maxWidth: 420, lineHeight: 1.6, marginBottom: 36
      }}>
        Check if your National ID or Driver's Permit has been found and
        is available for pickup at a nearby station.
      </p>

      {/* Search Bar */}
      <div style={{
        display: 'flex', alignItems: 'center',
        background: '#fff', borderRadius: 8,
        padding: '4px 4px 4px 16px',
        width: '100%', maxWidth: 520, gap: 8
      }}>
        <span>🔍</span>
        <input
          type="text"
          placeholder="ID number or full name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          style={{
            flex: 1, border: 'none', outline: 'none',
            fontSize: 15, padding: '8px 0', background: 'transparent'
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            background: '#3a5fd9', color: '#fff', border: 'none',
            padding: '10px 22px', borderRadius: 6,
            fontSize: 15, fontWeight: 600, cursor: 'pointer'
          }}
        >
          Search →
        </button>
      </div>

      {/* Document type tags */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginTop: 30, color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>
        <span>🪪 National IDs</span>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
        <span>🚗 Driver's Permits</span>
      </div>
    </div>
  );
}

export default Landingpage;