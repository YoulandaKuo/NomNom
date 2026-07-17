import { useApp } from '../../context/AppContext'
import { CATEGORY_MAP, REACTION_MAP } from '../../lib/preloadedFoods'
import { EmojiImage } from '../../lib/emojiUtils.jsx'
import { useT } from '../../lib/i18n'
import { translateFoodName } from '../../lib/foodNameTranslations'

const REACTION_FACE = {
  loved:     { mood: 'love',  mouth: 'M6 13 q6 7 12 0' },
  meh:       { mood: 'meh',   mouth: 'M7 14.5 q2.5 -2.5 5 0 q2.5 2.5 5 0' },
  neutral:   { mood: 'meh',   mouth: 'M7.5 14 h9' },
  allergic:  { mood: 'no',    mouth: 'M7 15 q5 -4 10 0' },
  not_tried: { mood: 'meh',   mouth: 'M7.5 14 h9' },
}

function ReactionFace({ reaction, size = 18 }) {
  const face = REACTION_FACE[reaction] ?? REACTION_FACE.not_tried
  const r = REACTION_MAP[reaction]
  const bg = r?.color ?? '#e2e8f0'
  const ink = '#fff'
  const eyeY = reaction === 'loved' ? 9.5 : 10

  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block' }}>
      <circle cx="12" cy="12" r="12" fill={bg} />
      {reaction === 'tried'
        ? <path d="M7.5 12.5 l3 3 l6 -6.5" fill="none" stroke={ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        : <>
            {reaction === 'loved'
              ? <>
                  <path d="M8 8.5 q2 -2 3 0" fill="none" stroke={ink} strokeWidth="1.6" strokeLinecap="round"/>
                  <path d="M13 8.5 q2 -2 3 0" fill="none" stroke={ink} strokeWidth="1.6" strokeLinecap="round"/>
                </>
              : <>
                  <circle cx="9" cy={eyeY} r="1.4" fill={ink}/>
                  <circle cx="15" cy={eyeY} r="1.4" fill={ink}/>
                </>
            }
            <path d={face.mouth} fill="none" stroke={ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </>
      }
    </svg>
  )
}

export default function FoodCard({ food, onOpen }) {
  const { state, dispatch } = useApp()
  const t = useT()
  const log = state.logs[food.id]
  const reaction = log?.reaction ?? 'not_tried'
  const tried = reaction !== 'not_tried'
  const cat = CATEGORY_MAP[food.category]
  const rc = tried ? (REACTION_MAP[reaction]?.color ?? '#8a7d70') : null

  function handleClick() {
    if (onOpen) onOpen(food.id)
    else dispatch({ type: 'OPEN_MODAL', foodId: food.id })
  }

  return (
    <button onClick={handleClick}
      style={{
        borderRadius: 18, padding: '12px 6px 9px', textAlign: 'center',
        position: 'relative', cursor: 'pointer',
        background: '#fff',
        border: tried ? '2px solid #f1e7da' : '2px dashed #e2d4c4',
        boxShadow: tried ? 'none' : '0 3px 10px rgba(190,150,110,0.14)',
        opacity: tried ? 0.7 : 1,
        transition: 'transform .1s ease',
      }}
      onPointerDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
      onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
      onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}>

      {/* Reaction indicator top-right */}
      {tried ? (
        <div style={{
          position: 'absolute', top: 6, right: 6, width: 22, height: 22,
          borderRadius: '50%', display: 'grid', placeItems: 'center',
        }}>
          <ReactionFace reaction={reaction} size={22} />
        </div>
      ) : (
        <div style={{
          position: 'absolute', top: 6, right: 6, width: 22, height: 22,
          borderRadius: '50%', border: '2px dashed #d9c9b8',
          display: 'grid', placeItems: 'center', color: '#c9b6a2', fontSize: 12,
        }}>+</div>
      )}

      {/* Emoji */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 44 }}>
        <EmojiImage
          emoji={food.emoji ?? food.name?.[0] ?? '🍽️'}
          size={38}
          filter={tried ? 'grayscale(0.7) opacity(0.55)' : 'none'}
        />
      </div>

      {/* Name */}
      <div style={{
        fontFamily: '"Baloo 2", sans-serif', fontWeight: 700, fontSize: 13,
        marginTop: 6, color: tried ? '#8a7d70' : '#241a12', lineHeight: 1.2,
        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
      }}>
        {translateFoodName(food.name, state.language)}
      </div>

      {/* Reaction label */}
      <div style={{
        fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 11,
        color: tried ? '#c4b4a3' : '#8a7d70', marginTop: 1,
      }}>
        {tried ? t('reactionLabel.' + reaction) : t('foodCard.tapToLog')}
      </div>
    </button>
  )
}
