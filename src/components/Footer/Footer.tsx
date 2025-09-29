import { FooterView } from './Footer.View'
import { useFooterData } from './hooks/useFooterData'

export const Footer = () => {
  const { data } = useFooterData()

  return <FooterView data={data} />
}