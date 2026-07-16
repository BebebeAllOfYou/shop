/**
 * useTelegram — хук для отправки сообщений через Telegram Bot API
 *
 * Поддерживает два типа заявок:
 *   sendOrder(items, customer)      — заказ из корзины
 *   sendPartnership(formData)       — заявка на партнёрство
 */

import { useState, useCallback } from 'react'
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from '../config/telegram'

const API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

async function sendToTelegram(text) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('[useTelegram] Не заданы BOT_TOKEN или CHAT_ID в src/config/telegram.js')
    throw new Error('Telegram не настроен')
  }

  const res = await fetch(API_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      chat_id:    TELEGRAM_CHAT_ID,
      text,
      parse_mode: 'HTML',
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.description ?? `HTTP ${res.status}`)
  }
}

/** Форматирует дату и время по московскому времени */
function nowMSK() {
  return new Date().toLocaleString('ru-RU', {
    timeZone:    'Europe/Moscow',
    day:         '2-digit',
    month:       '2-digit',
    year:        'numeric',
    hour:        '2-digit',
    minute:      '2-digit',
  })
}

/** Строит текст заявки-заказа из корзины */
function buildOrderText(items, customer) {
  const fmt = n => Number(n).toLocaleString('ru-RU')

  const lines = items.map(item =>
    `• <b>${item.name}</b> — ${item.qty} шт. × ${fmt(item.price)} ₽ = ${fmt(item.price * item.qty)} ₽`
  )

  const total = items.reduce((s, i) => s + i.price * i.qty, 0)

  return [
    '🛒 <b>НОВЫЙ ЗАКАЗ</b>',
    '',
    `👤 Клиент: ${customer.name}`,
    `📞 Телефон: ${customer.phone}`,
    customer.comment ? `💬 Комментарий: ${customer.comment}` : '',
    '',
    '<b>Состав заказа:</b>',
    ...lines,
    '',
    `💰 <b>Итого: ${fmt(total)} ₽</b>`,
    '',
    `🕐 ${nowMSK()}`,
  ].filter(l => l !== null && l !== undefined).join('\n')
}

/** Строит текст заявки на партнёрство */
function buildPartnershipText(data) {
  return [
    '🤝 <b>ЗАЯВКА НА ПАРТНЁРСТВО</b>',
    '',
    `🏢 Компания / Имя: ${data.company}`,
    `📞 Телефон: ${data.phone}`,
    `📦 Объём закупки: ${data.volume || 'не указан'}`,
    data.comment ? `💬 Комментарий: ${data.comment}` : '',
    '',
    `🕐 ${nowMSK()}`,
  ].filter(Boolean).join('\n')
}

export function useTelegram() {
  const [sending, setSending] = useState(false)
  const [error,   setError]   = useState(null)

  const sendOrder = useCallback(async (items, customer) => {
    setSending(true)
    setError(null)
    try {
      await sendToTelegram(buildOrderText(items, customer))
      return true
    } catch (e) {
      setError(e.message)
      return false
    } finally {
      setSending(false)
    }
  }, [])

  const sendPartnership = useCallback(async (data) => {
    setSending(true)
    setError(null)
    try {
      await sendToTelegram(buildPartnershipText(data))
      return true
    } catch (e) {
      setError(e.message)
      return false
    } finally {
      setSending(false)
    }
  }, [])

  return { sendOrder, sendPartnership, sending, error }
}
