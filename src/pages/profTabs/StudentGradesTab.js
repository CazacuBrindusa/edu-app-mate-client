import React from 'react';

export default function StudentGradesTab({
  student,
  grades = [],
  expandedIndex,
  editIndex,
  editedExercise,
  onToggleExpand,
  onStartEdit,
  onChangeEdit,
  onSaveEdit,
  handleDeleteGrade
}) {
  return (
    <div>
      <h3>{student?.name ?? 'Student'}’s Grades</h3>
      <ul>
        {grades.map((g, i) => (
          g && g.testName ? (
            <li key={i}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <strong
                  onClick={() => onToggleExpand(i)}
                  style={{ cursor: 'pointer', marginRight: 10 }}
                >
                  {g.testName ?? 'Untitled'} – {g.score ?? 'N/A'}
                </strong>
                <button
                  onClick={() => handleDeleteGrade(i)}
                  className="delete-button"
                >
                  🗑️
                </button>
              </div>

              {expandedIndex === i && (
                <ul>
                  {(g.exercises || []).map((ex, j) => (
                    <li key={j}>
                      {editIndex?.gradeIdx === i && editIndex?.exIdx === j ? (
                        <>
                          <input
                            value={
                              editIndex?.gradeIdx === i &&
                              editIndex?.exIdx === j
                                ? editedExercise.exercise ?? ''
                                : ex.exercise ?? ''
                            }
                            onChange={e =>
                              onChangeEdit(i, j, 'exercise', e.target.value)
                            }
                          />
                          <input
                            type="text"
                            value={
                              editIndex?.gradeIdx === i &&
                              editIndex?.exIdx === j
                                ? editedExercise.obtainedPoints ?? ''
                                : ex.obtainedPoints ?? ''
                            }
                            onChange={e =>
                              onChangeEdit(i, j, 'obtainedPoints', e.target.value)
                            }
                          />
                          <input
                            type="text"
                            value={
                              editIndex?.gradeIdx === i &&
                              editIndex?.exIdx === j
                                ? editedExercise.maxPoints ?? ''
                                : ex.maxPoints ?? ''
                            }
                            onChange={e =>
                              onChangeEdit(i, j, 'maxPoints', e.target.value)
                            }
                          />
                          <button onClick={onSaveEdit}>Save</button>
                        </>
                      ) : (
                        <span
                          onClick={() => onStartEdit(i, j)}
                          style={{ cursor: 'pointer' }}
                        >
                          {ex.exercise ?? 'Exercise'}: {ex.obtainedPoints ?? 0}/{ex.maxPoints ?? 0}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ) : null
        ))}
      </ul>
    </div>
  );
}
