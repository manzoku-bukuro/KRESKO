import { FooterView } from './Footer.view'
import { useFooterData } from './hooks/useFooterData'

export const Footer = () => {
  const { data } = useFooterData()

  return <FooterView data={data} />
}