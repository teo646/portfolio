import PropTypes from 'prop-types'

export default function Projects({ projects }) {
  return (
    <section className="section" id="projects">
      <div className="section__header">
        <p className="section__eyebrow">Work</p>
        <h2 className="section__title">프로젝트</h2>
        <p className="section__description">
          `src/data/projects.json` 파일에 항목을 추가하거나 삭제해 포트폴리오를 손쉽게 업데이트할 수 있습니다.
        </p>
      </div>

      <div className="grid grid--projects">
        {projects.map((project) => (
          <article key={project.title} className="card project-card">
            <header className="card__header">
              <div className="card__meta">
                <span className="card__period">{project.period}</span>
              </div>
              <h3 className="card__title">{project.title}</h3>
            </header>

            <p className="card__description">{project.description}</p>

            {project.highlights?.length > 0 && (
              <ul className="card__list">
                {project.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}

            <div className="card__footer">
              <ul className="pill-list">
                {project.techStack?.map((tech) => (
                  <li key={tech} className="pill">
                    {tech}
                  </li>
                ))}
              </ul>

              {project.links?.length > 0 && (
                <div className="link-list">
                  {project.links.map((link) => (
                    <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="link">
                      {link.label}
                    </a>
                  ))}
                </div>
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
      links: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
}

