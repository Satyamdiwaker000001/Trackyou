import { useEffect, useState } from 'react';
import TaskCard from '../components/TaskCard';
import './Dashboard.css';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  // Placeholder fetch – replace with actual API call later
  useEffect(() => {
    // Example static data for now
    setTasks([
      { _id: '1', title: 'Sample Task 1', description: 'Demo description', deadline: new Date(), completed: false },
      { _id: '2', title: 'Sample Task 2', description: 'Another demo', deadline: new Date(), completed: true },
    ]);
  }, []);

  return (
    <section className="dashboard">
      <h2 className="glass">Your Tasks</h2>
      <div className="task-grid glass">
        {tasks.map(task => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </section>
  );
}
