import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

const resolveAssetPath = (src) => {
  if (!src) return src
  if (/^https?:\/\//i.test(src)) return src

  const base = import.meta.env.BASE_URL || '/'
  const baseWithSlash = base.endsWith('/') ? base : `${base}/`
  const baseWithoutSlash = baseWithSlash.endsWith('/') ? baseWithSlash.slice(0, -1) : baseWithSlash

  if (src.startsWith('/')) {
    return `${baseWithoutSlash}${src}`
  }

  const cleanSrc = src.startsWith('./') ? src.slice(2) : src.replace(/^\/+/, '')
  return `${baseWithSlash}${cleanSrc}`
}

function ExperienceMediaCarousel({ media, title }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeItem = media[activeIndex]
  const hasMultiple = media.length > 1

  const goTo = (nextIndex) => {
    const total = media.length
    const normalized = (nextIndex + total) % total
    setActiveIndex(normalized)
  }

  if (!activeItem) return null

  const renderMedia = (item) => {
    if (item.type === 'image') {
      const imageSrc = resolveAssetPath(item.src)
      return <img src={imageSrc} alt={item.alt || `${title} 미디어`} loading="lazy" />
    }

    if (item.type === 'video') {
      const videoSrc = resolveAssetPath(item.src)
      const posterSrc = item.poster ? resolveAssetPath(item.poster) : item.poster

      return (
        <video
          controls
          playsInline
          poster={posterSrc}
          preload="metadata"
          className="media-frame__video"
        >
          <source src={videoSrc} type={item.mimeType || 'video/mp4'} />
          브라우저가 비디오 태그를 지원하지 않습니다.
        </video>
      )
    }

    if (item.type === 'iframe') {
      return (
        <iframe
          src={item.src}
          title={item.alt || `${title} 미디어`}
          loading="lazy"
          allow={item.allow || 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'}
          allowFullScreen
        />
      )
    }

    return null
  }

  return (
    <div className="media-carousel">
      <figure className="media-frame media-frame--detail-square">
        {renderMedia(activeItem)}
        {(activeItem.caption || activeItem.alt) && (
          <figcaption className="media-carousel__caption">
            {activeItem.caption || activeItem.alt}
          </figcaption>
        )}
      </figure>

      {hasMultiple && (
        <>
          <div className="media-carousel__controls" aria-hidden="true">
            <button
              type="button"
              className="media-carousel__button media-carousel__button--prev"
              onClick={() => goTo(activeIndex - 1)}
              aria-label="이전 미디어 보기"
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button
              type="button"
              className="media-carousel__button media-carousel__button--next"
              onClick={() => goTo(activeIndex + 1)}
              aria-label="다음 미디어 보기"
            >
              <span aria-hidden="true">›</span>
            </button>
          </div>
          <div className="media-carousel__counter">
            {activeIndex + 1}
            <span className="media-carousel__counter-divider">/</span>
            {media.length}
          </div>
        </>
      )}
    </div>
  )
}

export default function ExperienceDetail({ experience }) {
  const { experienceId } = useParams()
  const navigate = useNavigate()
  
  // company와 period를 조합하여 경력 항목 찾기
  const decodedId = decodeURIComponent(experienceId)
  const parts = decodedId.split('|')
  const company = parts[0]
  const period = parts[1]
  
  const experienceItem = experience.find(
    (item) => item.company === company && item.period === period
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [experienceId])

  if (!experienceItem) {
    return (
      <div className="page">
        <main className="main">
          <section className="section">
            <h2>경력을 찾을 수 없습니다</h2>
            <button onClick={() => navigate('/')} className="button-back">
              홈으로 돌아가기
            </button>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="page">
      <main className="main">
        <section className="section section--detail">
          <button onClick={() => navigate(-1)} className="button-back">
            ← 뒤로 가기
          </button>
          
          <div className="experience-detail">
            <div className="experience-detail__header">
              <div className="experience-detail__meta">
                <span className="card__period">{experienceItem.period}</span>
              </div>
              <h1 className="experience-detail__title">{experienceItem.role}</h1>
              <p className="experience-detail__company">{experienceItem.company}</p>
            </div>

            {experienceItem.media?.length > 0 && (
              <ExperienceMediaCarousel media={experienceItem.media} title={experienceItem.company} />
            )}

            <div className="experience-detail__content">
              {experienceItem.summary && (
                <div className="experience-detail__summary">
                  <h2 className="project-detail__heading">요약</h2>
                  <p>{experienceItem.summary}</p>
                </div>
              )}

              {experienceItem.achievements?.length > 0 && (
                <div className="experience-detail__achievements">
                  <h2 className="project-detail__heading">주요 성과</h2>
                  <ul className="card__list">
                    {experienceItem.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

ExperienceDetail.propTypes = {
  experience: PropTypes.arrayOf(
    PropTypes.shape({
      company: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      period: PropTypes.string.isRequired,
      summary: PropTypes.string,
      achievements: PropTypes.arrayOf(PropTypes.string),
      media: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.oneOf(['image', 'video', 'iframe']).isRequired,
          src: PropTypes.string.isRequired,
          alt: PropTypes.string,
          caption: PropTypes.string,
          poster: PropTypes.string,
          mimeType: PropTypes.string,
          allow: PropTypes.string,
        })
      ),
    })
  ).isRequired,
}

ExperienceMediaCarousel.propTypes = {
  media: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['image', 'video', 'iframe']).isRequired,
      src: PropTypes.string.isRequired,
      alt: PropTypes.string,
      caption: PropTypes.string,
      poster: PropTypes.string,
      mimeType: PropTypes.string,
      allow: PropTypes.string,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
}

