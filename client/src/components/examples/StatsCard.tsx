import StatsCard from '../StatsCard'
import { Users } from 'lucide-react'

export default function StatsCardExample() {
  return (
    <div className="w-full max-w-sm">
      <StatsCard
        title="Tổng Users"
        value="1,234"
        icon={Users}
        description="Tổng số người dùng"
        trend={{ value: "+12.5%", isPositive: true }}
      />
    </div>
  )
}
