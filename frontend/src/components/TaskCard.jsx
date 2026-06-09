import React from 'react';
import './TaskCard.css';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { FiCheck, FiRotateCcw, FiTrash2, FiClock, FiEdit2, FiTag } from 'react-icons/fi';

export default function TaskCard({ task, onToggleComplete, onDelete, onEdit }) {
  const { _id, title, description, deadline, completed, priority, tags } = task;

  const toggle = () => {
    if (onToggleComplete) onToggleComplete(_id, completed);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(_id);
  };

  const now = new Date();
  const deadlineDate = new Date(deadline);
  const timeDiff = deadlineDate - now;
  const hoursLeft = timeDiff / (1000 * 60 * 60);

  let urgencyClass = '';
  if (completed) {
    urgencyClass = 'urgency-completed';
  } else if (hoursLeft < 0) {
    urgencyClass = 'urgency-overdue pulse';
  } else if (hoursLeft <= 24) {
    urgencyClass = 'urgency-soon';
  } else {
    urgencyClass = `priority-${priority || 'medium'}`;
  }

  return (
    <div className={`task-card ${completed ? 'completed' : ''} ${urgencyClass}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3>{title}</h3>
          {priority && !completed && (
            <span className={`priority-badge priority-${priority}`}>{priority}</span>
          )}
        </div>
        <p>{description || "No description provided."}</p>
        
        {tags && tags.length > 0 && (
          <div className="task-tags">
            {tags.map((tag, idx) => (
              <span key={idx} className="tag-pill"><FiTag style={{ marginRight: '4px' }} />{tag}</span>
            ))}
          </div>
        )}
      </div>
      
      <p className="deadline">
        <FiClock style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
        {hoursLeft < 0 ? 'Overdue by ' : 'Due '}
        {formatDistanceToNow(deadlineDate, { addSuffix: hoursLeft >= 0 })}
      </p>
      
      <div className="actions">
        <button className="btn-toggle-complete" onClick={toggle} title={completed ? "Undo" : "Complete"}>
          {completed ? <FiRotateCcw /> : <FiCheck />}
        </button>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-edit-task" onClick={() => onEdit(task)} title="Edit">
            <FiEdit2 />
          </button>
          <button className="btn-delete-task" onClick={handleDelete} title="Delete">
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
}
