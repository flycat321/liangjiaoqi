const STORAGE_KEY = 'protractor_demo_user'

export interface DemoUser {
  name: string
  phone: string
  role: 'admin' | 'client'
}

// Demo accounts - works without Supabase
const DEMO_ACCOUNTS: Record<string, { password: string; user: DemoUser }> = {
  '18629148762': { password: 'admin123', user: { name: '郭高亮', phone: '18629148762', role: 'admin' } },
  '13800001111': { password: '123456', user: { name: '张伟', phone: '13800001111', role: 'client' } },
  '13800002222': { password: '123456', user: { name: '李婷', phone: '13800002222', role: 'client' } },
}

export function demoLogin(phone: string, password: string): DemoUser | null {
  const account = DEMO_ACCOUNTS[phone]
  if (!account || account.password !== password) return null
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account.user))
  }
  return account.user
}

/** Save authenticated user info to localStorage (for Supabase-authed users) */
export function demoSetUser(user: DemoUser): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  }
}

export function demoGetUser(): DemoUser | null {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return null
  try { return JSON.parse(data) } catch { return null }
}

export function demoLogout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function demoAddAccount(phone: string, password: string, name: string): void {
  DEMO_ACCOUNTS[phone] = { password, user: { name, phone, role: 'client' } }
}

export { DEMO_ACCOUNTS }
