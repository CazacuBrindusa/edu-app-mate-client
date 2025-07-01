import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/ProfessorDashboard.css'; // Import the CSS file

function ProfessorDashboard() {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
  
    axios.get('/api/professor/classes', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => setClasses(response.data))
    .catch(error => console.log(error));
  }, []);
  
  const handleClassClick = (classId) => {
    navigate(`/professor/class/${classId}`);
  };

  return (
    <div className="professor-dashboard">
      <div className="dashboard-container">
        <h2>Your Classes</h2>
        <ul>
          {classes.map((classItem) => (
            <li key={classItem._id} onClick={() => handleClassClick(classItem._id)}>
              {classItem.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProfessorDashboard;
