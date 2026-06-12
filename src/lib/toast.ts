/** Tiny global toast: any component can call toast(...); the Toaster in
 *  AppLayout listens for the event and renders it. No context/prop drilling. */
export type ToastKind = 'info' | 'success' | 'warn'
export interface ToastDetail { msg: string; kind: ToastKind }

export function toast(msg: string, kind: ToastKind = 'info') {
  window.dispatchEvent(new CustomEvent<ToastDetail>('cxs-toast', { detail: { msg, kind } }))
}
