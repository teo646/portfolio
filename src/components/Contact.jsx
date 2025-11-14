import PropTypes from 'prop-types'

export default function Contact({ contacts }) {
  return (
    <section className="section" id="contact">
      <div className="section__header">
        <p className="section__eyebrow">Contact</p>
        <h2 className="section__title">연락하기</h2>
      </div>

      <div className="contact-card">
        {contacts.map((contact) => (
          <a key={contact.url} href={contact.url} target="_blank" rel="noreferrer" className="contact-card__item">
            <span className="contact-card__type">{contact.type}</span>
            <span className="contact-card__value">{contact.label}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

Contact.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
}

