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
      <h3 style={{ marginBottom: '16px' }}>{student?.name ?? 'Student'}’s Grades</h3>

      {grades.length === 0 ? (
        <p style={{ color: '#777', fontStyle: 'italic' }}>No grades available.</p>
      ) : (
        <ul style={{ paddingLeft: 0 }}>
          {grades.map((g, i) =>
            g && g.testName ? (
              <li
                key={i}
                style={{
                  listStyle: 'none',
                  marginBottom: '20px',
                  padding: '12px',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  backgroundColor: '#fafafa'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8
                  }}
                >
                  <strong
                    onClick={() => onToggleExpand(i)}
                    style={{
                      cursor: 'pointer',
                      color: '#007bff',
                      fontSize: '16px'
                    }}
                  >
                    {g.testName} – {g.score ?? 'N/A'}
                  </strong>
                  <button
                    onClick={() => handleDeleteGrade(i)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 10px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                    title="Delete grade"
                  >
                    🗑️
                  </button>
                </div>

                {expandedIndex === i && (
                  <div style={{ marginLeft: '10px' }}>
                    {(g.exercises || []).map((ex, j) => {
                      const isEditing =
                        editIndex?.gradeIdx === i && editIndex?.exIdx === j;
                      const local = isEditing ? editedExercise : ex;

                      return (
                        <div
                          key={j}
                          style={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                            marginBottom: 6
                          }}
                        >
                          {isEditing ? (
                            <>
                              <input
                                type="text"
                                value={local.exercise || ''}
                                onChange={e =>
                                  onChangeEdit(i, j, 'exercise', e.target.value)
                                }
                                placeholder="Exercise"
                                style={{
                                  padding: '4px 6px',
                                  border: '1px solid #ccc',
                                  borderRadius: '4px',
                                  width: '200px'
                                }}
                              />
                              <input
                                type="number"
                                value={local.obtainedPoints ?? ''}
                                onChange={e =>
                                  onChangeEdit(i, j, 'obtainedPoints', e.target.value)
                                }
                                placeholder="Obtained"
                                style={{
                                  padding: '4px 6px',
                                  border: '1px solid #ccc',
                                  borderRadius: '4px',
                                  width: '80px'
                                }}
                              />
                              <input
                                type="number"
                                value={local.maxPoints ?? ''}
                                onChange={e =>
                                  onChangeEdit(i, j, 'maxPoints', e.target.value)
                                }
                                placeholder="Max"
                                style={{
                                  padding: '4px 6px',
                                  border: '1px solid #ccc',
                                  borderRadius: '4px',
                                  width: '80px'
                                }}
                              />
                              <button
                                onClick={onSaveEdit}
                                style={{
                                  backgroundColor: '#28a745',
                                  color: 'white',
                                  border: 'none',
                                  padding: '6px 10px',
                                  borderRadius: '4px',
                                  cursor: 'pointer'
                                }}
                              >
                                ✅ Save
                              </button>
                            </>
                          ) : (
                            <span
                              onClick={() => onStartEdit(i, j)}
                              style={{
                                cursor: 'pointer',
                                fontSize: '14px',
                                backgroundColor: '#f1f1f1',
                                padding: '6px 10px',
                                borderRadius: '4px',
                                display: 'inline-block'
                              }}
                              title="Click to edit"
                            >
                              {ex.exercise}: {ex.obtainedPoints}/{ex.maxPoints}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </li>
            ) : null
          )}
        </ul>
      )}
    </div>
  );
}
