import type { Resume } from '../../../types/resume';

interface ResumeTemplateRendererProps {
  resume: Resume;
}

export function ResumeTemplateRenderer({ resume }: ResumeTemplateRendererProps) {
  const { content, formatting } = resume;
  const fontClass = `font-${formatting.font}`;
  const themeClass = `theme-${formatting.colorTheme}`;

  const formatDate = (date: string, current?: boolean) => {
    if (current) return 'Present';
    if (!date) return '';
    const [year, month] = date.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className={`resume-template ${fontClass} ${themeClass} bg-white text-gray-900 p-8 max-w-[8.5in] mx-auto`}>
      {/* Header */}
      <header className="mb-6 pb-4 border-b-2 border-current">
        <h1 className="text-3xl font-bold mb-2">{content.personalInfo.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {content.personalInfo.email && <span>{content.personalInfo.email}</span>}
          {content.personalInfo.phone && <span>{content.personalInfo.phone}</span>}
          {content.personalInfo.location && <span>{content.personalInfo.location}</span>}
          {content.personalInfo.linkedIn && <span>{content.personalInfo.linkedIn}</span>}
          {content.personalInfo.website && <span>{content.personalInfo.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {content.summary && (
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-2 uppercase tracking-wide">Professional Summary</h2>
          <p className="text-sm leading-relaxed">{content.summary}</p>
        </section>
      )}

      {/* Experience */}
      {content.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase tracking-wide">Work Experience</h2>
          <div className="space-y-4">
            {content.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold">{exp.position}</h3>
                  <span className="text-sm text-gray-600">
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate, exp.current)}
                  </span>
                </div>
                <div className="text-sm mb-1">
                  <span className="font-semibold">{exp.company}</span>
                  {exp.location && <span className="text-gray-600"> • {exp.location}</span>}
                </div>
                {exp.description && <p className="text-sm leading-relaxed whitespace-pre-line">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {content.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase tracking-wide">Education</h2>
          <div className="space-y-3">
            {content.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold">{edu.degree} in {edu.field}</h3>
                  <span className="text-sm text-gray-600">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate, edu.current)}
                  </span>
                </div>
                <div className="text-sm mb-1 font-semibold">{edu.institution}</div>
                {edu.description && <p className="text-sm leading-relaxed">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {content.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase tracking-wide">Skills</h2>
          <div className="grid grid-cols-2 gap-2">
            {content.skills.map((skill) => (
              <div key={skill.id} className="text-sm">
                <span className="font-semibold">{skill.name}</span>
                <span className="text-gray-600"> • {skill.level}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {content.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase tracking-wide">Projects</h2>
          <div className="space-y-3">
            {content.projects.map((project) => (
              <div key={project.id}>
                <h3 className="font-bold">{project.name}</h3>
                {project.technologies && <div className="text-sm text-gray-600 mb-1">{project.technologies}</div>}
                <p className="text-sm leading-relaxed">{project.description}</p>
                {project.link && <div className="text-sm text-gray-600 mt-1">{project.link}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {content.certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase tracking-wide">Certifications</h2>
          <div className="space-y-2">
            {content.certifications.map((cert) => (
              <div key={cert.id} className="text-sm">
                <span className="font-bold">{cert.name}</span>
                <span className="text-gray-600"> • {cert.issuer}</span>
                {cert.date && <span className="text-gray-600"> • {formatDate(cert.date)}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {content.languages.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase tracking-wide">Languages</h2>
          <div className="grid grid-cols-2 gap-2">
            {content.languages.map((lang) => (
              <div key={lang.id} className="text-sm">
                <span className="font-semibold">{lang.name}</span>
                <span className="text-gray-600"> • {lang.proficiency}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {content.achievements.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase tracking-wide">Achievements</h2>
          <div className="space-y-2">
            {content.achievements.map((achievement) => (
              <div key={achievement.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-sm">{achievement.title}</h3>
                  {achievement.date && <span className="text-sm text-gray-600">{formatDate(achievement.date)}</span>}
                </div>
                <p className="text-sm leading-relaxed">{achievement.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Hobbies */}
      {content.hobbies.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase tracking-wide">Hobbies & Interests</h2>
          <div className="flex flex-wrap gap-2">
            {content.hobbies.map((hobby) => (
              <span key={hobby.id} className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                {hobby.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
