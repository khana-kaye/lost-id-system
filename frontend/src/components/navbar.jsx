function Navbar() {
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px', height: '56px',
      background:'black',  borderBottom: '1px solid rgba(255,255,255,0.15)'
    }}>
      {/* Brand / Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          🪪
        </div>
        <span style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>
          ID Recovery
        </span>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          color: '#fff', fontSize: 14, fontWeight: 500,
          background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
          padding: '6px 16px', borderRadius: 6, cursor: 'pointer'
        }}>
          → Admin
        </button>
      </div>
    </nav>
  );
}

export default Navbar;