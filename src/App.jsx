import './App.css'

import profile from './data/profile.json'
import projects from './data/projects.json'
import resume from './data/resume.json'

import Contact from './components/Contact.jsx'
import Education from './components/Education.jsx'
import Experience from './components/Experience.jsx'
import Hero from './components/Hero.jsx'
import Projects from './components/Projects.jsx'
import Skills from './components/Skills.jsx'

function App() {
  return (
    <div className="page">
      <Hero profile={profile} />
      <main className="main">
        <Projects projects={projects} />
        <Experience experience={resume.experience} />
        <Skills skills={resume.skills} />
        <Education education={resume.education} certifications={resume.certifications} />
        <Contact contacts={profile.contacts} />
      </main>
      <footer className="footer">
        <p>© {new Date().getFullYear()} {profile.name}. 데이터 파일을 수정해 포트폴리오를 업데이트하세요.</p>
      </footer>
    </div>
  )
}

export default App
