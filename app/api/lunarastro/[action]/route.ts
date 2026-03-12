import { NextRequest, NextResponse } from 'next/server'

const BASE = 'https://astrodatabank.lunarastro.com/lunarastrodataresearch/'
const HDRS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Referer': BASE,
}

function parseTable(html: string) {
  const results: any[] = []
  // Match table rows
  const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi
  const cellRe = /<td[^>]*>([\s\S]*?)<\/td>/gi
  const linkRe = /href="([^"]+)"/i
  const stripTags = (s: string) => s.replace(/<[^>]+>/g,'').trim()

  let rowMatch
  let rowIndex = 0
  while ((rowMatch = rowRe.exec(html)) !== null) {
    if (rowIndex++ === 0) continue // skip header
    const cells: string[] = []
    let cellMatch
    const cellReCopy = new RegExp(cellRe.source, 'gi')
    while ((cellMatch = cellReCopy.exec(rowMatch[1])) !== null) {
      cells.push(cellMatch[1])
    }
    if (cells.length >= 5) {
      const name = stripTags(cells[1])
      if (!name) continue
      results.push({
        name,
        date: stripTags(cells[2]),
        time: stripTags(cells[3]),
        place: stripTags(cells[4]),
        rodden_rating: cells[5] ? stripTags(cells[5]) : null,
      })
    }
  }
  return results
}

function parseDate(s: string): string|null {
  if (!s) return null
  const f1 = s.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (f1) { try { return new Date(+f1[3],+f1[2]-1,+f1[1]).toISOString().split('T')[0] } catch{} }
  const f2 = s.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (f2) return s
  return null
}

function parseTime(s: string): string|null {
  if (!s) return null
  const m = s.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/)
  if (m) return `${m[1].padStart(2,'0')}:${m[2]}:${m[3]||'00'}`
  return null
}

async function scrape(formData: Record<string,string>) {
  const getRes = await fetch(BASE, { headers: HDRS })
  const cookies = getRes.headers.get('set-cookie')||''
  const body = new URLSearchParams(formData)
  const res = await fetch(BASE, {
    method:'POST',
    headers:{...HDRS,'Content-Type':'application/x-www-form-urlencoded','Cookie':cookies},
    body: body.toString(),
  })
  return parseTable(await res.text())
}

export async function POST(req: NextRequest, { params }: { params: { action: string } }) {
  const { action } = params
  const { search_type, query, day, month, year } = await req.json()

  try {
    let form: Record<string,string> = {}
    if (search_type==='name')    form = { searchName: query, nameCriteria:'AnyWhere', searchType:'name' }
    else if (search_type==='keyword') form = { keyword: query, keywordType:'all', searchType:'keyword' }
    else if (search_type==='rodden')  form = { roddenRating: query, searchType:'rodden' }
    else if (search_type==='dob')     form = { dobDay: day, dobMonth: month, dobYear: year, searchType:'dob' }

    const results = await scrape(form)

    if (action==='preview') return NextResponse.json({ results, count: results.length })

    // Import
    const { createClient } = await import('@/lib/supabase/server')
    const sb = createClient()
    let imported = 0

    for (const r of results) {
      const { data: ex } = await sb.from('charts').select('id').eq('name', r.name).limit(1)
      if (ex && ex.length > 0) continue
      await sb.from('charts').insert({
        name: r.name,
        date_of_birth: parseDate(r.date),
        time_of_birth: parseTime(r.time),
        place_of_birth: r.place || null,
        rodden_rating: r.rodden_rating || null,
        source: 'lunarastro',
      })
      imported++
    }

    return NextResponse.json({ message:`Found ${results.length} charts, imported ${imported} new`, found: results.length, imported })
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
