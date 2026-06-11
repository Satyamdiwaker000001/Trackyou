import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays 
} from 'date-fns';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './CalendarView.css';

const CalendarView = ({ tasks, onEditTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const renderHeader = () => {
    return (
      <div className="calendar-header">
        <div className="flex items-center gap-4">
          <h2>{format(currentDate, 'MMMM yyyy')}</h2>
          <button onClick={goToToday} className="px-3 py-1.5 text-xs font-bold rounded-md bg-surface-elevated border border-border hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors">
            Today
          </button>
        </div>
        <div className="calendar-nav-buttons">
          <button onClick={prevMonth} className="btn-cal-nav" aria-label="Previous Month">
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextMonth} className="btn-cal-nav" aria-label="Next Month">
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "EEE";
    const days = [];
    let startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="cal-day-name" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="calendar-days-header">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        
        // Find tasks for this day
        const dayTasks = tasks.filter(task => {
          if (!task.deadline) return false;
          return isSameDay(new Date(task.deadline), cloneDay);
        });

        // Sort tasks: high priority first, then incomplete first
        dayTasks.sort((a, b) => {
          if (a.completed !== b.completed) return a.completed ? 1 : -1;
          const pOrder = { high: 0, medium: 1, low: 2 };
          return (pOrder[a.priority] || 1) - (pOrder[b.priority] || 1);
        });

        days.push(
          <div
            className={`cal-cell ${!isSameMonth(day, monthStart) ? "not-current-month" : ""} ${isSameDay(day, new Date()) ? "is-today" : ""}`}
            key={day}
          >
            <div className="cal-cell-header">
              <span className="cal-date-number">{formattedDate}</span>
            </div>
            <div className="cal-tasks-list scrollbar-thin overflow-y-auto max-h-[80px]">
              {dayTasks.map(task => (
                <div 
                  key={task._id} 
                  className={`cal-task-item ${task.completed ? 'completed' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onEditTask) onEditTask(task);
                  }}
                  title={task.title}
                >
                  <span className={`cal-task-dot dot-${task.priority || 'medium'}`}></span>
                  {task.title}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        days
      );
      days = [];
    }
    return <div className="calendar-cells">{rows}</div>;
  };

  return (
    <section className="calendar-container animate-fade-in">
      {renderHeader()}
      <div className="calendar-grid">
        {renderDays()}
        {renderCells()}
      </div>
    </section>
  );
};

export default CalendarView;
