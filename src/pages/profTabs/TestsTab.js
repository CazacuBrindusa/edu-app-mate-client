import React, { useRef } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

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
      fileInputRef.current.value = null; // Clear file input after upload
    }
  };

  return (
    <div>
      <h3 style={{ marginBottom: '16px' }}>📝 Tests</h3>

      {tests.length > 0 ? (
        <div className="test-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tests.map(test => (
            <div
              key={test.file}
              className="test-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                border: '1px solid #ccc',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <span style={{ fontSize: '20px', marginRight: '10px' }}>📄</span>
                <a
                  href={`${API_BASE}/uploads/${test.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#007bff',
                    textDecoration: 'underline',
                    fontWeight: 500,
                    wordBreak: 'break-word'
                  }}
                >
                  {test.name}
                </a>
              </div>
              <button
                onClick={() => onDeleteFile(test.file, 'test')}
                style={{
                  backgroundColor: '#dc3545',
                  border: 'none',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginLeft: '16px'
                }}
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#666', fontStyle: 'italic' }}>No tests uploaded yet.</p>
      )}

      <div style={{ marginTop: '24px' }}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.tex"
          onChange={e => onFileChange(e, 'test')}
          style={{ marginBottom: '12px', fontSize: '14px' }}
        />

        {selectedFile && (
          <div>
            <p style={{ fontSize: '14px', marginBottom: '8px' }}>
              📎 Selected File: <strong>{selectedFile.name}</strong>
            </p>
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
    </div>
  );
}

export default React.memo(TestsTab);
