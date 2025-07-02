import React, { useState } from 'react';

export default function AddGradeForm({
  tests = [],
  onSubmit,
  existingGrades = [],
  onCancel
}) {
  const [testId, setTestId] = useState('');
  const [exercise, setExercise] = useState('');
  const [obtained, setObtained] = useState('');
  const [maxPoints, setMaxPoints] = useState('');
  const [exercises, setExercises] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const usedTestIds = new Set(existingGrades.map(g => g.testId));

  const addEx = () => {
    if (!exercise || obtained === '' || maxPoints === '' || +obtained > +maxPoints || +obtained < 0) {
      alert('Please enter valid exercise details.');
      return;
    }

    setExercises(prev => [
      ...prev,
      {
        exercise,
        obtainedPoints: +obtained,
        maxPoints: +maxPoints
      }
    ]);

    setExercise('');
    setObtained('');
    setMaxPoints('');
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    let all = [...exercises];

    if (exercise && obtained !== '' && maxPoints !== '') {
      if (+obtained < 0 || +obtained > +maxPoints) {
        alert('Obtained points must be valid and ≤ max points.');
        setIsSubmitting(false);
        return;
      }

      all.push({
        exercise,
        obtainedPoints: +obtained,
        maxPoints: +maxPoints
      });
    }

    if (!testId || all.length === 0) {
      alert('Please select a test and add at least one exercise.');
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(testId, all);
    } catch (err) {
      console.error(err);
      alert('Failed to submit grade. See console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grade-form">
      <h3>Add New Grade</h3>

      <label htmlFor="test-select">Select Test</label>
      <select
        id="test-select"
        value={testId}
        onChange={e => setTestId(e.target.value)}
      >
        <option value="">-- Select a test --</option>
        {tests.filter(t => !usedTestIds.has(t._id)).map(t => (
          <option key={t._id} value={t._id}>{t.name}</option>
        ))}
      </select>

      <label>Exercise</label>
      <input
        type="text"
        placeholder="Exercise description"
        value={exercise}
        onChange={e => setExercise(e.target.value)}
      />

      <input
        type="number"
        placeholder="Obtained Points"
        value={obtained}
        onChange={e => setObtained(e.target.value)}
        min="0"
      />
      <input
        type="number"
        placeholder="Max Points"
        value={maxPoints}
        onChange={e => setMaxPoints(e.target.value)}
        min="1"
      />

      <button type="button" onClick={addEx}>➕ Add Exercise</button>

      {exercises.length > 0 && (
        <ul style={{ marginTop: '1em' }}>
          {exercises.map((ex, i) => (
            <li key={i}>
              <strong>{ex.exercise}</strong>: {ex.obtainedPoints}/{ex.maxPoints}
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="button"
        style={{ backgroundColor: '#4CAF50', color: 'white', marginTop: '10px' }}
      >
        {isSubmitting ? 'Submitting...' : '📤 Submit Grade'}
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="button"
        style={{ backgroundColor: '#FF6F61', marginTop: '10px', color: 'white' }}
      >
        🚫 Cancel
      </button>
    </div>
  );
}
