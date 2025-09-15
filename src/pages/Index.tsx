import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Header } from '@/components/Header'
import { HeroSection } from '@/components/HeroSection'
import { ReportForm } from '@/components/ReportForm'
import { ComplianceInbox } from '@/components/ComplianceInbox'

type View = 'home' | 'submit' | 'inbox'

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('home')
  const { isConnected } = useAccount()

  const renderView = () => {
    switch (currentView) {
      case 'submit':
        return <ReportForm onBack={() => setCurrentView('home')} />
      case 'inbox':
        return <ComplianceInbox onBack={() => setCurrentView('home')} />
      default:
        return (
          <HeroSection
            onSubmitReport={() => setCurrentView('submit')}
            onViewInbox={() => setCurrentView('inbox')}
            isConnected={isConnected}
          />
        )
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {renderView()}
      </main>
    </div>
  )
}

export default Index