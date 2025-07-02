import React from 'react';

export default function AnnouncementsTab({
  announcements,
  professorName,
  announcementText,
  editingIndex,
  onTextChange,
  onEditClick,
  onSave,
  onKeyPress
}) {
  const formatDate = d =>
    new Date(d).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  return (
    <div className="announcements-tab">
      <h3 style={{ marginBottom: '16px' }}>📢 Announcements</h3>

      <div className="announcement-list">
        {announcements.map((ann, i) => (
          <div
            key={i}
            className="announcement-box"
            style={{
              background: '#fff',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '12px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}
            >
              <strong>{ann.professorName || professorName}</strong>
              <span style={{ fontSize: '12px', color: '#888' }}>{formatDate(ann.date)}</span>
            </div>

            {editingIndex === i ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  type="text"
                  value={announcementText}
                  onChange={e => onTextChange(e.target.value)}
                  onKeyDown={e => onKeyPress(e, i)}
                  className="input"
                  placeholder="Edit announcement..."
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '14px',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                />
                <button
                  type="button"
                  onClick={() => onSave(i)}
                  className="button"
                  style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    alignSelf: 'flex-end'
                  }}
                >
                  ✅ Save
                </button>
              </div>
            ) : (
              <div
                className="announcement-message"
                style={{
                  fontSize: '15px',
                  lineHeight: '1.6',
                  cursor: 'pointer'
                }}
                onClick={() => onEditClick(i)}
                title="Click to edit"
              >
                {ann.message}
              </div>
            )}
          </div>
        ))}

        {editingIndex === null && (
          <div style={{ marginTop: '20px' }}>
            <input
              type="text"
              placeholder="Write a new announcement and press Enter or click Post"
              value={announcementText}
              onChange={e => onTextChange(e.target.value)}
              onKeyDown={e => onKeyPress(e, null)}
              className="input"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '14px',
                marginBottom: '8px'
              }}
            />
            <button
              type="button"
              onClick={() => onKeyPress({ key: 'Enter' }, null)}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              📬 Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
