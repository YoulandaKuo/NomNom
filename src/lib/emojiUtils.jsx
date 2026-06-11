import React from 'react'

const TWEMOJI_BASE = 'https://cdn.jsdelivr.net/npm/twemoji@14.0.2/assets/72x72'

export function emojiToImageUrl(emoji) {
  if (!emoji) return null
  const codepoints = [...emoji]
    .map(c => c.codePointAt(0))
    .filter(cp => cp !== 0xfe0f)
    .map(cp => cp.toString(16))
    .join('-')
  return `${TWEMOJI_BASE}/${codepoints}.png`
}

export function EmojiImage({ emoji, size = 38, filter }) {
  const [failed, setFailed] = React.useState(false)
  const url = emojiToImageUrl(emoji)
  if (!url || failed) {
    return <span style={{ fontSize: size, lineHeight: 1, filter }}>{emoji}</span>
  }
  return (
    <img
      src={url}
      alt={emoji}
      width={size}
      height={size}
      onError={() => setFailed(true)}
      style={{ objectFit: 'contain', display: 'block', filter }}
    />
  )
}
