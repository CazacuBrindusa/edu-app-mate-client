// client/src/pages/StudentDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/StudentDashboard.css';

const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

function StudentDashboard() {
  const navigate = useNavigate();

  const [className, setClassName] = useState('');
  const [professorName, setProfessorName] = useState('Unknown');

  const [data, setData] = useState({
    materials: [],
    tests: [],
    announcements: [],
    grades: [],
    homework: []
  });

  const [pendingUploads, setPendingUploads] = useState({});
  const [activeTab, setActiveTab] = useState('materials');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const formatDate = date => {
    const d = new Date(date);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/');

      try {
        const res = await axios.get(`${API_BASE}/api/student/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setClassName(res.data.class.name);
        setProfessorName(res.data.class.professorName);
        setData({
          materials: res.data.class.materials || [],
          tests: res.data.class.tests || [],
          announcements: res.data.class.announcements || [],
          grades: res.data.grades || [],
          homework: (res.data.student.homework || []).sort((a, b) =>
            new Date(b.postedAt) - new Date(a.postedAt)
          )
        });
      } catch (err) {
        console.error('Error loading dashboard:', err);
      }
    };

    load();
  }, [navigate]);

  const handleStudentHomeworkUpload = async (file, homeworkId) => {
    if (!file?.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a valid PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/api/student/homework/${homeworkId}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Homework uploaded!');
      const res = await axios.get(`${API_BASE}/api/student/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setData(d => ({
        ...d,
        homework: (res.data.student.homework || []).sort((a, b) =>
          new Date(b.postedAt) - new Date(a.postedAt)
        )
      }));
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload homework.');
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="header-container">
          <h2 className="header">{className}</h2>
        </div>

        <div className="tab-container">
          {['materials', 'tests', 'announcements', 'grades', 'homework'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? 'active-tab' : 'tab'}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="content">
          {activeTab === 'materials' && (
            <div>
              <h3>📚 Materials</h3>
              {data.materials.length ? (
                <ul className="material-list">
                  {data.materials.map((mat, i) => (
                    <li key={i}>
                      <a
                        href={`${API_BASE}/uploads/${mat}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'underline', color: '#007bff' }}
                      >
                        📄 {mat}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No materials available.</p>
              )}
            </div>
          )}

          {activeTab === 'tests' && (
            <div>
              <h3>📝 Tests</h3>
              {data.tests.length ? (
                <ul className="test-list">
                  {data.tests.map((test, i) => (
                    <li key={i}>
                      <a
                        href={`${API_BASE}/uploads/${test.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'underline', color: '#0066cc' }}
                      >
                        📄 {test.name}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No tests available.</p>
              )}
            </div>
          )}

          {activeTab === 'announcements' && (
            <div>
              <h3>📢 Announcements</h3>
              {data.announcements.length ? (
                <div className="announcement-list">
                  {data.announcements.map((ann, i) => (
                    <div key={i} className="announcement-box">
                      <div className="announcement-header">
                        <strong>{professorName}</strong>
                        <span>{formatDate(ann.date)}</span>
                      </div>
                      <div className="announcement-message">{ann.message}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No announcements available.</p>
              )}
            </div>
          )}

          {activeTab === 'grades' && (
            <div>
              <h3>📊 Grades</h3>
              {data.grades.length ? (
                <table className="grades-table">
                  <thead>
                    <tr>
                      <th>Test</th>
                      <th>Grade</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.grades.map((grade, i) => (
                      <tr key={i}>
                        <td>{grade.testName}</td>
                        <td>{grade.score}</td>
                        <td>{formatDate(grade.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No grades available.</p>
              )}
            </div>
          )}

          {activeTab === 'homework' && (
            <div>
              <h3>📥 Homework</h3>
              {data.homework.length ? (
                <ul className="homework-list">
                  {data.homework.map((hw, i) => (
                    <li key={i} className="homework-item">
                      <div>
                        <strong>📄 Assigned:</strong>{' '}
                        <a
                          href={`${API_BASE}/uploads/${hw.professorFile}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {hw.professorFile}
                        </a>
                      </div>

                      {hw.studentFile ? (
                        <div>
                          <strong>📤 Your Submission:</strong>{' '}
                          <a
                            href={`${API_BASE}/uploads/${hw.studentFile}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {hw.studentFile}
                          </a>
                        </div>
                      ) : (
                        <div style={{ marginTop: 8 }}>
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={e =>
                              setPendingUploads(p => ({
                                ...p,
                                [hw._id]: e.target.files[0]
                              }))
                            }
                          />
                          {pendingUploads[hw._id] && (
                            <>
                              <p style={{ fontSize: 12 }}>
                                Selected file: {pendingUploads[hw._id].name}
                              </p>
                              <button
                                className="button"
                                onClick={() =>
                                  handleStudentHomeworkUpload(
                                    pendingUploads[hw._id],
                                    hw._id
                                  )
                                }
                              >
                                Upload
                              </button>
                            </>
                          )}
                        </div>
                      )}

                      <div style={{ fontSize: 12, color: '#888' }}>
                        {new Date(hw.postedAt).toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: 'red' }}>No homework assigned yet.</p>
              )}
            </div>
          )}
        </div>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}

export default StudentDashboard;
