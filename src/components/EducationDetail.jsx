import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

export default function EducationDetail({ education }) {
  const { schoolName } = useParams()
  const navigate = useNavigate()
  
  const school = education.find((item) => item.school === decodeURIComponent(schoolName))

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [schoolName])

  if (!school) {
    return (
      <div className="page">
        <main className="main">
          <section className="section">
            <h2>학력을 찾을 수 없습니다</h2>
            <button onClick={() => navigate('/')} className="button-back">
              홈으로 돌아가기
            </button>
          </section>
        </main>
      </div>
    )
  }

  // grades가 있는 경우 학기별로 정렬
  const gradeEntries = school.grades ? Object.entries(school.grades) : []
  // 최신 학기부터 보여주기 위해 역순 정렬
  const sortedGrades = gradeEntries.sort((a, b) => {
    // 키를 기준으로 정렬 (2025가 최신)
    return b[0].localeCompare(a[0])
  })

  return (
    <div className="page">
      <main className="main">
        <section className="section section--detail">
          <button onClick={() => navigate(-1)} className="button-back">
            ← 뒤로 가기
          </button>
          
          <div className="education-detail">
            <div className="education-detail__header">
              <h1 className="education-detail__title">{school.school}</h1>
              <p className="education-detail__degree">{school.degree}</p>
              <p className="education-detail__period">{school.period}</p>
              {school.gpa && (
                <div className="education-detail__gpa">
                  <span className="education-detail__gpa-label">평점</span>
                  <span className="education-detail__gpa-value">{school.gpa}</span>
                </div>
              )}
            </div>

            {sortedGrades.length > 0 && (
              <div className="education-detail__grades">
                {sortedGrades.map(([key, semesterData]) => (
                  <div key={key} className="grade-semester">
                    <div className="grade-semester__header">
                      <h2 className="grade-semester__title">{semesterData.semester}</h2>
                    </div>
                    
                    <div className="grade-table">
                      <table className="grades-table">
                        <thead>
                          <tr>
                            <th>과목명</th>
                            <th>학점</th>
                            <th>평점</th>
                            <th>등급</th>
                          </tr>
                        </thead>
                        <tbody>
                          {semesterData.subjects.map((subject, index) => (
                            <tr 
                              key={index} 
                              className={`${subject.passFail ? 'grade-row--passfail' : ''} ${subject.highlight ? 'grade-row--highlight' : ''}`}
                            >
                              <td className="grade-name">{subject.name}</td>
                              <td className="grade-credits">{subject.credits}</td>
                              <td className="grade-gpa">
                                {subject.passFail ? '-' : subject.gpa.toFixed(1)}
                              </td>
                              <td className="grade-grade">{subject.grade}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

EducationDetail.propTypes = {
  education: PropTypes.arrayOf(
    PropTypes.shape({
      school: PropTypes.string.isRequired,
      degree: PropTypes.string.isRequired,
      period: PropTypes.string.isRequired,
      gpa: PropTypes.string,
      grades: PropTypes.object,
    })
  ).isRequired,
}

