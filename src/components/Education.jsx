import PropTypes from 'prop-types'

export default function Education({ education, certifications }) {
  const hasCertifications = certifications?.length > 0

  return (
    <section className="section" id="education">
      <div className="section__header">
        <p className="section__eyebrow">Background</p>
        <h2 className="section__title">학력 및 자격</h2>
        <p className="section__description">
          학력과 자격 목록은 `src/data/resume.json`에서 관리합니다. 새 항목을 추가하면 자동으로 정렬됩니다.
        </p>
      </div>

      <div className="grid grid--education">
        {education.map((item) => (
          <article key={`${item.school}-${item.period}`} className="card">
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

