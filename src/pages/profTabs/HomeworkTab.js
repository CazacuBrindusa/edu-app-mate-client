import React from 'react';

const BASE_URL = process.env.REACT_APP_API_URL || '';

export default function HomeworkTab({
  students = [],
  selectedStudent,
  homework = [],
  onSelectStudent,
  onFileChange,
  onUpload,
  onBack,
  onDeleteHomework
}) {
  if (!selectedStudent) {
    return (
      <div>
        <h3>📚 Homework Assignment</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {students.map(s => (
            <li
              key={s._id}
              onClick={() => onSelectStudent(s._id)}
              className="student"
              style={{
                cursor: 'pointer',
                color: '#007bff',
                margin: '8px 0',
                padding: '8px 12px',
                border: '1px solid #ccc',
                borderRadius: '6px',
                backgroundColor: '#f9f9f9'
              }}
            >
              📁 {s.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>📖 Student: {selectedStudent.name}</h3>

      {homework.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {homework.map((hw, i) => (
            <li
              key={hw._id || i}
              style={{
                marginBottom: 20,
                padding: '16px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                backgroundColor: '#fdfdfd',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ marginBottom: 8 }}>
                <strong>Professor File:</strong>{' '}
                <a
                  href={`${BASE_URL}/uploads/${hw.professorFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#0066cc', textDecoration: 'underline' }}
                >
                  {hw.professorFile}
                </a>
              </div>

              {hw.studentFile ? (
                <div style={{ marginBottom: 8 }}>
                  <strong>Student Submission:</strong>{' '}
                  <a
                    href={`${BASE_URL}/uploads/${hw.studentFile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#28a745' }}
                  >
                    {hw.studentFile}
                  </a>
                </div>
              ) : (
                <div style={{ fontStyle: 'italic', color: '#777', marginBottom: 8 }}>
                  No student submission yet.
                </div>
              )}

              <div style={{ fontSize: 12, color: '#aaa' }}>
                {new Date(hw.postedAt).toLocaleString()}
              </div>

              <button
                onClick={() => onDeleteHomework(i)}
                style={{
                  marginTop: 10,
                  color: 'white',
                  backgroundColor: '#dc3545',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                🗑️ Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ fontStyle: 'italic', color: '#777' }}>No homework assigned yet.</p>
      )}

      <div style={{ marginTop: 30 }}>
        <h4>📎 Assign New Homework</h4>
        <input
          type="file"
          accept="application/pdf"
          onChange={e => onFileChange(e.target.files[0])}
          style={{ margin: '10px 0' }}
        />
        <br />
        <button
          onClick={onUpload}
          style={{
            backgroundColor: '#ff6f61',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Upload
        </button>
      </div>

      <button
        onClick={onBack}
        style={{
          display: 'block',
          marginTop: 20,
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        🔙 Back to student list
      </button>
    </div>
  );
}
