import React, { useRef } from 'react';

function TestsTab({
  tests = [],
  selectedFile,
  onFileChange,
  onConfirmUpload,
  onDeleteFile
}) {
  const fileInputRef = useRef(null);

  const handleUpload = () => {
    onConfirmUpload();
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Clear the file input
    }
  };

  return (
    <div>
      <h3>Tests</h3>

      {tests.length ? (
        <ul>
          {tests.map(test => (
            <li key={test.file}>
              <a
                href={`http://localhost:5000/uploads/${test.file}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#0066cc',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: 0,
                  font: 'inherit',
                  background: 'none',
                  border: 'none'
                }}
              >
                {test.name}
              </a>
              <button
                className="delete-button"
                onClick={() => onDeleteFile(test.file, 'test')}
                style={{ marginLeft: 8 }}
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tests uploaded yet.</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={e => onFileChange(e, 'test')}
      />

      {selectedFile && (
        <div style={{ marginTop: 8 }}>
          <p>Selected File: {selectedFile.name}</p>
          <button
            onClick={handleUpload}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(to right, #00c853, #64dd17)',
              color: 'white',
              fontSize: '15px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginTop: '10px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
            onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1.0)'}
          >
            ⬆️ Upload Test
          </button>
        </div>
      )}
    </div>
  );
}

export default React.memo(TestsTab);
