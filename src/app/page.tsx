import { PublicHeader } from '@/components/layout/PublicHeader'
import { HeroSection } from '@/components/brand/HeroSection'
import { PainPoints } from '@/components/brand/PainPoints'
import { Positioning } from '@/components/brand/Positioning'
// import { FounderProfile } from '@/components/brand/FounderProfile'
import { ValueCards } from '@/components/brand/ValueCards'
import { TwoEngines } from '@/components/brand/TwoEngines'
import { CraftSystems } from '@/components/brand/CraftSystems'
import { CraftCard } from '@/components/brand/CraftCard'
import { SupplierSystem } from '@/components/brand/SupplierSystem'
import { ServiceTimeline } from '@/components/brand/ServiceTimeline'
import { PricingTable } from '@/components/brand/PricingTable'
import { WhyProtractor } from '@/components/brand/WhyProtractor'
import { QualityPromise } from '@/components/brand/QualityPromise'
import { IdealClient } from '@/components/brand/IdealClient'
import { ContactCTA } from '@/components/brand/ContactCTA'
import { Footer } from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <>
      <PublicHeader />
      <main>
        <HeroSection />
        <PainPoints />
        <Positioning />
        {/* <FounderProfile /> */}
        <ValueCards />
        <TwoEngines />
        <CraftSystems />
        <CraftCard />
        <SupplierSystem />
        <ServiceTimeline />
        <PricingTable />
        <WhyProtractor />
        <QualityPromise />
        <IdealClient />
        <ContactCTA />
      </main>
      <Footer />
    </>
  )
}
