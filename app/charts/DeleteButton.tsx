'use client'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter()
  const handle = async () => {
    if (!confirm('Delete this chart?')) return
    await createClient().from('charts').delete().eq('id', id)
    router.refresh()
  }
  return (
    <button onClick={handle} className="btn-danger p-1.5">
      <Trash2 className="w-3.5 h-3.5"/>
    </button>
  )
}
