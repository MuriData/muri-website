import './Team.css'

const members = [
  {
    initials: 'CH',
    name: 'Cody Hash',
    role: 'Co-Founder & Protocol',
    description: 'ZK circuits, node architecture, and protocol design.',
  },
  {
    initials: 'MF',
    name: 'Matrew File',
    role: 'Co-Founder & Market',
    description: 'Market strategy, business development, and ecosystem growth.',
  },
]

function Team() {
  return (
    <div className="team-wrapper">
      <h2 className="team-heading">
        <span className="team-heading__icon">◆</span>
        Team
        <span className="team-heading__line" />
      </h2>

      <div className="team-grid">
        {members.map((m) => (
          <div className="team-card" key={m.name}>
            <div className="team-card__avatar">{m.initials}</div>
            <div className="team-card__info">
              <h3 className="team-card__name">{m.name}</h3>
              <span className="team-card__role">{m.role}</span>
              <p className="team-card__desc">{m.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Team
