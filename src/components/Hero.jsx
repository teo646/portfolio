import PropTypes from 'prop-types'

export default function Hero({ profile }) {
  const { name, headline, subheadline, summary } = profile

  return (
    <header className="section hero">
      <div className="hero__inner">
        <p className="hero__eyebrow">Portfolio</p>
        <h1 className="hero__title">{name}</h1>
        <p className="hero__headline">{headline}</p>
        {subheadline && <p className="hero__subheadline">{subheadline}</p>}

        <ul className="hero__summary">
          {summary.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </header>
  )
}

Hero.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string.isRequired,
    headline: PropTypes.string.isRequired,
    subheadline: PropTypes.string,
    summary: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
}

