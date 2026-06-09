import './TaskCard.css';
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

export default function TaskCard({ task }) {
  const { title, description, deadline, completed } = task;
  const toggle = () => {
    // Placeholder: actual update via API later
    console.log('Toggle task', task._id);
  };
  const deleteTask = () => {
    console.log('Delete task', task._id);
  };
  return (
    <div className={`task-card glass ${completed ? 'done' : ''}`}>
      <h3>{title}</h3>
      <p>{description}</p>
      <p className="deadline">Due {formatDistanceToNow(new Date(deadline), { addSuffix: true })}</p>
      <div className="actions">
        <button onClick={toggle}>{completed ? 'Undo' : 'Done'}</button>
        <button onClick={deleteTask}>✕</button>
      </div>
    </div>
  );
}
