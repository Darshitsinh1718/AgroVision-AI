// src/pages/AnalyticsPage.jsx
import { BarChart3 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'

export default function AnalyticsPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader badge="Insights" title="Yield Analytics" subtitle="Season-over-season yield performance, soil health trends, and crop success rates." />
      <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed">
        <div className="w-16 h-16 rounded-2xl bg-harvest-950 flex items-center justify-center mb-4">
          <BarChart3 size={32} className="text-harvest-400" />
        </div>
        <h3 className="font-medium text-stone-300 mb-2">Analytics Dashboard</h3>
        <p className="text-sm text-stone-600 max-w-md">
          Connect your field sensors and historical data to unlock full yield analytics,
          soil health trends, and AI-powered season forecasts.
        </p>
        <div className="mt-4 stat-pill bg-harvest-950 text-harvest-400 border border-harvest-800/50">
          Full charts coming in v1.1
        </div>
      </Card>
    </div>
  )
}
