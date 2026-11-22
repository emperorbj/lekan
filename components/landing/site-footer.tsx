import { Logo } from "@/components/brand/logo"

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-10 sm:flex-row sm:items-center sm:px-8">
        <div>
          <Logo />
          <p className="mt-2 text-sm text-muted-foreground">The assistant that asks before it acts.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <a href="#capabilities" className="hover:text-foreground">Capabilities</a>
          <a href="#approvals" className="hover:text-foreground">Approvals</a>
          <a href="#trust" className="hover:text-foreground">Trust</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </nav>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Lekan</p>
      </div>
    </footer>
  )
}
