import { AuthButton } from '../AuthButton'

export const Header = () => {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-[375px] items-center justify-end px-4 py-3">
        <AuthButton />
      </div>
    </header>
  )
}
