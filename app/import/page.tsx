'use client'
import AppShell from '@/components/layout/AppShell'
import { useState } from 'react'
import { RODDEN_RATINGS } from '@/types'
import { Download, Eye, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

type SearchType = 'name'|'keyword'|'rodden'|'dob'

export default function ImportPage() {
  const [searchType, setSearchType] = useState<SearchType>('name')
  const [query, setQuery] = useState('')
  const [rodden, setRodden] = useState('AA')
  const [dob, setDob] = useState({day:'',month:'',year:''})
  const [preview, setPreview] = useState<any[]|null>(null)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'preview'|'import'|null>(null)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string|null>(null)

  const body = () => ({
    search_type: searchType,
    query: searchType==='rodden' ? rodden : query,
    ...( searchType==='dob' ? dob : {} ),
  })

  const call = async (action: string) => {
    setLoading(true); setError(null); setResult(null); setPreview(null)
    try {
      const res = await fetch(`/api/lunarastro/${action}`, {
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body())
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error||'Failed')
      return data
    } catch(e:any) { setError(e.message); return null }
    finally { setLoading(false) }
  }

  const types: [SearchType,string][] = [
    ['name','By Name'],['keyword','By Keyword'],['rodden','By Rodden Rating'],['dob','By Date of Birth']
  ]

  return (
    <AppShell>
      <div className="space-y-5 fade-up">
        <div>
          <h1 className="page-title">Import from Lunarastro</h1>
          <p className="page-sub">Search the Lunarastro databank and save charts to your database</p>
        </div>

        <div className="card p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-gold"/>
            <span className="section-title">Search Lunarastro</span>
          </div>

          <div className="flex gap-2 flex-wrap">
            {types.map(([val,label])=>(
              <button key={val} onClick={()=>setSearchType(val)}
                className={`px-4 py-2 rounded-lg text-xs border transition-all uppercase tracking-wider
                  ${searchType===val?'bg-ink-600 border-gold/40 text-gold':'bg-ink-800 border-ink-600 text-silver/60 hover:text-silver'}`}>
                {label}
              </button>
            ))}
          </div>

          {(searchType==='name'||searchType==='keyword') && (
            <div><label className="field-label">{searchType==='name'?'Person Name':'Keyword (e.g. Nobel Prize, Actor)'}</label>
              <input className="field-input" placeholder={searchType==='name'?'e.g. Einstein':'e.g. Nobel Prize'}
                value={query} onChange={e=>setQuery(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&call('preview').then(d=>d&&setPreview(d.results))}/></div>
          )}
          {searchType==='rodden' && (
            <div><label className="field-label">Rodden Rating</label>
              <select className="field-select w-40" value={rodden} onChange={e=>setRodden(e.target.value)}>
                {RODDEN_RATINGS.map(r=><option key={r}>{r}</option>)}
              </select></div>
          )}
          {searchType==='dob' && (
            <div className="grid grid-cols-3 gap-3">
              {[['Day','day'],['Month','month'],['Year','year']].map(([l,k])=>(
                <div key={k}><label className="field-label">{l}</label>
                  <input className="field-input" type="number" placeholder={l}
                    value={(dob as any)[k]} onChange={e=>setDob(d=>({...d,[k]:e.target.value}))}/></div>
              ))}
            </div>
          )}

          <div className="flex gap-3 pt-3 border-t border-ink-700">
            <button className="btn-ghost flex items-center gap-2" disabled={loading}
              onClick={()=>{setMode('preview'); call('preview').then(d=>d&&setPreview(d.results))}}>
              {loading&&mode==='preview'?<Loader2 className="w-4 h-4 animate-spin"/>:<Eye className="w-4 h-4"/>}Preview
            </button>
            <button className="btn-primary flex items-center gap-2" disabled={loading}
              onClick={()=>{setMode('import'); call('import').then(d=>d&&setResult(d))}}>
              {loading&&mode==='import'?<Loader2 className="w-4 h-4 animate-spin"/>:<Download className="w-4 h-4"/>}
              {loading&&mode==='import'?'Importing…':'Import to Database'}
            </button>
          </div>
        </div>

        {error && <div className="card p-4 border-rose/30 flex items-center gap-3 text-rose"><AlertCircle className="w-5 h-5"/><p className="text-sm">{error}</p></div>}
        {result && <div className="card p-4 border-teal/30 flex items-center gap-3 text-teal"><CheckCircle className="w-5 h-5"/><div><p className="text-sm font-bold">{result.message}</p><p className="text-xs opacity-60 mt-0.5">{result.imported} new charts saved</p></div></div>}

        {preview && (
          <div className="card overflow-hidden">
            <div className="px-5 py-3 border-b border-ink-700 flex justify-between">
              <span className="section-title">Preview — {preview.length} charts found</span>
            </div>
            <table className="w-full text-sm">
              <thead className="border-b border-ink-700">
                <tr>{['#','Name','Date','Time','Place','Rating'].map(h=><th key={h} className="table-header">{h}</th>)}</tr>
              </thead>
              <tbody>
                {!preview.length&&<tr><td colSpan={6} className="text-center py-10 text-silver/20 text-sm">No results found</td></tr>}
                {preview.map((r,i)=>(
                  <tr key={i} className="border-b border-ink-800 hover:bg-ink-800/50 transition-colors">
                    <td className="table-cell text-silver/30 font-mono text-xs">{i+1}</td>
                    <td className="table-cell text-gold">{r.name}</td>
                    <td className="table-cell text-silver/50 font-mono text-xs">{r.date||'—'}</td>
                    <td className="table-cell text-silver/50 font-mono text-xs">{r.time||'—'}</td>
                    <td className="table-cell text-silver/50 text-xs">{r.place||'—'}</td>
                    <td className="table-cell">{r.rodden_rating&&<span className="badge-gold">{r.rodden_rating}</span>}</td>
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
