import { Link } from 'react-router-dom'
import type { FooterData } from './hooks/useFooterData'

interface FooterViewProps {
  data: FooterData
}

export const FooterView = ({ data }: FooterViewProps) => {
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
            to={data.links.privacy.to}
            style={{
              color: 'var(--color-muted)',
              textDecoration: 'none',
              transition: 'color var(--transition-fast)'
            }}
            onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--color-primary)'}
            onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--color-muted)'}
          >
            {data.links.privacy.text}
          </Link>
          <span>|</span>
          <a
            href={data.links.github.href}
            target={data.links.github.target}
            rel={data.links.github.rel}
            style={{
              color: 'var(--color-muted)',
              textDecoration: 'none',
              transition: 'color var(--transition-fast)'
            }}
            onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--color-primary)'}
            onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--color-muted)'}
          >
            {data.links.github.text}
          </a>
        </div>
        <div>
          <p style={{ margin: 0 }}>{data.copyright}</p>
        </div>
      </div>
    </footer>
  )
}