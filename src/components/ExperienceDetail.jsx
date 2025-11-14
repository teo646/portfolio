import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

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
    })
  ).isRequired,
}

