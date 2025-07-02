import React from 'react';

export default function StudentsTab({ students = [], onStudentClick }) {
  return (
    <div>
      <h3 style={{ marginBottom: '16px' }}>📘 Students</h3>

      {students.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>No students available.</p>
      ) : (
        <div className="student-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {students.map((student) => (
            <div
              key={student._id}
              onClick={() => onStudentClick(student)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                backgroundColor: '#f8f9fa',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e9ecef'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              title={`View details for ${student.name}`}
            >
              <span style={{ fontSize: '20px', marginRight: '10px' }}>👤</span>
              <span style={{ color: '#007bff', fontWeight: 500 }}>{student.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
