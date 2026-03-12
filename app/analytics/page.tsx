'use client'
import AppShell from '@/components/layout/AppShell'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PLANETS, PLANET_COLORS } from '@/types'

const PALETTE = ['#c9a84c','#e86fa8','#60a8e8','#80d880','#f0a840','#9080c0','#e86060','#c8d8f0','#a89080','#c09060','#60c0f0','#d880d8']

function countBy(arr: any[], key: string) {
  const map: Record<string,number> = {}
  arr.forEach(r=>{ const v=r[key]; if(v) map[v]=(map[v]||0)+1 })
  return Object.entries(map).map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count)
}

export default function AnalyticsPage() {
  const [planet, setPlanet] = useState('moon')
  const [mode, setMode] = useState<'sign'|'nakshatra'>('sign')
  const [data, setData] = useState<any[]>([])
  const [keywords, setKeywords] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    const load = async () => {
      setLoading(true)
      const sb = createClient()
      const col = mode==='sign' ? `${planet}_sign` : `${planet}_nakshatra`
      const [{ data: pd }, { data: kd }] = await Promise.all([
        sb.from('charts').select(col).not(col,'is',null),
        sb.from('charts').select('keywords').not('keywords','is',null),
      ])
      setData(countBy(pd||[], col))
      const kwMap: Record<string,number> = {}
      kd?.forEach((r:any)=>{ r.keywords?.split(',').forEach((k:string)=>{ const kk=k.trim().toLowerCase(); if(kk) kwMap[kk]=(kwMap[kk]||0)+1 }) })
      setKeywords(Object.entries(kwMap).map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count).slice(0,20))
      setLoading(false)
    }
    load()
  },[planet,mode])

  const color = (PLANET_COLORS as any)[planet] || '#c9a84c'

  return (
    <AppShell>
      <div className="space-y-5 fade-up">
        <div>
          <h1 className="page-title">Analytics & Patterns</h1>
          <p className="page-sub">Visualise distributions across your chart database</p>
        </div>

        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <span className="section-title">Planetary Distribution</span>
            <div className="flex gap-2 flex-wrap">
              <select className="field-select w-auto text-xs" value={planet} onChange={e=>setPlanet(e.target.value)}>
                <option value="lagna">Lagna</option>
                {PLANETS.map(p=><option key={p.key} value={p.key}>{p.symbol} {p.label}</option>)}
              </select>
              {(['sign','nakshatra'] as const).map(m=>(
                <button key={m} onClick={()=>setMode(m)}
                  className={`px-3 py-1.5 rounded text-xs border transition-all uppercase tracking-wider
                    ${mode===m?'bg-ink-600 border-gold/40 text-gold':'bg-ink-800 border-ink-600 text-silver/60'}`}>{m}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="h-48 flex items-center justify-center text-silver/20 text-sm">Loading…</div>
          ) : data.length ? (
            <div className="space-y-2 max-h-80 overflow-auto">
              {data.map((item,i)=>(
                <div key={item.name} className="flex items-center gap-3">
                  <span className="text-silver/50 text-xs w-32 truncate">{item.name}</span>
                  <div className="flex-1 bg-ink-800 rounded h-5 overflow-hidden">
                    <div className="h-full rounded flex items-center px-2 text-xs text-ink-950 font-mono"
                      style={{width:`${(item.count/data[0].count)*100}%`, background: PALETTE[i%PALETTE.length]}}>
                      {item.count}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-silver/20 text-sm">No data — import charts first</div>
          )}
        </div>

        <div className="card p-5">
          <p className="section-title mb-4">Top Keywords</p>
          {keywords.length ? (
            <div className="space-y-2">
              {keywords.map((kw,i)=>(
                <div key={kw.name} className="flex items-center gap-3">
                  <span className="text-silver/30 font-mono text-xs w-5">{i+1}</span>
                  <div className="flex-1 bg-ink-800 rounded h-5 overflow-hidden">
                    <div className="h-full rounded flex items-center px-2 text-xs text-ink-950 font-mono"
                      style={{width:`${(kw.count/keywords[0].count)*100}%`, background: PALETTE[i%PALETTE.length]}}>
                      {kw.name}
                    </div>
                  </div>
                  <span className="text-silver/40 text-xs font-mono w-8 text-right">{kw.count}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-silver/20 text-sm">No keyword data yet</p>}
        </div>
      </div>
    </AppShell>
  )
}
