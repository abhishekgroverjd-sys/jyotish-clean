import AppShell from '@/components/layout/AppShell'
import { createClient } from '@/lib/supabase/server'
import { SIGN_SYMBOLS } from '@/types'
import DeleteButton from './DeleteButton'

export const revalidate = 0

export default async function ChartsPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page||'0')
  const limit = 50
  const supabase = createClient()

  const { data: charts, count } = await supabase
    .from('charts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(page*limit, (page+1)*limit-1)

  const total = count??0
  const totalPages = Math.ceil(total/limit)

  return (
    <AppShell>
      <div className="space-y-5 fade-up">
        <div>
          <h1 className="page-title">Chart Database</h1>
          <p className="page-sub">{total.toLocaleString()} charts stored</p>
        </div>

        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-ink-700">
              <tr>
                {['Name','Date of Birth','Place','Lagna','Sun','Moon','Rating',''].map(h => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!charts?.length && (
                <tr><td colSpan={8} className="text-center py-16 text-silver/20">
                  <p className="font-display text-base mb-1">No charts yet</p>
                  <p className="text-xs">Go to Import to bring charts from Lunarastro</p>
                </td></tr>
              )}
              {charts?.map(c => (
                <tr key={c.id} className="border-b border-ink-800 hover:bg-ink-800/50 transition-colors">
                  <td className="table-cell text-gold">{c.name}</td>
                  <td className="table-cell text-silver/50 font-mono text-xs">{c.date_of_birth||'—'}</td>
                  <td className="table-cell text-silver/50 text-xs">{c.place_of_birth||'—'}</td>
                  <td className="table-cell text-blue-300 text-xs">{c.lagna_sign ? `${SIGN_SYMBOLS[c.lagna_sign]||''} ${c.lagna_sign}` : '—'}</td>
                  <td className="table-cell text-yellow-300 text-xs">{c.sun_sign ? `${SIGN_SYMBOLS[c.sun_sign]||''} ${c.sun_sign}` : '—'}</td>
                  <td className="table-cell text-blue-200 text-xs">{c.moon_sign ? `${SIGN_SYMBOLS[c.moon_sign]||''} ${c.moon_sign}` : '—'}</td>
                  <td className="table-cell">
                    {c.rodden_rating && <span className={c.rodden_rating==='AA' ? 'badge-green' : 'badge-gold'}>{c.rodden_rating}</span>}
                  </td>
                  <td className="table-cell"><DeleteButton id={c.id}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <span className="text-silver/30 text-xs">Page {page+1} of {totalPages}</span>
            <div className="flex gap-2">
              {page > 0 && <a href={`/charts?page=${page-1}`} className="btn-ghost py-2 px-4">← Prev</a>}
              {page < totalPages-1 && <a href={`/charts?page=${page+1}`} className="btn-ghost py-2 px-4">Next →</a>}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
