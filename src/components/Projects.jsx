import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

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

function ProjectMediaCarousel({ media, title }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeItem = media[activeIndex]
  const hasMultiple = media.length > 1

  const goTo = (nextIndex) => {
    const total = media.length
    const normalized = (nextIndex + total) % total
    setActiveIndex(normalized)
  }

  const enhanceYouTubeUrl = (url) => {
    if (!url) return url
    
    // YouTube URL인지 확인
    const youtubeRegex = /(?:youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]+)/
    const match = url.match(youtubeRegex)
    
    if (match) {
      const videoId = match[1]
      const urlObj = new URL(url)
      
      // autoplay, mute, loop, playlist 파라미터 추가 (자동 재생 및 반복 재생을 위해)
      // mute=1을 추가하면 브라우저 자동 재생 정책에 따라 더 많은 브라우저에서 작동합니다
      urlObj.searchParams.set('autoplay', '1')
      urlObj.searchParams.set('mute', '1')
      urlObj.searchParams.set('loop', '1')
      urlObj.searchParams.set('playlist', videoId)
      
      return urlObj.toString()
    }
    
    return url
  }

  const renderMedia = (item) => {
    if (item.type === 'image') {
      const imageSrc = resolveAssetPath(item.src)
      return <img src={imageSrc} alt={item.alt} loading="lazy" />
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
      const iframeSrc = enhanceYouTubeUrl(item.src)
      
      return (
        <iframe
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

  return (
    <div className="media-carousel">
      <figure className="media-frame">
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

function ProjectPreview({ media, title }) {
  const videoRef = useRef(null)
  const hasInteracted = useRef(false)
  
  if (!media || media.length === 0) return null
  
  const firstMedia = media[0]

  useEffect(() => {
    // 비디오인 경우 자동 재생
    if (firstMedia?.type === 'video') {
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
  }, [firstMedia])

  const renderPreview = (item) => {
    if (item.type === 'image') {
      const imageSrc = resolveAssetPath(item.src)
      return <img src={imageSrc} alt={item.alt || title} loading="lazy" />
    }

    if (item.type === 'video') {
      const videoSrc = resolveAssetPath(item.src)
      const posterSrc = item.poster ? resolveAssetPath(item.poster) : item.poster

      return (
        <video
          ref={videoRef}
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
        </video>
      )
    }

    if (item.type === 'iframe') {
      // YouTube URL인 경우 자동 재생 파라미터 추가
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
      
      const iframeSrc = enhanceYouTubeUrl(item.src)
      
      return (
        <iframe
          src={iframeSrc}
          title={item.alt || `${title} 미디어`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )
    }

    return null
  }

  return (
    <div className="media-preview">
      <figure className="media-frame">
        {renderPreview(firstMedia)}
      </figure>
    </div>
  )
}

ProjectPreview.propTypes = {
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
  title: PropTypes.string.isRequired,
}

export default function Projects({ projects }) {
  const navigate = useNavigate()

  const handleProjectClick = (projectTitle) => {
    navigate(`/project/${encodeURIComponent(projectTitle)}`)
  }

  return (
    <section className="section" id="projects">
      <div className="section__header">
        <p className="section__eyebrow">Work</p>
        <h2 className="section__title">프로젝트</h2>
      </div>

      <div className="grid grid--projects">
        {projects.map((project) => (
          <article 
            key={project.title} 
            className="card project-card project-card--clickable project-card--simple"
            onClick={() => handleProjectClick(project.title)}
          >
            {project.media?.length > 0 && (
              <ProjectPreview media={project.media} title={project.title} />
            )}
            <div className="card__content--simple">
              <h3 className="card__title card__title--simple">{project.title}</h3>
              {project.period && (
                <span className="card__period card__period--simple">{project.period}</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

Projects.propTypes = {
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

