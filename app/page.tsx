import { Approvals } from "@/components/landing/approvals"
import { Capabilities } from "@/components/landing/capabilities"
import { Faq } from "@/components/landing/faq"
import { FinalCta } from "@/components/landing/final-cta"
import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Integrations } from "@/components/landing/integrations"
import { Principles } from "@/components/landing/principles"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Integrations />
        <Capabilities />
        <Approvals />
        <HowItWorks />
        <Principles />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  )
}
