import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

export default function Experience({ experience }) {
  const navigate = useNavigate()

  const handleExperienceClick = (company, period) => {
    const experienceId = encodeURIComponent(`${company}|${period}`)
    navigate(`/experience/${experienceId}`)
  }

  return (
    <section className="section" id="experience">
      <div className="section__header">
        <p className="section__eyebrow">Career</p>
        <h2 className="section__title">경력</h2>
      </div>

      <div className="timeline">
        {experience.map((item) => (
          <article 
            key={`${item.company}-${item.period}`} 
            className="timeline__item timeline__item--clickable"
            onClick={() => handleExperienceClick(item.company, item.period)}
          >
            <div className="timeline__marker" />
            <div className="timeline__content timeline__content--simple">
              <header className="timeline__header">
                <h3 className="timeline__title">{item.role}</h3>
                <p className="timeline__company">{item.company}</p>
                <p className="timeline__period">{item.period}</p>
              </header>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

Experience.propTypes = {
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

