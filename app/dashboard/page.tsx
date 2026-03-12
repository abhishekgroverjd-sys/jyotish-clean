import AppShell from '@/components/layout/AppShell'
import { createClient } from '@/lib/supabase/server'
import { Database, Clock, Star, MapPin } from 'lucide-react'

export const revalidate = 60

function countBy(arr: Record<string,string>[], key: string) {
  const map: Record<string, number> = {}
  arr.forEach(r => { const v = r[key]; if (v) map[v] = (map[v]||0)+1 })
  return Object.entries(map).map(([name,count]) => ({name,count})).sort((a,b)=>b.count-a.count)
}

export default async function DashboardPage() {
  const supabase = createClient()

  const [
    { count: total },
    { count: withTime },
    { count: aaRated },
    { count: withPlace },
    { data: lagnaRaw },
    { data: roddenRaw },
  ] = await Promise.all([
    supabase.from('charts').select('*',{count:'exact',head:true}),
    supabase.from('charts').select('*',{count:'exact',head:true}).not('time_of_birth','is',null),
    supabase.from('charts').select('*',{count:'exact',head:true}).eq('rodden_rating','AA'),
    supabase.from('charts').select('*',{count:'exact',head:true}).not('place_of_birth','is',null),
    supabase.from('charts').select('lagna_sign').not('lagna_sign','is',null),
    supabase.from('charts').select('rodden_rating').not('rodden_rating','is',null),
  ])

  const lagna = countBy(lagnaRaw as any||[], 'lagna_sign')
  const rodden = countBy(roddenRaw as any||[], 'rodden_rating')

  const stats = [
    { label:'Total Charts',    value: total??0,    icon: Database, color:'text-gold' },
    { label:'With Birth Time', value: withTime??0,  icon: Clock,    color:'text-rose' },
    { label:'AA Rated',        value: aaRated??0,   icon: Star,     color:'text-teal' },
    { label:'With Place',      value: withPlace??0, icon: MapPin,   color:'text-blue-400' },
  ]

  return (
    <AppShell>
      <div className="space-y-6 fade-up">
        <div>
          <h1 className="page-title">Research Dashboard</h1>
          <p className="page-sub">Overview of your astrological chart database</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({label,value,icon:Icon,color}) => (
            <div key={label} className="card p-5 flex items-center gap-4">
              <div className={`p-2.5 rounded-lg bg-ink-800 ${color}`}><Icon className="w-5 h-5"/></div>
              <div>
                <p className="text-silver/50 text-xs uppercase tracking-wider">{label}</p>
                <p className={`text-2xl font-display mt-0.5 ${color}`}>{value.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="card p-5">
            <p className="section-title mb-4">Lagna Distribution</p>
            {lagna.length ? (
              <div className="space-y-2">
                {lagna.map((item,i) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <span className="text-silver/50 text-xs w-24 truncate">{item.name}</span>
                    <div className="flex-1 bg-ink-800 rounded h-4 overflow-hidden">
                      <div className="h-full rounded" style={{width:`${(item.count/lagna[0].count)*100}%`, background:'#c9a84c', opacity: 1 - i*0.06}}/>
                    </div>
                    <span className="text-silver/40 text-xs w-6 text-right">{item.count}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-silver/20 text-sm mt-4">No data yet — import charts to begin</p>}
          </div>

          <div className="card p-5">
            <p className="section-title mb-4">Rodden Rating Breakdown</p>
            {rodden.length ? (
              <div className="flex flex-wrap gap-3">
                {rodden.map(r => (
                  <div key={r.name} className="card px-5 py-3 text-center">
                    <span className="text-gold font-display text-xl block">{r.name}</span>
                    <span className="text-silver/40 text-xs mt-1 block">{r.count} charts</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-silver/20 text-sm mt-4">No data yet</p>}
          </div>
        </div>

        {(total??0) === 0 && (
          <div className="card p-12 text-center">
            <Star className="w-10 h-10 text-gold/20 mx-auto mb-3"/>
            <p className="text-gold/50 font-display text-lg mb-1">No charts yet</p>
            <p className="text-silver/30 text-sm">Go to <strong className="text-silver/50">Import</strong> to bring in charts from Lunarastro</p>
          </div>
        )}
      </div>
    </AppShell>
  )
}
