import { format, formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'yyyy年M月d日', { locale: zhCN })
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'yyyy年M月d日 HH:mm', { locale: zhCN })
}

export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: zhCN })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatArea(sqm: number): string {
  return `${sqm}㎡`
}
