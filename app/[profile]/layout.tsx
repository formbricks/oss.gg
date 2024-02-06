import { getCurrentUser } from "@/lib/session"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { SiteFooter } from "@/components/site-footer"

interface ProfileLayoutProps {
  children?: React.ReactNode
}

export default async function ProfileLayout({ children }: ProfileLayoutProps) {
  const user = await getCurrentUser()

  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-gradient-to-br from-slate-950 to-slate-800 h-[35vh]">
        <header className="sticky top-0 z-40 max-w-6xl px-8 mx-auto py-6 justify-between flex">
          <Logo theme="dark" />
          <Button href="/">What is oss.gg?</Button>
        </header>
      </div>
      <div className="">
        <main className="flex max-w-6xl px-8 min-h-[65vh] mx-auto flex-1 flex-col">
          {children}
        </main>
      </div>
      <SiteFooter className="border-t" />
    </div>
  )
}
