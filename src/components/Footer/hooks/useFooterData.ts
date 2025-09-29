import { useMemo } from 'react'

interface FooterData {
  links: {
    privacy: {
      text: string
      to: string
    }
    github: {
      text: string
      href: string
      target: string
      rel: string
    }
  }
  copyright: string
}

export type { FooterData }

export const useFooterData = () => {
  const data: FooterData = useMemo(() => ({
    links: {
      privacy: {
        text: 'プライバシーポリシー',
        to: '/privacy-policy'
      },
      github: {
        text: 'GitHub',
        href: 'https://github.com/manzoku-bukuro/MEMORU',
        target: '_blank',
        rel: 'noopener noreferrer'
      }
    },
    copyright: '© 2025 MEMORU. All rights reserved.'
  }), [])

  return {
    data
  }
}