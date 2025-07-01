import React from 'react';

export default function HomeworkTab({
  students = [],
  selectedStudent,
  homework = [],
  onSelectStudent,
  onFileChange,
  onUpload,
  onBack
}) {
  if (!selectedStudent) {
    return (
      <div>
        <h3>Homework Assignment</h3>
        <ul>
          {students.map(s => (
            <li
              key={s._id}
              onClick={() => onSelectStudent(s._id)}
              className="student"
              style={{ cursor: 'pointer', color: '#007bff' }}
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
      <h4>Student: {selectedStudent.name}</h4>
      {homework.length > 0 ? (
        <ul>
          {homework.map((hw,i) => (
            <li key={i}>
              <div>
                <strong>Professor File:</strong>{' '}
                <a href={`/uploads/${hw.professorFile}`} target="_blank" rel="noopener noreferrer">
                  {hw.professorFile}
                </a>
              </div>
              {hw.studentFile ? (
                <div>
                  <strong>Student Submission:</strong>{' '}
                  <a href={hw.studentFile} target="_blank" rel="noopener noreferrer">
                    {hw.studentFile}
                  </a>
                </div>
              ) : (
                <div><em>No student submission yet.</em></div>
              )}
              <div style={{ fontSize: 12, color: '#888' }}>
                {new Date(hw.postedAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No homework assigned yet.</p>
      )}

      <div style={{ marginTop: 20 }}>
        <h4>Assign New Homework</h4>
        <input type="file" accept="application/pdf" onChange={e => onFileChange(e.target.files[0])} />
        <button onClick={onUpload}>Upload</button>
      </div>

      <button onClick={onBack} className="button" style={{ marginTop: 15 }}>
        🔙 Back to student list
      </button>
    </div>
  );
}
