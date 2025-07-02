import React from 'react';

const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

export default function MaterialsTab({
  materials = [],
  selectedFile,
  onFileChange,
  onConfirmUpload,
  onDeleteFile
}) {
  return (
    <div>
      <h3>📚 Class Materials</h3>

      {materials.length > 0 ? (
        <div className="material-list">
          {materials.map((mat, i) => (
            <div
              key={i}
              className="material-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                marginBottom: '10px',
                border: '1px solid #ccc',
                borderRadius: '6px',
                backgroundColor: '#fdfdfd',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <span style={{ fontSize: '20px', marginRight: '10px' }}>📄</span>
                <a
                  href={`${API_BASE}/uploads/${mat}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#007bff',
                    textDecoration: 'underline',
                    wordBreak: 'break-word'
                  }}
                >
                  {mat}
                </a>
              </div>

              <button
                onClick={() => onDeleteFile(mat, 'material')}
                style={{
                  backgroundColor: '#dc3545',
                  border: 'none',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginLeft: '12px'
                }}
                title="Delete material"
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#6c757d', fontStyle: 'italic' }}>No materials uploaded yet.</p>
      )}

      <div style={{ marginTop: '20px' }}>
        <input
          type="file"
          accept="application/pdf"
          onChange={e => onFileChange(e, 'material')}
          style={{
            display: 'block',
            marginBottom: '10px',
            fontSize: '14px'
          }}
        />

        {selectedFile && (
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: '14px', marginBottom: '6px' }}>
              📎 Selected File: <strong>{selectedFile.name}</strong>
            </p>
            <button
              onClick={onConfirmUpload}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Upload Material
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
