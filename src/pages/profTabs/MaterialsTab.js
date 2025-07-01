import React from 'react';

export default function MaterialsTab({
  materials = [],
  selectedFile,
  onFileChange,
  onConfirmUpload,
  onDeleteFile
}) {
  return (
    <div>
      <h3>Materials</h3>

      {materials.length ? (
        <ul>
          {materials.map((mat, i) => (
            <li key={i}>
              <a
                href={`/uploads/${mat}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {mat}
              </a>
              <button
               className="delete-button"
               onClick={() => onDeleteFile(mat, 'material')}
             >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No materials uploaded yet.</p>
      )}

      <input
        type="file"
        accept="application/pdf"
        onChange={e => onFileChange(e, 'material')}
      />
      {selectedFile && (
        <div style={{ marginTop: 8 }}>
          <p>Selected File: {selectedFile.name}</p>
          <button onClick={onConfirmUpload}>Upload Material</button>
        </div>
      )}
    </div>
  );
}
