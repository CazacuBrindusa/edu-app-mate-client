import React from 'react';

export default function StudentsTab({ students = [], onStudentClick }) {
  return (
    <div>
      <h3>Students</h3>
      <ul>
        {students.map((s,i) => (
          <li
            key={i}
            onClick={() => onStudentClick(s)}
            className="student"
          >
            {s.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
