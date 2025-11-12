import PropTypes from 'prop-types'

export default function Experience({ experience }) {
  return (
    <section className="section" id="experience">
      <div className="section__header">
        <p className="section__eyebrow">Career</p>
        <h2 className="section__title">경력</h2>
        <p className="section__description">
          경력 정보는 `src/data/resume.json`의 `experience` 항목을 수정해 관리합니다.
        </p>
      </div>

      <div className="timeline">
        {experience.map((item) => (
          <article key={`${item.company}-${item.period}`} className="timeline__item">
            <div className="timeline__marker" />
            <div className="timeline__content">
              <header className="timeline__header">
                <h3 className="timeline__title">{item.role}</h3>
                <p className="timeline__company">{item.company}</p>
                <p className="timeline__period">{item.period}</p>
              </header>
              <p className="timeline__summary">{item.summary}</p>
              {item.achievements?.length > 0 && (
                <ul className="timeline__list">
                  {item.achievements.map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
              )}
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

