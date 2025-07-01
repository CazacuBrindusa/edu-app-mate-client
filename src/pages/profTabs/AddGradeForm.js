import React, { useState } from 'react';

export default function AddGradeForm({
  tests = [],
  onSubmit,
  existingGrades = []
}) {
  const [testId, setTestId] = useState('');
  const [exercise, setExercise] = useState('');
  const [obtained, setObtained] = useState('');
  const [maxPoints, setMaxPoints] = useState('');
  const [exercises, setExercises] = useState([]);

  // NEW: guard to prevent double‐submits
  const [isSubmitting, setIsSubmitting] = useState(false);

  const usedTestIds = new Set(existingGrades.map(g => g.testId));

  const addEx = () => {
    if (!exercise || obtained === '' || maxPoints === '' || +obtained > +maxPoints) {
      alert('Invalid input');
      return;
    }
    setExercises([
      ...exercises,
      { exercise, obtainedPoints: +obtained, maxPoints: +maxPoints }
    ]);
    setExercise('');
    setObtained('');
    setMaxPoints('');
  };

  // MAKE handleSubmit async and guard with isSubmitting
  const handleSubmit = async () => {
    if (isSubmitting) return;          // ← guard against double
    setIsSubmitting(true);

    const shouldAdd =
      exercise && obtained !== '' && maxPoints !== '' &&
      +obtained >= 0 && +obtained <= +maxPoints;

    let allExercises = [...exercises];
    if (shouldAdd) {
      allExercises.push({
        exercise,
        obtainedPoints: +obtained,
        maxPoints: +maxPoints
      });
    }

    if (!testId || allExercises.length === 0) {
      alert('Select a test and add at least one exercise');
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(testId, allExercises);
    } catch (err) {
      console.error(err);
      alert('Failed to submit new grade.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="new-test-form">
      <h4>Add New Test</h4>

      <select
        value={testId}
        onChange={e => setTestId(e.target.value)}
        className="input"
      >
        <option value="">Select a test</option>
        {tests
          .filter(t => !usedTestIds.has(t._id))
          .map(t => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
      </select>

      <input
        type="text"
        placeholder="Exercise name"
        value={exercise}
        onChange={e => setExercise(e.target.value)}
      />
      <input
        type="number"
        placeholder="Obtained Points"
        value={obtained}
        onChange={e => setObtained(e.target.value)}
      />
      <input
        type="number"
        placeholder="Max Points"
        value={maxPoints}
        onChange={e => setMaxPoints(e.target.value)}
      />

      <button onClick={addEx}>Add Exercise</button>

      {exercises.map((ex, i) => (
        <div key={i}>
          {ex.exercise}: {ex.obtainedPoints}/{ex.maxPoints}
        </div>
      ))}

      <button
        className="button"
        style={{ backgroundColor: 'red' }}
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting…' : 'Submit Grade'}
      </button>
    </div>
  );
}
