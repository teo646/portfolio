import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

export default function Education({ education, certifications }) {
  const navigate = useNavigate()
  const hasCertifications = certifications?.length > 0

  const handleEducationClick = (school) => {
    if (school.grades) {
      navigate(`/education/${encodeURIComponent(school.school)}`)
    }
  }

  return (
    <section className="section" id="education">
      <div className="section__header">
        <p className="section__eyebrow">Background</p>
        <h2 className="section__title">학력 및 자격</h2>
      </div>

      <div className="grid grid--education">
        {education.map((item) => (
          <article 
            key={`${item.school}-${item.period}`} 
            className={`card ${item.grades ? 'card--clickable' : ''}`}
            onClick={item.grades ? () => handleEducationClick(item) : undefined}
          >
            <h3 className="card__title">{item.school}</h3>
            <p className="card__subtitle">{item.degree}</p>
            <p className="card__meta">{item.period}</p>
          </article>
        ))}
        {hasCertifications && (
          <article className="card">
            <h3 className="card__title">자격증</h3>
            <ul className="card__list">
              {certifications.map((cert) => (
                <li key={`${cert.name}-${cert.year}`}>
                  <strong>{cert.name}</strong> · {cert.issuer} ({cert.year})
                </li>
              ))}
            </ul>
          </article>
        )}
      </div>
    </section>
  )
}

Education.propTypes = {
  education: PropTypes.arrayOf(
    PropTypes.shape({
      school: PropTypes.string.isRequired,
      degree: PropTypes.string.isRequired,
      period: PropTypes.string.isRequired,
      gpa: PropTypes.string,
    })
  ).isRequired,
  certifications: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      issuer: PropTypes.string.isRequired,
      year: PropTypes.string.isRequired,
    })
  ),
}

