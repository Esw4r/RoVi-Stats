import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export const formatDate = (date) => dayjs(date).format('MMM D, YYYY')

export const formatDateTime = (date) => dayjs(date).format('MMM D, YYYY · HH:mm')

export const formatRelative = (date) => dayjs(date).fromNow()

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)

export const formatNumber = (num) =>
  new Intl.NumberFormat('en-IN').format(num)

export const formatPercent = (value) => `${(value * 100).toFixed(1)}%`

export const getSeverityWeight = (severity) => {
  const weights = { low: 1, medium: 2, high: 3, critical: 4 }
  return weights[severity] || 0
}
