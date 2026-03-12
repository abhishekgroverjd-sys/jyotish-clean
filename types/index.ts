export type RoddenRating = 'AA' | 'A' | 'B' | 'C' | 'DD' | 'X' | 'XX' | 'NA'

export interface Chart {
  id: number
  name: string
  gender?: string
  date_of_birth?: string
  time_of_birth?: string
  place_of_birth?: string
  latitude?: number
  longitude?: number
  rodden_rating?: RoddenRating
  keywords?: string
  source?: string
  source_id?: string
  notes?: string
  lagna_sign?: string; lagna_nakshatra?: string; lagna_navamsha?: string; lagna_degree?: number
  sun_sign?: string; sun_nakshatra?: string; sun_degree?: number
  moon_sign?: string; moon_nakshatra?: string; moon_degree?: number
  mars_sign?: string; mars_nakshatra?: string; mars_degree?: number
  mercury_sign?: string; mercury_nakshatra?: string; mercury_degree?: number
  jupiter_sign?: string; jupiter_nakshatra?: string; jupiter_degree?: number
  venus_sign?: string; venus_nakshatra?: string; venus_degree?: number
  saturn_sign?: string; saturn_nakshatra?: string; saturn_degree?: number
  rahu_sign?: string; rahu_nakshatra?: string; rahu_degree?: number
  ketu_sign?: string; ketu_nakshatra?: string; ketu_degree?: number
  atmakaraka?: string; amatyakaraka?: string; bhratrikaraka?: string
  matrikaraka?: string; apatyakaraka?: string; jnyatikaraka?: string; darakaraka?: string
  created_at?: string; updated_at?: string
}

export interface SearchFilters {
  name?: string; keyword?: string; rodden_rating?: string
  lagna_sign?: string; lagna_nakshatra?: string
  sun_sign?: string; moon_sign?: string; mars_sign?: string
  mercury_sign?: string; jupiter_sign?: string; venus_sign?: string
  saturn_sign?: string; rahu_sign?: string; ketu_sign?: string
  atmakaraka?: string; amatyakaraka?: string
}

export const SIGNS = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'
]

export const NAKSHATRAS = [
  'Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra',
  'Punarvasu','Pushya','Ashlesha','Magha','PurvaPhalguni','UttaraPhalguni',
  'Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha',
  'Moola','PurvaAshadha','UttaraAshadha','Shravana','Dhanishtha',
  'Shatabhisha','PurvaBhadra','UttaraBhadra','Revati'
]

export const PLANETS = [
  { key: 'sun',     label: 'Sun',     symbol: '☉' },
  { key: 'moon',    label: 'Moon',    symbol: '☽' },
  { key: 'mars',    label: 'Mars',    symbol: '♂' },
  { key: 'mercury', label: 'Mercury', symbol: '☿' },
  { key: 'jupiter', label: 'Jupiter', symbol: '♃' },
  { key: 'venus',   label: 'Venus',   symbol: '♀' },
  { key: 'saturn',  label: 'Saturn',  symbol: '♄' },
  { key: 'rahu',    label: 'Rahu',    symbol: '☊' },
  { key: 'ketu',    label: 'Ketu',    symbol: '☋' },
]

export const SIGN_SYMBOLS: Record<string, string> = {
  Aries:'♈', Taurus:'♉', Gemini:'♊', Cancer:'♋',
  Leo:'♌', Virgo:'♍', Libra:'♎', Scorpio:'♏',
  Sagittarius:'♐', Capricorn:'♑', Aquarius:'♒', Pisces:'♓'
}

export const PLANET_COLORS: Record<string, string> = {
  sun:'#f0c040', moon:'#c8d8f0', mars:'#e86060',
  mercury:'#80d880', jupiter:'#f0a840', venus:'#e886c0',
  saturn:'#a89080', rahu:'#9080c0', ketu:'#c09060', lagna:'#5b9fd4'
}

export const RODDEN_RATINGS: RoddenRating[] = ['AA','A','B','C','DD','X','XX','NA']
