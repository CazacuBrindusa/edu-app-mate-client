// client/src/pages/StudentDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { parse, HtmlGenerator } from 'latex.js';
import './css/StudentDashboard.css';

function StudentDashboard() {
  const navigate = useNavigate();

  // Class & professor info
  const [className, setClassName] = useState('');
  const [professorName, setProfessorName] = useState('Unknown');

  // All dashboard data
  const [data, setData] = useState({
    materials: [],
    tests: [],
    announcements: [],
    grades: [],
    homework: []
  });

  // For homework uploads
  const [pendingUploads, setPendingUploads] = useState({});

  // UI
  const [activeTab, setActiveTab] = useState('materials');

  // For test view
  const [viewingTest, setViewingTest] = useState(null);
  const [testHtml, setTestHtml] = useState('');
  const [isPdf, setIsPdf] = useState(false);
  const [viewError, setViewError] = useState('');

  // Load everything on mount
  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/');

      try {
        const res = await axios.get(
          '/api/student/dashboard',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setClassName(res.data.class.name);
        setProfessorName(res.data.class.professorName);

        setData({
          materials: res.data.class.materials || [],
          tests: res.data.class.tests || [],
          announcements: res.data.class.announcements || [],
          grades: res.data.grades || [],
          homework: (res.data.student.homework || [])
            .sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))
        });
      } catch (err) {
        console.error('Error loading dashboard:', err);
      }
    };

    load();
  }, [navigate]);

  const handleTabChange = tab => setActiveTab(tab);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const formatDate = date => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const d = new Date(date);
    return `${d.toLocaleDateString('en-US', options)} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const handleStudentHomeworkUpload = async (file, homeworkId) => {
    if (!file?.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a valid PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `/api/student/homework/${homeworkId}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      alert('Homework uploaded!');
      // reload
      const res = await axios.get(
        '/api/student/dashboard',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(d => ({
        ...d,
        homework: (res.data.student.homework || [])
          .sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))
      }));
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload homework.');
    }
  };

  const handleViewTest = async (file) => {
    try {
      const isPdfFile = file.toLowerCase().endsWith('.pdf');
      setIsPdf(isPdfFile);

      if (isPdfFile) {
        setTestHtml('');
        setViewingTest(file);
        setViewError('');
        return;
      }

      const res = await fetch(file);
      if (!res.ok) throw new Error('Failed to load file');
      const rawTex = await res.text();

      const strippedLines = rawTex
        .split('\n')
        .map(line => line.trim())
        .filter(line => !/^\\(usepackage|documentclass|begin\{document\}|end\{document\}|theoremstyle|newtheorem|begin\{exercitiu\}|end\{exercitiu\})/.test(line))
        .map(line => {
          const match = line.match(/\\textcolor\{red\}\{([^}]*)\}/);
          return match ? `\\textcolor{red}{${match[1]}}` : line;
        });

      const bodyOnly = strippedLines.join('\n');
      const wrappedSource = `
      \\documentclass{article}
      \\begin{document}
      ${bodyOnly}
      \\end{document}
    `;

      const generator = new HtmlGenerator({ hyphenate: false });
      parse(wrappedSource, { generator });

      const fragment = generator.domFragment();
      const wrapper = document.createElement('div');
      wrapper.appendChild(fragment);
      setTestHtml(wrapper.innerHTML);
      setViewingTest(file);
      setViewError('');
    } catch (err) {
      console.error(err);
      setViewError('Could not render this file. It may use unsupported macros or be an invalid .tex/.pdf file.');
      setViewingTest(null);
      setTestHtml('');
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
              onClick={() => handleTabChange(tab)}
              className={activeTab === tab ? 'active-tab' : 'tab'}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="content">
          {activeTab === 'materials' && (
            <div>
              <h3>Materials</h3>
              {data.materials.length ? (
                <ul>
                  {data.materials.map((mat, i) => (
                    <li key={i}>
                      <a
                        href={mat}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {mat}
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
              <h3>Tests</h3>
              {data.tests.length ? (
                <ul>
                  {data.tests.map((testObj, i) => (
                    <li key={testObj._id || i}>
                      <button
                        onClick={() => handleViewTest(testObj.file)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#0066cc',
                          textDecoration: 'underline',
                          cursor: 'pointer'
                        }}
                      >
                        {testObj.name}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No tests available.</p>
              )}

              {viewingTest && !viewError && (
                <div style={{
                  marginTop: 20,
                  border: '1px solid #ccc',
                  padding: 10,
                  borderRadius: 5,
                  background: '#f9f9f9'
                }}>
                  <strong>Viewing: {viewingTest}</strong>
                  <button
                    onClick={() => setViewingTest(null)}
                    style={{ marginLeft: 16, color: 'red' }}
                  >
                    Close
                  </button>

                  {isPdf ? (
                    <iframe
                      src={viewingTest}
                      width="100%"
                      height="600px"
                      title="PDF Viewer"
                    />
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: testHtml }} />
                  )}
                </div>
              )}

              {viewError && (
                <p style={{ color: 'red', marginTop: 10 }}>{viewError}</p>
              )}

            </div>
          )}

          {activeTab === 'announcements' && (
            <div>
              <h3>Announcements</h3>
              {data.announcements.length ? (
                <div className="announcement-list">
                  {data.announcements.map((ann, i) => (
                    <div key={i} className="announcement-box">
                      <div className="announcement-header">
                        <span className="professor-name">{professorName}</span>
                        <span className="announcement-date">{formatDate(ann.date)}</span>
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
              <h3>Grades</h3>
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
              <h3>Homework</h3>
              {data.homework.length ? (
                <ul>
                  {data.homework.map((hw, i) => (
                    <li key={i} style={{ marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid #ccc' }}>
                      <div>
                        <strong>Assigned:</strong>{' '}
                        <a
                          href={hw.professorFile}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {hw.professorFile}
                        </a>
                      </div>

                      {hw.studentFile ? (
                        <div style={{ marginTop: 10 }}>
                          <strong>Your Submission:</strong>{' '}
                          <a
                            href={hw.studentFile}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {hw.studentFile}
                          </a>
                        </div>
                      ) : (
                        <div style={{ marginTop: 10 }}>
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
                            <div>
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
                            </div>
                          )}
                        </div>
                      )}

                      <div style={{ fontSize: 12, color: '#888', marginTop: 5 }}>
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
