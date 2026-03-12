'use client'
import AppShell from '@/components/layout/AppShell'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SIGNS, NAKSHATRAS, PLANETS, RODDEN_RATINGS, SIGN_SYMBOLS } from '@/types'
import type { Chart, SearchFilters } from '@/types'
import { Search, X, SlidersHorizontal } from 'lucide-react'

export default function SearchPage() {
  const [f, setF] = useState<SearchFilters>({})
  const [results, setResults] = useState<Chart[]|null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|null>(null)

  const set = (k: keyof SearchFilters, v: string) =>
    setF(prev => ({ ...prev, [k]: v||undefined }))

  const search = async () => {
    setLoading(true); setError(null)
    try {
      const sb = createClient()
      let q = sb.from('charts').select('*').order('name').limit(200)
      if (f.name)          q = q.ilike('name', `%${f.name}%`)
      if (f.keyword)       q = q.ilike('keywords', `%${f.keyword}%`)
      if (f.rodden_rating) q = q.eq('rodden_rating', f.rodden_rating)
      if (f.lagna_sign)    q = q.eq('lagna_sign', f.lagna_sign)
      if (f.lagna_nakshatra) q = q.eq('lagna_nakshatra', f.lagna_nakshatra)
      if (f.sun_sign)      q = q.eq('sun_sign', f.sun_sign)
      if (f.moon_sign)     q = q.eq('moon_sign', f.moon_sign)
      if (f.mars_sign)     q = q.eq('mars_sign', f.mars_sign)
      if (f.mercury_sign)  q = q.eq('mercury_sign', f.mercury_sign)
      if (f.jupiter_sign)  q = q.eq('jupiter_sign', f.jupiter_sign)
      if (f.venus_sign)    q = q.eq('venus_sign', f.venus_sign)
      if (f.saturn_sign)   q = q.eq('saturn_sign', f.saturn_sign)
      if (f.rahu_sign)     q = q.eq('rahu_sign', f.rahu_sign)
      if (f.ketu_sign)     q = q.eq('ketu_sign', f.ketu_sign)
      if (f.atmakaraka)    q = q.eq('atmakaraka', f.atmakaraka)
      if (f.amatyakaraka)  q = q.eq('amatyakaraka', f.amatyakaraka)
      const { data, error: err } = await q
      if (err) throw err
      setResults(data as Chart[])
    } catch(e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  const clear = () => { setF({}); setResults(null) }
  const karakas = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn']

  return (
    <AppShell>
      <div className="space-y-5 fade-up">
        <div>
          <h1 className="page-title">Search & Filter</h1>
          <p className="page-sub">Query charts by planetary positions, signs, nakshatras and more</p>
        </div>

        <div className="card p-6 space-y-5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gold"/>
            <span className="section-title">Filters</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="field-label">Name</label>
              <input className="field-input" placeholder="Search by name…" value={f.name||''} onChange={e=>set('name',e.target.value)}/></div>
            <div><label className="field-label">Keyword / Category</label>
              <input className="field-input" placeholder="e.g. Nobel Prize, Actor…" value={f.keyword||''} onChange={e=>set('keyword',e.target.value)}/></div>
            <div><label className="field-label">Rodden Rating</label>
              <select className="field-select" value={f.rodden_rating||''} onChange={e=>set('rodden_rating',e.target.value)}>
                <option value="">Any</option>
                {RODDEN_RATINGS.map(r=><option key={r}>{r}</option>)}
              </select></div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-ink-700">
            <div><label className="field-label">Lagna Sign</label>
              <select className="field-select" value={f.lagna_sign||''} onChange={e=>set('lagna_sign',e.target.value)}>
                <option value="">Any</option>{SIGNS.map(s=><option key={s}>{s}</option>)}
              </select></div>
            <div><label className="field-label">Lagna Nakshatra</label>
              <select className="field-select" value={f.lagna_nakshatra||''} onChange={e=>set('lagna_nakshatra',e.target.value)}>
                <option value="">Any</option>{NAKSHATRAS.map(n=><option key={n}>{n}</option>)}
              </select></div>
          </div>

          <div className="pt-3 border-t border-ink-700">
            <p className="section-title mb-3">Planet Signs</p>
            <div className="grid grid-cols-3 gap-3">
              {PLANETS.map(({key,label,symbol})=>(
                <div key={key}><label className="field-label">{symbol} {label}</label>
                  <select className="field-select" value={(f as any)[`${key}_sign`]||''} onChange={e=>set(`${key}_sign` as keyof SearchFilters,e.target.value)}>
                    <option value="">Any</option>{SIGNS.map(s=><option key={s}>{s}</option>)}
                  </select></div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-ink-700">
            <p className="section-title mb-3">Jaimini Karakas</p>
            <div className="grid grid-cols-2 gap-3">
              {[['atmakaraka','Atmakaraka'],['amatyakaraka','Amatyakaraka']].map(([key,label])=>(
                <div key={key}><label className="field-label">{label}</label>
                  <select className="field-select" value={(f as any)[key]||''} onChange={e=>set(key as keyof SearchFilters,e.target.value)}>
                    <option value="">Any</option>{karakas.map(p=><option key={p}>{p}</option>)}
                  </select></div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-3 border-t border-ink-700">
            <button className="btn-primary flex items-center gap-2" onClick={search} disabled={loading}>
              <Search className="w-4 h-4"/>{loading ? 'Searching…' : 'Search Charts'}
            </button>
            <button className="btn-ghost flex items-center gap-2" onClick={clear}>
              <X className="w-4 h-4"/>Clear
            </button>
          </div>
        </div>

        {error && <div className="card p-4 border-rose/30 text-rose text-sm">{error}</div>}

        {results && (
          <div className="card overflow-hidden">
            <div className="px-5 py-3 border-b border-ink-700 flex justify-between">
              <span className="section-title">Results</span>
              <span className="text-silver/30 text-xs">{results.length} found</span>
            </div>
            <table className="w-full text-sm">
              <thead className="border-b border-ink-700">
                <tr>{['Name','Date','Place','Lagna','Sun','Moon','Rating'].map(h=><th key={h} className="table-header">{h}</th>)}</tr>
              </thead>
              <tbody>
                {!results.length && <tr><td colSpan={7} className="text-center py-10 text-silver/20 text-sm">No charts match</td></tr>}
                {results.map(c=>(
                  <tr key={c.id} className="border-b border-ink-800 hover:bg-ink-800/50 transition-colors">
                    <td className="table-cell text-gold">{c.name}</td>
                    <td className="table-cell text-silver/50 font-mono text-xs">{c.date_of_birth||'—'}</td>
                    <td className="table-cell text-silver/50 text-xs">{c.place_of_birth||'—'}</td>
                    <td className="table-cell text-blue-300 text-xs">{c.lagna_sign?`${SIGN_SYMBOLS[c.lagna_sign]||''} ${c.lagna_sign}`:'—'}</td>
                    <td className="table-cell text-yellow-300 text-xs">{c.sun_sign?`${SIGN_SYMBOLS[c.sun_sign]||''} ${c.sun_sign}`:'—'}</td>
                    <td className="table-cell text-blue-200 text-xs">{c.moon_sign?`${SIGN_SYMBOLS[c.moon_sign]||''} ${c.moon_sign}`:'—'}</td>
                    <td className="table-cell">{c.rodden_rating&&<span className={c.rodden_rating==='AA'?'badge-green':'badge-gold'}>{c.rodden_rating}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  )
}
