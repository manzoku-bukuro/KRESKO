import { useMenu } from './hooks/useMenu'
import { MenuView } from './Menu.view'

export const Menu = () => {
  const props = useMenu()
  return <MenuView {...props} />
}