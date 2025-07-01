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
  const fmt = d => new Date(d).toLocaleString();

  return (
    <div>
      <h3>Announcements</h3>
      {announcements.map((ann,i) => (
        <div key={i} className="announcement-box" onClick={() => onEditClick(i)}>
          <div className="announcement-header">
            <strong>
              {ann.professorName || professorName}
            </strong>
            <span>{fmt(ann.date)}</span>
          </div>
          {editingIndex === i
            ? <input
                className="input"
                type="text"
                value={announcementText}
                onChange={e => onTextChange(e.target.value)}
                onKeyDown={e => onKeyPress(e, i)}
              />
            : <div className="announcement-message">{ann.message}</div>
          }
        </div>
      ))}

      {editingIndex === null && (
        <input
          className="input"
          placeholder="New announcement"
          value={announcementText}
          onChange={e => onTextChange(e.target.value)}
          onKeyDown={e => onKeyPress(e, null)}
        />
      )}
    </div>
  );
}
