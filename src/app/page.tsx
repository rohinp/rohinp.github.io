import { resume } from "@/data/resume";

export default function HomePage() {
  return (
    <div className="page-shell home-shell">
      <section className="material-card hero-card">
        <div className="hero-primary">
          <p className="page-label">{resume.location}</p>
          <h1>{resume.name}</h1>
          <p className="hero-role">{resume.role}</p>
          <p className="hero-summary">{resume.summary}</p>
          <div className="hero-actions">
            <a href={resume.linkedin} className="button" target="_blank" rel="noreferrer">
              Connect on LinkedIn
            </a>
            <span className="button ghost disabled" aria-disabled="true">
              Blog launching soon
            </span>
          </div>
        </div>
        <div className="hero-secondary">
          <p className="chip chip--success">{resume.availability.status}</p>
          <p className="hero-note">{resume.availability.note}</p>
          <div className="contact-grid">
            <div className="contact-item">
              <p className="label">Site</p>
              <a href={resume.website} className="contact-value text-link" target="_blank" rel="noreferrer">
                {new URL(resume.website).host}
              </a>
            </div>
            <div className="contact-item">
              <p className="label">LinkedIn</p>
              <a href={resume.linkedin} className="contact-value text-link" target="_blank" rel="noreferrer">
                Rohin Patel
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="resume-grid">
        <article className="material-card">
          <div className="section-heading">
            <p className="page-label">Recent Work</p>
            <h2>Experience</h2>
          </div>
          <div className="experience-list">
            {resume.experience.map((item) => (
              <div key={`${item.company}-${item.period}`} className="experience-item">
                <div>
                  <p className="experience-role">{item.role}</p>
                  <p className="experience-company">{item.company}</p>
                </div>
                <p className="experience-meta">
                  {item.period} · {item.location}
                </p>
                <ul>
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </article>

        <article className="material-card">
          <div className="section-heading">
            <p className="page-label">Core Competencies</p>
            <h2>Toolbox</h2>
          </div>
          <div className="skill-grid">
            {resume.competencies.map((group) => (
              <div key={group.label} className="skill-group">
                <p className="label">{group.label}</p>
                <div className="chip-row">
                  {group.items.map((item) => (
                    <span key={item} className="chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="resume-grid">
        <article className="material-card">
          <div className="section-heading">
            <p className="page-label">Community</p>
            <h2>Open Source & Talks</h2>
          </div>
          <div className="list-stack">
            <p className="label">Open Source</p>
            {resume.openSource.map((project) => (
              <div key={project.title} className="list-card">
                <p className="list-card__title">{project.title}</p>
                <p className="list-card__meta">{project.description}</p>
              </div>
            ))}
          </div>

          <div className="list-stack">
            <p className="label">Talks & Workshops</p>
            <ul className="bullet-list">
              {resume.talks.map((talk) => (
                <li key={`${talk.title}-${talk.venue}`}>
                  <strong>{talk.title}</strong> — {talk.venue}
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="material-card">
          <div className="section-heading">
            <p className="page-label">Foundations</p>
            <h2>Education & Awards</h2>
          </div>
          <div className="education-block">
            <p className="experience-role">{resume.education.program}</p>
            <p className="experience-company">{resume.education.institution}</p>
            <p className="experience-meta">{resume.education.note}</p>
          </div>
          <div className="list-stack">
            <p className="label">Awards</p>
            <div className="awards-list">
              {resume.awards.map((award, index) => (
                <span key={`${award}-${index}`} className="award-chip">
                  {award}
                </span>
              ))}
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
