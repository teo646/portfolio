import PropTypes from 'prop-types'

export default function Skills({ skills }) {
  return (
    <section className="section" id="skills">
      <div className="section__header">
        <p className="section__eyebrow">Capabilities</p>
        <h2 className="section__title">기술 스택</h2>
        <p className="section__description">
          `src/data/resume.json`의 `skills` 배열을 수정하면 카테고리별 기술 태그가 자동으로 업데이트됩니다.
        </p>
      </div>

      <div className="grid grid--skills">
        {skills.map((group) => (
          <article key={group.category} className="card skill-card">
            <h3 className="card__title">{group.category}</h3>
            <ul className="pill-list">
              {group.items.map((skill) => (
                <li key={skill} className="pill pill--invert">
                  {skill}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

Skills.propTypes = {
  skills: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
}

