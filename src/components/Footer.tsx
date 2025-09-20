import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      marginTop: 'auto',
      padding: 'var(--spacing-lg) var(--spacing-md)',
      borderTop: '1px solid var(--color-border)',
      background: 'var(--color-surface)',
      textAlign: 'center',
      fontSize: '0.85rem',
      color: 'var(--color-muted)'
    }}>
      <div style={{
        maxWidth: '640px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-sm)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'var(--spacing-lg)'
        }}>
          <Link
            to="/privacy-policy"
            style={{
              color: 'var(--color-muted)',
              textDecoration: 'none',
              transition: 'color var(--transition-fast)'
            }}
            onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--color-primary)'}
            onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--color-muted)'}
          >
            プライバシーポリシー
          </Link>
          <span>|</span>
          <a
            href="https://github.com/manzoku-bukuro/MEMORU"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--color-muted)',
              textDecoration: 'none',
              transition: 'color var(--transition-fast)'
            }}
            onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--color-primary)'}
            onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--color-muted)'}
          >
            GitHub
          </a>
        </div>
        <div>
          <p style={{ margin: 0 }}>&copy; 2025 MEMORU. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}