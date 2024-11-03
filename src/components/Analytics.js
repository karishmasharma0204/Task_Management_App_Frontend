import React, { useEffect, useState } from "react";
import "../styles/Analytics.css";
import { getTasks } from "../services/task";

const Analytics = () => {
  const [tasks, setTasks] = useState([]);
  const [backlogCount, setBacklogCount] = useState(0);
  const [toDoCount, setToDoCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [lowPriorityCount, setLowPriorityCount] = useState(0);
  const [moderatePriorityCount, setModeratePriorityCount] = useState(0);
  const [highPriorityCount, setHighPriorityCount] = useState(0);
  const [dueDateCount, setDueDateCount] = useState(0);

  //Fetch the tasks from the database
  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      console.log("Fetched tasks:", response.data);

      if (response.status === 200) {
        const filteredTasks = response.data;
        setTasks(filteredTasks);
      } else {
        console.error("Error fetching tasks:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // to update counts for all categories based on tasks

  useEffect(() => {
    const backlog = tasks.filter((task) => task.category === "Backlog").length;
    console.log(backlog);
    const toDo = tasks.filter((task) => task.category === "To-do").length;
    const inProgress = tasks.filter(
      (task) => task.category === "In Progress"
    ).length;
    const completed = tasks.filter((task) => task.category === "Done").length;
    const lowPriority = tasks.filter((task) => task.priority === "low").length;
    const moderatePriority = tasks.filter(
      (task) => task.priority === "moderate"
    ).length;
    const highPriority = tasks.filter(
      (task) => task.priority === "high"
    ).length;
    const dueDate = tasks.filter((task) => task.dueDate !== null).length;

    setBacklogCount(backlog);
    setToDoCount(toDo);
    setInProgressCount(inProgress);
    setCompletedCount(completed);
    setLowPriorityCount(lowPriority);
    setModeratePriorityCount(moderatePriority);
    setHighPriorityCount(highPriority);
    setDueDateCount(dueDate);
  }, [tasks]);

  return (
    <>
      <h1 className="analytics-header">Analytics</h1>
      <div className="analytics-container">
        <div className="analytics-column">
          <ul className="analytics-ul">
            <li className="analytics-li">
              <span className="task-label">Backlog Tasks</span>
              <span className="task-count">{backlogCount}</span>
            </li>
            <li className="analytics-li">
              <span className="task-label">To-do Tasks</span>
              <span className="task-count">{toDoCount}</span>
            </li>
            <li className="analytics-li">
              <span className="task-label">In-Progress Tasks</span>
              <span className="task-count">{inProgressCount}</span>
            </li>
            <li className="analytics-li">
              <span className="task-label">Completed Tasks</span>
              <span className="task-count">{completedCount}</span>
            </li>
          </ul>
        </div>
        <div className="analytics-column" id="second">
          <ul className="analytics-ul">
            <li className="analytics-li">
              <span className="task-label">Low Priority</span>
              <span className="task-count">{lowPriorityCount}</span>
            </li>
            <li className="analytics-li">
              <span className="task-label">Moderate Priority</span>
              <span className="task-count">{moderatePriorityCount}</span>
            </li>
            <li className="analytics-li">
              <span className="task-label">High Priority</span>
              <span className="task-count">{highPriorityCount}</span>
            </li>
            <li className="analytics-li">
              <span className="task-label">Due Date Tasks</span>
              <span className="task-count">{dueDateCount}</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Analytics;
