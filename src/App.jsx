import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import profile from './data/profile.json'
import projects from './data/projects.json'
import resume from './data/resume.json'

import Contact from './components/Contact.jsx'
import Education from './components/Education.jsx'
import EducationDetail from './components/EducationDetail.jsx'
import Experience from './components/Experience.jsx'
import ExperienceDetail from './components/ExperienceDetail.jsx'
import Hero from './components/Hero.jsx'
import Projects from './components/Projects.jsx'
import ProjectDetail from './components/ProjectDetail.jsx'

function Home() {
  return (
    <>
      <Hero profile={profile} />
      <main className="main">
        <Projects projects={projects} />
        <Experience experience={resume.experience} />
        <Education education={resume.education} certifications={resume.certifications} />
        <Contact contacts={profile.contacts} />
      </main>
      <footer className="footer">
        <p>© {new Date().getFullYear()} {profile.belong} {profile.name}.</p>
      </footer>
    </>
  )
}

function App() {
  return (
    <Router basename="/portfolio">
      <div className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:projectTitle" element={<ProjectDetail projects={projects} />} />
          <Route path="/experience/:experienceId" element={<ExperienceDetail experience={resume.experience} />} />
          <Route path="/education/:schoolName" element={<EducationDetail education={resume.education} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
