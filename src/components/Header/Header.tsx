import { StarLogo } from '../StarLogo'
import { AuthButton } from '../AuthButton'

export function Header() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          margin: '0 auto',
          maxWidth: '375px',
          padding: '0 1rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            height: '4rem',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flex: 1,
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                height: '2.5rem',
                width: '2.5rem',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <StarLogo
                style={{
                  height: '2.5rem',
                  width: '2.5rem',
                  color: 'var(--color-primary)',
                }}
              />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-main)',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: 'var(--color-text)',
              }}
            >
              MEMORU
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexShrink: 0,
            }}
          >
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  )
}
