import { useParams, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useState, useEffect, useRef } from 'react'

function ProjectMediaCarousel({ media, title }) {
  const [activeIndex, setActiveIndex] = useState(0)
  
  if (!media || media.length === 0) {
    return null
  }
  
  const activeItem = media[activeIndex]
  const hasMultiple = media.length > 1

  const goTo = (nextIndex) => {
    const total = media.length
    const normalized = (nextIndex + total) % total
    setActiveIndex(normalized)
  }
  
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

  const enhanceYouTubeUrl = (url) => {
    if (!url) return url
    
    const youtubeRegex = /(?:youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]+)/
    const match = url.match(youtubeRegex)
    
    if (match) {
      const videoId = match[1]
      const urlObj = new URL(url)
      
      urlObj.searchParams.set('autoplay', '1')
      urlObj.searchParams.set('mute', '1')
      urlObj.searchParams.set('loop', '1')
      urlObj.searchParams.set('playlist', videoId)
      
      return urlObj.toString()
    }
    
    return url
  }

  const videoRef = useRef(null)

  useEffect(() => {
    // activeIndex나 activeItem이 변경될 때마다 비디오 재생 시도
    if (activeItem?.type === 'video') {
      let handleLoadedData = null
      let handleCanPlay = null
      
      // DOM 업데이트 후 ref가 설정되도록 약간의 지연
      const timer = setTimeout(() => {
        if (videoRef.current) {
          const video = videoRef.current
          
          // 사파리 호환성을 위한 속성 설정
          video.muted = true
          video.loop = true
          video.playsInline = true
          video.setAttribute('playsinline', 'true')
          video.setAttribute('webkit-playsinline', 'true')
          
          const attemptPlay = () => {
            const playPromise = video.play()
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  // 재생 성공
                })
                .catch(error => {
                  // 자동 재생 실패 시 조용히 처리
                  console.log('비디오 자동 재생 실패:', error)
                })
            }
          }
          
          handleLoadedData = attemptPlay
          handleCanPlay = attemptPlay
          
          // 여러 이벤트를 감지하여 재생 시도 (사파리 호환성)
          if (video.readyState >= 3) {
            // 이미 충분히 로드된 경우
            attemptPlay()
          } else {
            video.addEventListener('loadeddata', handleLoadedData)
            video.addEventListener('canplay', handleCanPlay)
            video.addEventListener('loadedmetadata', attemptPlay)
          }
        }
      }, 200)
      
      return () => {
        clearTimeout(timer)
        if (videoRef.current) {
          const video = videoRef.current
          if (handleLoadedData) {
            video.removeEventListener('loadeddata', handleLoadedData)
          }
          if (handleCanPlay) {
            video.removeEventListener('canplay', handleCanPlay)
          }
          video.removeEventListener('loadedmetadata', () => {})
        }
      }
    }
  }, [activeIndex, activeItem])

  const renderMedia = (item) => {
    if (!item) return null
    
    if (item.type === 'image') {
      const imageSrc = resolveAssetPath(item.src)
      return <img src={imageSrc} alt={item.alt || title} loading="lazy" key={`${activeIndex}-${item.src}`} />
    }

    if (item.type === 'video') {
      const videoSrc = resolveAssetPath(item.src)
      const posterSrc = item.poster ? resolveAssetPath(item.poster) : item.poster

      return (
        <video
          ref={item === activeItem ? videoRef : null}
          key={`${activeIndex}-${item.src}`}
          controls
          playsInline
          autoPlay
          loop
          muted
          webkit-playsinline="true"
          poster={posterSrc}
          preload="auto"
          className="media-frame__video"
        >
          <source src={videoSrc} type={item.mimeType || 'video/mp4'} />
          브라우저가 비디오 태그를 지원하지 않습니다.
        </video>
      )
    }

    if (item.type === 'iframe') {
      const iframeSrc = enhanceYouTubeUrl(item.src)
      
      return (
        <iframe
          key={`${activeIndex}-${item.src}`}
          src={iframeSrc}
          title={item.alt || `${title} 미디어`}
          loading="lazy"
          allow={item.allow || 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'}
          allowFullScreen
        />
      )
    }

    return null
  }

  if (!activeItem) {
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
              <span aria-hidden="true">&lt;</span>
            </button>
            <button
              type="button"
              className="media-carousel__button media-carousel__button--next"
              onClick={() => goTo(activeIndex + 1)}
              aria-label="다음 미디어 보기"
            >
              <span aria-hidden="true">&gt;</span>
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

ProjectMediaCarousel.propTypes = {
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

export default function ProjectDetail({ projects }) {
  const { projectTitle } = useParams()
  const navigate = useNavigate()
  const project = projects.find(p => p.title === decodeURIComponent(projectTitle))

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [projectTitle])

  if (!project) {
    return (
      <div className="page">
        <main className="main">
          <section className="section">
            <h2>프로젝트를 찾을 수 없습니다</h2>
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
          
          <div className="project-detail">
            <div className="project-detail__header">
              <div className="project-detail__meta">
                <span className="card__period">{project.period}</span>
              </div>
              <h1 className="project-detail__title">{project.title}</h1>
            </div>

            {project.media?.length > 0 && (
              <ProjectMediaCarousel media={project.media} title={project.title} />
            )}

            <div className="project-detail__content">
              <div className="project-detail__description">
                <h2 className="project-detail__heading">프로젝트 소개</h2>
                <p>{project.description}</p>
              </div>

              {project.highlights?.length > 0 && (
                <div className="project-detail__highlights">
                  <h2 className="project-detail__heading">주요 기능</h2>
                  <ul className="card__list">
                    {project.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {project.techStack?.length > 0 && (
                <div className="project-detail__tech">
                  <h2 className="project-detail__heading">기술 스택</h2>
                  <ul className="pill-list">
                    {project.techStack.map((tech) => (
                      <li key={tech} className="pill">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.links?.length > 0 && (
                <div className="project-detail__links">
                  <h2 className="project-detail__heading">관련 링크</h2>
                  <div className="link-list">
                    {project.links.map((link) => (
                      <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="link">
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

ProjectDetail.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      period: PropTypes.string,
      description: PropTypes.string.isRequired,
      techStack: PropTypes.arrayOf(PropTypes.string),
      highlights: PropTypes.arrayOf(PropTypes.string),
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
      links: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
}

