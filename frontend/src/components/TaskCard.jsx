import './TaskCard.css';
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

export default function TaskCard({ task, onToggleComplete, onDelete }) {
  const { _id, title, description, deadline, completed } = task;

  const toggle = () => {
    if (onToggleComplete) onToggleComplete(_id, completed);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(_id);
  };

  return (
    <div className={`task-card ${completed ? 'done' : ''}`}>
      <h3>{title}</h3>
      <p>{description}</p>
      <p className="deadline">Due {formatDistanceToNow(new Date(deadline), { addSuffix: true })}</p>
      <div className="actions">
        <button className="btn-toggle-complete" onClick={toggle}>
          {completed ? 'Undo' : 'Complete'}
        </button>
        <button className="btn-delete-task" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
