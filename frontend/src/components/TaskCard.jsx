import React from 'react';
import './TaskCard.css';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { FiCheck, FiRotateCcw, FiTrash2, FiClock } from 'react-icons/fi';

export default function TaskCard({ task, onToggleComplete, onDelete }) {
  const { _id, title, description, deadline, completed } = task;

  const toggle = () => {
    if (onToggleComplete) onToggleComplete(_id, completed);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(_id);
  };

  return (
    <div className={`task-card ${completed ? 'completed' : ''}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <h3>{title}</h3>
        <p>{description || "No description provided."}</p>
      </div>
      
      <p className="deadline">
        <FiClock style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
        Due {formatDistanceToNow(new Date(deadline), { addSuffix: true })}
      </p>
      
      <div className="actions">
        <button className="btn-toggle-complete" onClick={toggle}>
          {completed ? (
            <>
              <FiRotateCcw /> Undo
            </>
          ) : (
            <>
              <FiCheck /> Complete
            </>
          )}
        </button>
        <button className="btn-delete-task" onClick={handleDelete}>
          <FiTrash2 /> Delete
        </button>
      </div>
    </div>
  );
}
