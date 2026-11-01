import { useEffect } from 'react'
import { useUI } from '../store/ui'
import { Alert, Check } from './Icons'

/** Bottom-centre, 4 s, polite live region. The region is always mounted so screen readers catch updates. */
export function Toast() {
  const toast = useUI((s) => s.toast)
  const clear = useUI((s) => s.clearToast)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(clear, 4000)
    return () => clearTimeout(t)
  }, [toast, clear])

  return (
    <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      {toast && (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 rounded-full border border-line bg-surface px-5 py-3 text-sm shadow-none"
        >
          {toast.kind === 'success' ? (
            <Check className="text-success" width={18} height={18} />
          ) : (
            <Alert className="text-danger" width={18} height={18} />
          )}
          {toast.text}
        </div>
      )}
    </div>
  )
}
