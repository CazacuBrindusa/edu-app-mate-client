// client/src/pages/ClassDetailsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useParams, useNavigate } from 'react-router-dom';
import './css/ClassDetailsPage.css';

import MaterialsTab from '../pages/profTabs/MaterialsTab';
import TestsTab from '../pages/profTabs/TestsTab';
import AnnouncementsTab from '../pages/profTabs/AnnouncementsTab';
import StudentsTab from '../pages/profTabs/StudentsTab';
import StudentGradesTab from '../pages/profTabs/StudentGradesTab';
import AddGradeForm from '../pages/profTabs/AddGradeForm';
import HomeworkTab from '../pages/profTabs/HomeworkTab';

export default function ClassDetailsPage() {
  const { classId } = useParams();
  const navigate = useNavigate();

  const [className, setClassName] = useState('');
  const [classes, setClasses] = useState([]);

  const [professorName, setProfessorName] = useState('');
  const [data, setData] = useState({
    materials: [], tests: [], announcements: [], students: []
  });
  const [tests, setTests] = useState([]);

  // UI state
  const [activeTab, setActiveTab] = useState('materials');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedHomeworkStudent, setSelectedHomeworkStudent] = useState(null);

  // files & uploads
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState('');

  // announcements
  const [announcementText, setAnnouncementText] = useState('');
  const [editingAnnouncementIndex, setEditingAnnouncementIndex] = useState(null);

  // grades & editing
  const [grades, setGrades] = useState([]);
  const [showAddGradeForm, setShowAddGradeForm] = useState(false);
  const [expandedGradeIndex, setExpandedGradeIndex] = useState(null);
  const [editExerciseIndex, setEditExerciseIndex] = useState(null);
  const [editedExercise, setEditedExercise] = useState({});

  // homework
  const [homeworkFile, setHomeworkFile] = useState(null);

  // fetch class + sidebar + tests on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setSelectedStudent(null);
    setSelectedHomeworkStudent(null);
    setHomeworkFile(null);
    setGrades([]);
    setShowAddGradeForm(false);

    axios.get(`/api/professor/class/${classId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setData(res.data);
        setClassName(res.data.name);
        setProfessorName(res.data.professorName);
      })
      .catch(console.error);

    axios.get(`/api/class/${classId}/tests`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setTests(res.data))
      .catch(console.error);

    axios.get('/api/professor/classes', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setClasses(res.data))
      .catch(console.error);
  }, [classId]);

  const fetchClassDetails = () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    axios.get(`/api/professor/class/${classId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setData(res.data);
        setClassName(res.data.name);
      })
      .catch(console.error);
  };

  // — Tab handlers — (unchanged)
  const handleTabChange = tab => {
    setActiveTab(tab);
    setSelectedStudent(null);
    setSelectedHomeworkStudent(null);
    setShowAddGradeForm(false);
    setEditingAnnouncementIndex(null);
  };

  // — Students & Grades —
  const handleStudentClick = async (student) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/professor/class/${classId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const freshGrades = res.data.grades.filter(
        g => g.studentId === student._id || g.studentId?._id === student._id
      );

      setData(res.data); // update full class state
      setSelectedStudent({ ...student, grades: freshGrades });
      setGrades(freshGrades);
      setShowAddGradeForm(false);
      setExpandedGradeIndex(null);
    } catch (err) {
      console.error('Failed to fetch grades:', err);
      alert('Could not load student grades.');
    }
  };

  // — NEW: submit a brand-new grade —
  const handleNewGradeSubmit = async (testId, exercises) => {
    try {
      const token = localStorage.getItem('token');

      await axios.post('/api/grades',
        {
          studentId: selectedStudent._id,
          classId,
          testId,
          exercises,
          date: new Date().toISOString()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      //  Refetch full class data
      const res = await axios.get(`/api/professor/class/${classId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const freshGrades = res.data.grades.filter(
        g => g.studentId === selectedStudent._id || g.studentId?._id === selectedStudent._id
      );

      setData(res.data);
      setGrades(freshGrades);
      setSelectedStudent(s => ({
        ...selectedStudent,
        grades: freshGrades
      }));
      setExpandedGradeIndex(freshGrades.length - 1); // optional: auto-expand latest
      setShowAddGradeForm(false);
    } catch (err) {
      console.error('Failed to submit new grade:', err);
      alert('Failed to submit new grade. See console for details.');
    }
  };

  const handleEditExercise = (gradeIdx, exIdx) => {
    setEditExerciseIndex({ gradeIdx, exIdx });
    setEditedExercise(grades[gradeIdx].exercises[exIdx]);
  };

  const handleChangeEdit = (gradeIdx, exIdx, field, val) => {
    setEditedExercise(e => ({ ...e, [field]: val }));
  };

  const handleSaveExercise = async () => {
    const { gradeIdx, exIdx } = editExerciseIndex;
    const updatedGrade = { ...grades[gradeIdx] };

    // Replace the exercise being edited
    updatedGrade.exercises[exIdx] = editedExercise;

    //  Validation
    const hasInvalid = updatedGrade.exercises.some(ex =>
      ex.obtainedPoints === '' ||
      ex.maxPoints === '' ||
      isNaN(Number(ex.obtainedPoints)) ||
      isNaN(Number(ex.maxPoints)) ||
      Number(ex.obtainedPoints) < 0 ||
      Number(ex.maxPoints) <= 0 ||
      Number(ex.obtainedPoints) > Number(ex.maxPoints)
    );

    if (hasInvalid) {
      alert('Please fill all fields with valid numbers. Obtained ≤ Max.');
      return;
    }

    // Convert values to numbers before sending to backend
    const updatedExercises = updatedGrade.exercises.map(ex => ({
      exercise: ex.exercise,
      obtainedPoints: Number(ex.obtainedPoints),
      maxPoints: Number(ex.maxPoints)
    }));

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`/api/grades/${updatedGrade._id}`, {
        exercises: updatedExercises
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const all = [...grades];
      all[gradeIdx] = res.data; // Use grade with correct score from backend
      setGrades(all);
      setSelectedStudent(s => ({ ...s, grades: all }));
      setEditExerciseIndex(null);
    } catch (err) {
      console.error(err);
      alert('Failed to save exercise.');
    }
  };

  const handleDeleteGrade = async (gradeIdx) => {
    const grade = grades[gradeIdx];
    if (!window.confirm(`Delete grade for "${grade.testName}"?`)) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/grades/${grade._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updated = grades.filter((_, i) => i !== gradeIdx);
      setGrades(updated);
      setSelectedStudent(s => ({ ...s, grades: updated }));
    } catch (err) {
      console.error(err);
      alert('Failed to delete grade.');
    }
  };

  // — Announcements —
  const handleAnnouncementPost = () => {
    if (!announcementText.trim()) return;
    const token = localStorage.getItem('token');
    axios.post(`/api/class/${classId}/announcement`, {
      message: announcementText
    }, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setData(d => ({
          ...d,
          announcements: [...d.announcements, res.data]
        }));
        setAnnouncementText('');
      })
      .catch(console.error);
  };

  const handleSaveAnnouncement = idx => {
    const annId = data.announcements[idx]._id;
    const token = localStorage.getItem('token');
    axios.put(`/api/class/${classId}/announcement/${annId}`, {
      message: announcementText
    }, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const copy = [...data.announcements];
        copy[idx] = res.data;
        setData(d => ({ ...d, announcements: copy }));
        setEditingAnnouncementIndex(null);
        setAnnouncementText('');
      })
      .catch(console.error);
  };

  const handleKeyPress = (e, idx) => {
    if (e.key === 'Enter') {
      idx === null
        ? handleAnnouncementPost()
        : handleSaveAnnouncement(idx);
    }
  };

  // — Files (materials/tests) —

  const handleFileChange = (evt, type) => {
    const file = evt.target.files[0];
    if (!file) return;

    if (type === 'test') {
      const fileName = file.name.toLowerCase();
      if (!fileName.endsWith('.tex') && !fileName.endsWith('.pdf')) {
        return alert('Only .tex or .pdf files allowed for tests.');
      }
    }

    setSelectedFile(file);
    setFileType(type);
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;
    const form = new FormData();
    form.append('file', selectedFile);
    form.append('name', selectedFile.name);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `/api/upload/${fileType}/${classId}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setSelectedFile(null);
      // re-fetch the class details & tests so you immediately see the new .tex file
      fetchClassDetails();
      if (fileType === 'test') {
        const res = await axios.get(
          `/api/class/${classId}/tests`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTests(res.data);
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed.');
    }
  };

  const handleDeleteFile = async (name, type) => {
    if (!window.confirm(`Delete ${name}?`)) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `/api/delete/${type}/${classId}/${name}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (type === 'test') {
        // remove from tests list in state
        setTests(prev => prev.filter(t => t.file !== name));
      } else {
        // remove from materials in data
        setData(d => ({
          ...d,
          materials: d.materials.filter(m => m !== name)
        }));
      }
    } catch (err) {
      console.error(err);
      alert('Delete failed.');
    }
  };

  // — Homework —
  const handleHomeworkStudentClick = async studentId => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/student/details/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedHomeworkStudent(res.data);
    } catch (err) {
      console.error(err);
      alert('Could not load student.');
    }
  };

  const handleUploadHomework = async () => {
    if (!homeworkFile || !selectedHomeworkStudent) {
      return alert('Select a file & student first.');
    }
    const form = new FormData();
    form.append('file', homeworkFile);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `/api/student/${selectedHomeworkStudent._id}/homework`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setHomeworkFile(null);
      setSelectedHomeworkStudent(null);
    } catch (err) {
      console.error(err);
      alert('Homework upload failed.');
    }
  };

  const handleDeleteHomework = async (index) => {
    if (!selectedHomeworkStudent) return;

    const token = localStorage.getItem('token');
    const studentId = selectedHomeworkStudent._id;
    const homeworkId = selectedHomeworkStudent.homework[index]?._id;

    if (!homeworkId) {
      alert('Invalid homework ID');
      return;
    }

    try {
      await axios.delete(
        `/api/student/${studentId}/homework/${homeworkId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Update local state
      const updatedHomework = [...selectedHomeworkStudent.homework];
      updatedHomework.splice(index, 1);

      setSelectedHomeworkStudent(prev => ({
        ...prev,
        homework: updatedHomework
      }));
    } catch (err) {
      console.error('Failed to delete homework:', err);
      alert('Error deleting homework');
    }
  };

  // — Sidebar & navigation —
  const handleClassClick = id => navigate(`/professor/class/${id}`);
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="page">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: 'fixed',
            top: '0px',
            left: sidebarOpen ? '30px' : '-170px',
            background: 'transparent',
            color: sidebarOpen ? '#FF6F61' : 'white',
            padding: '10px',
            cursor: 'pointer',
            borderRadius: '5px',
            zIndex: 1100,
            transition: '0.3s',
          }}
        >
          {sidebarOpen ? '❌' : '☰'}
        </button>
        <div
          style={{
            position: 'fixed',
            left: sidebarOpen ? '0' : '-200px',
            top: '0',
            width: '250px',
            height: '100vh',
            backgroundColor: '#333',
            color: 'white',
            padding: '20px',
            transition: '0.3s',
            overflowX: 'hidden',
            zIndex: 1000
          }}>

          {sidebarOpen && (
            <div>
              <h3 className="sidebar-title">My Classes</h3>
              <ul className="class-list">
                {classes?.map((cls) => (
                  <li
                    key={cls._id}
                    className="class-item"
                    onClick={() => handleClassClick(cls._id)}
                  >
                    {cls.name}
                  </li>
                ))}
              </ul>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>


      {/* Main */}
      <div className="container">
        <h2>{className}</h2>
        <div className="tab-container">
          {['materials', 'tests', 'announcements', 'students', 'homework'].map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="content">
          {/* Materials */}
          {activeTab === 'materials' && (
            <MaterialsTab
              materials={data.materials}
              selectedFile={selectedFile}
              onFileChange={handleFileChange}
              onConfirmUpload={handleConfirmUpload}
              onDeleteFile={handleDeleteFile}
            />
          )}

          {/* Tests */}
          {activeTab === 'tests' && (
            <TestsTab
              tests={tests}
              selectedFile={selectedFile}
              onFileChange={handleFileChange}
              onConfirmUpload={handleConfirmUpload}
              onDeleteFile={handleDeleteFile}
            />
          )}

          {/* announcements */}
          {activeTab === 'announcements' && (
            <AnnouncementsTab
              announcements={data.announcements}
              announcementText={announcementText}
              editingIndex={editingAnnouncementIndex}
              onTextChange={setAnnouncementText}
              onEditClick={setEditingAnnouncementIndex}
              onSave={handleSaveAnnouncement}
              onKeyPress={handleKeyPress}
              professorName={professorName}
            />
          )}

          {/* student list */}
          {activeTab === 'students' && !selectedStudent && (
            <StudentsTab
              students={data.students}
              onStudentClick={handleStudentClick}
            />
          )}

          {/* selected student grades or add form */}
          {selectedStudent && (
            <>
              {showAddGradeForm ? (
                <AddGradeForm
                  tests={tests}
                  onSubmit={handleNewGradeSubmit}
                  existingGrades={grades}
                />
              ) : (
                <StudentGradesTab
                  student={selectedStudent}
                  grades={grades}
                  expandedIndex={expandedGradeIndex}
                  editIndex={editExerciseIndex}
                  editedExercise={editedExercise}
                  onToggleExpand={index => {
                    setExpandedGradeIndex(prev => (prev === index ? null : index));
                  }}
                  onStartEdit={handleEditExercise}
                  onChangeEdit={handleChangeEdit}
                  onSaveEdit={handleSaveExercise}
                  handleDeleteGrade={handleDeleteGrade}
                />
              )}
              <button onClick={() => setShowAddGradeForm(f => !f)}>
                {showAddGradeForm ? 'Cancel' : 'Add New Grade'}
              </button>
              <button onClick={() => setSelectedStudent(null)}>Back</button>
            </>
          )}

          {/* homework */}
          {activeTab === 'homework' && (
            <HomeworkTab
              students={data.students}
              selectedStudent={selectedHomeworkStudent}
              homework={selectedHomeworkStudent?.homework || []}
              onSelectStudent={handleHomeworkStudentClick}
              onFileChange={setHomeworkFile}
              onUpload={handleUploadHomework}
              onDeleteHomework={handleDeleteHomework}
              onBack={() => {
                setSelectedHomeworkStudent(null);
                setHomeworkFile(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
