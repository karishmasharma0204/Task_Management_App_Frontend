import React, { useState, useContext, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "../styles/TaskBoard.css";
import taskImg from "../assets/taskImg.png";
import { AppContext } from "../context/AppContext";
import { getTasks, updateTask, createTask, deleteTask } from "../services/task";
import downArrow from "../assets/downArrow.png";
import upArrow from "../assets/upArrow.png";
import menu from "../assets/menu.png";
import deleteButton from "../assets/Delete.png";
import blue_circle from "../assets/blue_circle.png";
import red_circle from "../assets/red_circle.png";
import green_circle from "../assets/green_circle.png";
import toast from "react-hot-toast";
import "../styles/TaskModal.css";
import { verifyToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const TaskBoard = () => {
  //states for tasks
  const { id } = useParams();
  //for authenticated user
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { state, setState } = useContext(AppContext);
  const [menuTaskId, setMenuTaskId] = useState(null);
  const menuRef = useRef(null); // Ref to access the popup menu
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
    useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [priorities, setPriorities] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assign, setAssign] = useState("");
  const [taskData, setTaskData] = useState({
    title: "",
    priority: "",
    assign: "",
    checklist: [],
    dueDate: ""
  });
  const [newTask, setNewTask] = useState({
    title: "",
    assign: "",
    checklist: [
      {
        item: { type: String, required: true },
        completed: { type: Boolean, default: false }
      }
    ],
    priority: ""
  });

  const [showEditTaskBar, setShowEditTaskBar] = useState(false);
  const [editState, setEditState] = useState([
    {
      title: "",
      category: "To-do",
      priority: "",
      assign: "",
      checklist: [
        {
          text: null,
          completed: null
        }
      ],
      dueDate: ""
    }
  ]);
  const [editTaskId, setEditTaskId] = useState("");

  //states for calendar
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  // To track which checklist is open
  const [checklistTaskId, setChecklistTaskId] = useState(null);

  // Modify toggleChecklist to set the specific task's ID
  const toggleChecklist = (taskId) => {
    setChecklistTaskId(checklistTaskId === taskId ? null : taskId);
  };

  // Modify toggleMenu to set the specific task's ID
  const toggleMenu = (taskId) => {
    setMenuTaskId(menuTaskId === taskId ? null : taskId);
  };

  // Handle clicks outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuTaskId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //fetch the data from the database
  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      if (response.status === 200) {
        setTasks(response.data);
        setState(response.data);
      } else {
        console.error("Error fetching tasks:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [id]);

  //fetch user, only authenticated user can delete the tasks (To verify user)
  const fetchUser = async () => {
    const response = await verifyToken();
    if (response.status === 200) {
      setUser(response.data);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  //To delete the task
  const handleDelete = async (taskId) => {
    try {
      console.log("Deleting task with ID:", taskId);
      const response = await deleteTask(taskId);
      console.log("Delete response:", response);

      if (response.status === 200) {
        toast.success("Task deleted successfully");
        fetchTasks();
        // Close the modal after deletion
        setIsDeleteConfirmationVisible(false);
      } else {
        toast.error(
          response.message || "An error occurred while deleting the task"
        );
      }
    } catch (error) {
      toast.error("Task deletion failed");
      console.error("Error details:", error);
    }
  };

  //To update category on click
  const handleUpdateCategory = async (id, newCategory) => {
    try {
      const response = await updateTask(id, { category: newCategory });

      if (response.status === 200) {
        toast.success("Task updated successfully");
        console.log("Updated task:", response.data);
        await fetchTasks();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Task update failed");
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setMenuTaskId(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowEditTaskBar(false);
    setNewTask({ title: "", assign: "", checklist: [], priority: "Low" });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";
    return `${month} ${day}${suffix}`;
  };

  // To Filter all the tasks by category
  const backlogTasks = state.filter((task) => task.category === "Backlog");
  const todoTasks = state.filter((task) => task.category === "To-do");
  const inProgressTasks = state.filter(
    (task) => task.category === "In Progress"
  );
  const doneTasks = state.filter((task) => task.category === "Done");

  //Functions for task modal

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    setShowCalendar(false);
    setTaskData((prevTaskData) => ({
      ...prevTaskData,
      dueDate: newDate
    }));
  };

  const formatDateTaskModal = (date) => {
    if (!date) return "Select Due Date";
    const options = { month: "2-digit", day: "2-digit", year: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    if (
      name === "highpriority" ||
      name === "moderatepriority" ||
      name === "lowpriority"
    ) {
      setTaskData({
        ...taskData,
        priority: value
      });
    } else if (name === "title") {
      setTaskData({
        ...taskData,
        title: value
      });
      console.log(name);
    } else if (name === "dueDate") {
      setTaskData({
        ...taskData,
        dueDate: new Date(value)
      });
      console.log(dueDate);
    } else if (name === "assign") {
      setTaskData({
        ...taskData,
        assign: value
      });
      console.log(assign);
    }

    console.log(value);
  };

  console.log(taskData);

  //Create card in database (save cards)
  const handleSaveCard = async (e) => {
    e.preventDefault();
    const data = { ...taskData };
    console.log("Data being sent:", data);
    console.log("Checklist before sending:", taskData.checklist);

    if (
      !taskData.title ||
      !taskData.priority ||
      taskData.checklist.length === 0
    ) {
      alert("Please fill in all required fields");
      return;
    }
    // Check for empty checklist items
    if (taskData.checklist.some((item) => item.text.trim() === "")) {
      alert("Please fill in all checklist items");
      return;
    }
    try {
      const response = await createTask({ data });
      console.log("Response from server:", response);

      if (response.status === 200) {
        toast.success("Task created successfully");
        setTaskData({
          title: "",
          priority: "",
          assign: "",
          checklist: [{ text: "", completed: false }],
          dueDate: ""
        });

        fetchTasks();
        setIsModalOpen(false);
      } else {
        toast.error("Task creation failed");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //code for checklist
  // Handle checklist change for each item
  const handleChecklistChange = (index, value) => {
    const updatedChecklist = [...taskData.checklist];
    updatedChecklist[index] = { ...updatedChecklist[index], text: value };
    setTaskData((prevTaskData) => ({
      ...prevTaskData,
      checklist: updatedChecklist
    }));
  };

  // Handle checklist completion toggle
  const handleChecklistCompletionChange = (index) => {
    const updatedChecklist = taskData.checklist.map((item, id) =>
      id === index ? { ...item, completed: !item.completed } : item
    );
    setTaskData({
      ...taskData,
      checklist: updatedChecklist
    });
  };

  // Add new checklist item
  const handleAddChecklistItem = () => {
    setTaskData({
      ...taskData,
      checklist: [...taskData.checklist, { text: "", completed: false }]
    });
  };

  // // Delete checklist item
  const handleDeleteChecklistItem = (index) => {
    const updatedChecklist = taskData.checklist.filter(
      (_, idx) => idx !== index
    );
    setTaskData({
      ...taskData,
      checklist: updatedChecklist
    });
  };

  //For edit the checklists

  const handleEditChecklistChange = (index, value) => {
    const updatedChecklist = [...editState.checklist];
    updatedChecklist[index].text = value;
    setEditState((prevState) => ({
      ...prevState,
      checklist: updatedChecklist
    }));
  };

  const handleEditChecklistCompletionChange = (event, index) => {
    const updatedChecklist = [...editState.checklist];
    updatedChecklist[index].completed = !updatedChecklist[index].completed;
    setEditState((prevState) => ({
      ...prevState,
      checklist: updatedChecklist
    }));
  };

  const handleAddEditChecklistItem = () => {
    const newItem = { text: "", completed: false };
    setEditState((prevState) => ({
      ...prevState,
      checklist: [...prevState.checklist, newItem]
    }));
  };

  const handleDeleteEditChecklistItem = (index) => {
    const updatedChecklist = [...editState.checklist];
    updatedChecklist.splice(index, 1);
    setEditState((prevState) => ({
      ...prevState,
      checklist: updatedChecklist
    }));
  };

  //For edit the tasks
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditState((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Priority
  const handleEditPriorityChange = (value) => {
    setEditState((prevData) => ({
      ...prevData,
      priority: value
    }));
  };

  // Date
  const handleEditDate = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    setEditState((prev) => ({ ...prev, dueDate: newDate }));
    setShowCalendar(false);
  };

  const handleEdit = async (id) => {
    console.log("id", id);
    setShowEditTaskBar(true);
    setMenuTaskId(false);
    setEditTaskId(id);
    console.log("id", editTaskId);
    try {
      const response = await getTasks(id);
      if (response.status === 200) {
        setEditState(response.data);
        console.log("editState", editState);
        setEditTaskId(id);
      } else {
        console.error("Error fetching tasks:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdateEditedTask = async (e) => {
    e.preventDefault();
    const data = { ...editState };
    console.log("data", data);
    try {
      const response = await updateTask(editTaskId, data);
      if (response.status === 200) {
        toast.success("Task Edited Successfully");
        fetchTasks();
        setShowEditTaskBar(false);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Task Edit failed");
    }
  };

  const navigate = useNavigate();

  //sharing data for public view
  const handleShare = async (taskId) => {
    console.log("Sharing task with ID:", taskId);
    try {
      const response = await getTasks(taskId);
      if (response.status === 200) {
        const taskData = response.data;
        setState({ sharedTask: taskData }); // Set the shared task in the global state or use a specific state if required
        navigate("/dashboard");
        console.log("navigating to another board");
      } else {
        console.error("Error fetching task for sharing:", response.status);
      }
    } catch (error) {
      console.error("Error while sharing:", error);
    }
  };

  return (
    <>
      <div className="taskboard-board">
        {/* Backlog Column */}
        <div className="board-column backlog">
          <h3>Backlog</h3>
          <img src={taskImg} alt="Backlog" className="corner-icon" />

          {backlogTasks.map((task) => (
            <div key={task._id} className="task-card">
              {/* Priority and User Avatar Section */}
              <div className="header-row">
                <div className="priority-section">
                  <div className="priority">
                    <img
                      src={
                        task.priority === "high"
                          ? red_circle
                          : task.priority === "moderate"
                          ? blue_circle
                          : green_circle
                      }
                      alt={`${task.priority} priority`}
                      className="priority-icon"
                    />
                    <span className="priority-label">
                      {task.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                </div>
                {/* User Badge Section */}
                <span className="user-badge">
                  {task.assign ? task.assign[0].toUpperCase() : "?"}
                </span>

                {/* Menu Icon */}
                <div className="menu-icon" onClick={() => toggleMenu(task._id)}>
                  <img src={menu} alt="menu icon" />
                </div>
              </div>

              {/* Show menu only for the task with the matching ID */}
              {menuTaskId === task._id && (
                <div className="popup-menu " ref={menuRef}>
                  {user && user.id === task.creator && (
                    <>
                      <button onClick={() => handleEdit(task._id)}>Edit</button>
                      <button onClick={() => handleShare(task._id)}>
                        Share
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => {
                          setTaskToDelete(task._id);
                          setIsDeleteConfirmationVisible(true);
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Task Title */}
              <h3 className="data-title">{task.title}</h3>

              {/* Checklist Section */}
              <div className="checklist">
                <div className="checklist-header">
                  <p>
                    Checklist (
                    {task.checklist.filter((item) => item.completed).length}/
                    {task.checklist.length})
                  </p>
                  <img
                    src={checklistTaskId === task._id ? upArrow : downArrow}
                    alt="toggle checklist"
                    onClick={() => toggleChecklist(task._id)}
                    className="arrow-icon"
                  />
                </div>

                {checklistTaskId === task._id && (
                  <div className="checklist-items">
                    {task.checklist.map((item, index) => (
                      <div key={index} className="checklist-item">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          className="checkbox"
                          readOnly
                        />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="action-buttons">
                <span
                  className={`due-date ${
                    task.status === "done"
                      ? "done-due-date"
                      : new Date(task.dueDate) < new Date()
                      ? "overdue-due-date"
                      : "upcoming-due-date"
                  }`}
                >
                  {formatDate(task.dueDate)}
                </span>
                <div className="status-buttons">
                  {/* Conditionally render the Backlog button */}
                  {task.category !== "Backlog" && (
                    <button
                      onClick={() => handleUpdateCategory(task._id, "Backlog")}
                    >
                      BACKLOG
                    </button>
                  )}

                  <button
                    onClick={() =>
                      handleUpdateCategory(task._id, "In Progress")
                    }
                  >
                    PROGRESS
                  </button>

                  <button
                    onClick={() => handleUpdateCategory(task._id, "Done")}
                  >
                    DONE
                  </button>

                  <button
                    onClick={() => handleUpdateCategory(task._id, "To-do")}
                  >
                    TO DO
                  </button>
                </div>
              </div>

              {/* Delete Confirmation Popup */}
              {isDeleteConfirmationVisible && (
                <div className="confirmation-popup">
                  <div className="popup-content">
                    <h4>Are you sure you want to Delete?</h4>
                    <div className="popup-buttons">
                      <button
                        className="confirm-button"
                        onClick={() => handleDelete(taskToDelete)}
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setIsDeleteConfirmationVisible(false)}
                        className="cancel-button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* To-do Column */}
        <div className="board-column todo">
          <h3>To do</h3>
          <button className="plus-icon" onClick={openModal}>
            +
          </button>
          <img src={taskImg} alt="To do" className="corner-icon" />
          {todoTasks.map((task) => (
            //To create assigned card in to do state

            <div key={task._id} className="task-card">
              {/* Priority and User Avatar Section */}
              <div className="header-row">
                <div className="priority-section">
                  <div className="priority">
                    <img
                      src={
                        task.priority === "high"
                          ? red_circle
                          : task.priority === "moderate"
                          ? blue_circle
                          : green_circle
                      }
                      alt={`${task.priority} priority`}
                      className="priority-icon"
                    />
                    <span className="priority-label">
                      {task.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                </div>
                {/* User Badge Section */}
                <span className="user-badge">
                  {task.assign ? task.assign[0].toUpperCase() : "?"}
                </span>

                {/* Menu Icon */}
                <div className="menu-icon" onClick={() => toggleMenu(task._id)}>
                  <img src={menu} alt="menu icon" />
                </div>
              </div>
              {/* Show menu only for the task with the matching ID */}
              {menuTaskId === task._id && (
                <div className="popup-menu" ref={menuRef}>
                  {user && user.id === task.creator && (
                    <>
                      <button onClick={() => handleEdit(task._id)}>Edit</button>
                      <button onClick={() => handleShare(task._id)}>
                        Share
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => {
                          setTaskToDelete(task._id);
                          setIsDeleteConfirmationVisible(true);
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Task Title */}
              <h3 className="data-title">{task.title}</h3>

              {/* Checklist Section */}
              <div className="checklist">
                <div className="checklist-header">
                  <p>
                    Checklist (
                    {task.checklist.filter((item) => item.completed).length}/
                    {task.checklist.length})
                  </p>
                  <img
                    src={checklistTaskId === task._id ? upArrow : downArrow}
                    alt="toggle checklist"
                    onClick={() => toggleChecklist(task._id)}
                    className="arrow-icon"
                  />
                </div>

                {checklistTaskId === task._id && (
                  <div className="checklist-items">
                    {task.checklist.map((item, index) => (
                      <div key={index} className="checklist-item">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          className="checkbox"
                          readOnly
                        />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="action-buttons">
                <span
                  className={`due-date ${
                    task.status === "done"
                      ? "done-due-date"
                      : new Date(task.dueDate) < new Date()
                      ? "overdue-due-date"
                      : "upcoming-due-date"
                  }`}
                >
                  {formatDate(task.dueDate)}
                </span>
                <div className="status-buttons">
                  <button
                    onClick={() => handleUpdateCategory(task._id, "Backlog")}
                  >
                    BACKLOG
                  </button>

                  <button
                    onClick={() =>
                      handleUpdateCategory(task._id, "In Progress")
                    }
                  >
                    PROGRESS
                  </button>
                  <button
                    onClick={() => handleUpdateCategory(task._id, "Done")}
                  >
                    DONE
                  </button>
                  {/* Conditionally render the To-do button */}
                  {task.category !== "To-do" && (
                    <button
                      onClick={() => handleUpdateCategory(task._id, "To-do")}
                    >
                      TO DO
                    </button>
                  )}
                </div>
              </div>

              {/* Delete Confirmation Popup */}
              {isDeleteConfirmationVisible && (
                <div className="confirmation-popup">
                  <div className="popup-content">
                    <h4>Are you sure you want to Delete?</h4>
                    <div className="popup-buttons">
                      <button
                        className="confirm-button"
                        onClick={() => handleDelete(taskToDelete)}
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setIsDeleteConfirmationVisible(false)}
                        className="cancel-button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* In-progress Column */}
        <div className="board-column in-progress">
          <h3>In Progress</h3>
          <img src={taskImg} alt="In Progress" className="corner-icon" />
          {inProgressTasks.map((task) => (
            //To create assigned card in progress state

            <div key={task._id} className="task-card">
              {/* Priority and User Avatar Section */}
              <div className="header-row">
                <div className="priority-section">
                  <div classname="priority">
                    <img
                      src={
                        task.priority === "high"
                          ? red_circle
                          : task.priority === "moderate"
                          ? blue_circle
                          : green_circle
                      }
                      alt={`${task.priority} priority`}
                      className="priority-icon"
                    />
                    <span className="priority-label">
                      {task.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                </div>
                {/* User Badge Section */}
                <span className="user-badge">
                  {task.assign ? task.assign[0].toUpperCase() : "?"}
                </span>

                {/* Menu Icon */}
                <div className="menu-icon" onClick={() => toggleMenu(task._id)}>
                  <img src={menu} alt="menu icon" />
                </div>
              </div>
              {/* Show menu only for the task with the matching ID */}
              {menuTaskId === task._id && (
                <div className="popup-menu" ref={menuRef}>
                  {user && user.id === task.creator && (
                    <>
                      <button onClick={() => handleEdit(task._id)}>Edit</button>
                      <button onClick={() => handleShare(task._id)}>
                        Share
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => {
                          setTaskToDelete(task._id);
                          setIsDeleteConfirmationVisible(true);
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Task Title */}
              <h3 className="data-title">{task.title}</h3>

              {/* Checklist Section */}
              <div className="checklist">
                <div className="checklist-header">
                  <p>
                    Checklist (
                    {task.checklist.filter((item) => item.completed).length}/
                    {task.checklist.length})
                  </p>
                  <img
                    src={checklistTaskId === task._id ? upArrow : downArrow}
                    alt="toggle checklist"
                    onClick={() => toggleChecklist(task._id)}
                    className="arrow-icon"
                  />
                </div>

                {checklistTaskId === task._id && (
                  <div className="checklist-items">
                    {task.checklist.map((item, index) => (
                      <div key={index} className="checklist-item">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          className="checkbox"
                          readOnly
                        />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="action-buttons">
                <span
                  className={`due-date ${
                    task.status === "done"
                      ? "done-due-date"
                      : new Date(task.dueDate) < new Date()
                      ? "overdue-due-date"
                      : "upcoming-due-date"
                  }`}
                >
                  {formatDate(task.dueDate)}
                </span>
                <div className="status-buttons">
                  <button
                    onClick={() => handleUpdateCategory(task._id, "Backlog")}
                  >
                    BACKLOG
                  </button>
                  {/* Conditionally render the In Progress button */}
                  {task.category !== "In Progress" && (
                    <button
                      onClick={() =>
                        handleUpdateCategory(task._id, "In Progress")
                      }
                    >
                      PROGRESS
                    </button>
                  )}

                  <button
                    onClick={() => handleUpdateCategory(task._id, "Done")}
                  >
                    DONE
                  </button>

                  <button
                    onClick={() => handleUpdateCategory(task._id, "To-do")}
                  >
                    TO DO
                  </button>
                </div>
              </div>

              {/* Delete Confirmation Popup */}
              {isDeleteConfirmationVisible && (
                <div className="confirmation-popup">
                  <div className="popup-content">
                    <h4>Are you sure you want to Delete?</h4>
                    <div className="popup-buttons">
                      <button
                        className="confirm-button"
                        onClick={() => handleDelete(taskToDelete)}
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setIsDeleteConfirmationVisible(false)}
                        className="cancel-button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Done Column */}
        <div className="board-column done">
          <h3>Done</h3>
          <img src={taskImg} alt="Done" className="corner-icon" />
          {doneTasks.map((task) => (
            //To create assigned card in done state
            <div key={task._id} className="task-card">
              {/* Priority and User Avatar Section */}
              <div className="header-row">
                <div className="priority-section">
                  <div className="priority">
                    <img
                      src={
                        task.priority === "high"
                          ? red_circle
                          : task.priority === "moderate"
                          ? blue_circle
                          : green_circle
                      }
                      alt={`${task.priority} priority`}
                      className="priority-icon"
                    />
                    <span className="priority-label">
                      {task.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                </div>
                {/* User Badge Section */}
                <span className="user-badge">
                  {task.assign ? task.assign[0].toUpperCase() : "?"}
                </span>

                {/* Menu Icon */}
                <div className="menu-icon" onClick={() => toggleMenu(task._id)}>
                  <img src={menu} alt="menu icon" />
                </div>
              </div>
              {/* Show menu only for the task  */}
              {menuTaskId === task._id && (
                <div className="popup-menu" ref={menuRef}>
                  {user && user.id === task.creator && (
                    <>
                      <button onClick={() => handleEdit(task._id)}>Edit</button>
                      <button onClick={() => handleShare(task._id)}>
                        Share
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => {
                          setTaskToDelete(task._id);
                          setIsDeleteConfirmationVisible(true);
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Task Title */}
              <h3 className="data-title">{task.title}</h3>

              {/* Checklist Section */}
              <div className="checklist">
                <div className="checklist-header">
                  <p>
                    Checklist (
                    {task.checklist.filter((item) => item.completed).length}/
                    {task.checklist.length})
                  </p>
                  <img
                    src={checklistTaskId === task._id ? upArrow : downArrow}
                    alt="toggle checklist"
                    onClick={() => toggleChecklist(task._id)}
                    className="arrow-icon"
                  />
                </div>

                {checklistTaskId === task._id && (
                  <div className="checklist-items">
                    {task.checklist.map((item, index) => (
                      <div key={index} className="checklist-item">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          className="checkbox"
                          readOnly
                        />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="action-buttons">
                <span
                  className={`due-date ${
                    task.status === "done"
                      ? "done-due-date"
                      : new Date(task.dueDate) < new Date()
                      ? "overdue-due-date"
                      : "upcoming-due-date"
                  }`}
                >
                  {formatDate(task.dueDate)}
                </span>
                <div className="status-buttons">
                  <button
                    onClick={() => handleUpdateCategory(task._id, "Backlog")}
                  >
                    BACKLOG
                  </button>

                  <button
                    onClick={() =>
                      handleUpdateCategory(task._id, "In Progress")
                    }
                  >
                    PROGRESS
                  </button>
                  {/* Conditionally render the Done button */}
                  {task.category !== "Done" && (
                    <button
                      onClick={() => handleUpdateCategory(task._id, "Done")}
                    >
                      DONE
                    </button>
                  )}
                  <button
                    onClick={() => handleUpdateCategory(task._id, "To-do")}
                  >
                    TO DO
                  </button>
                </div>
              </div>

              {/* Delete Confirmation Popup */}
              {isDeleteConfirmationVisible && (
                <div className="confirmation-popup">
                  <div className="popup-content">
                    <h4>Are you sure you want to Delete?</h4>
                    <div className="popup-buttons">
                      <button
                        className="confirm-button"
                        onClick={() => handleDelete(taskToDelete)}
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setIsDeleteConfirmationVisible(false)}
                        className="cancel-button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Task Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="task-modal">
              <form onSubmit={handleSaveCard}>
                {/* Title Input */}
                <div className="form-group">
                  <label htmlFor="title">
                    Title <span className="asterisk">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={taskData.title}
                    onChange={handleOnChange}
                    placeholder="Enter Task Title"
                    required
                  />
                </div>

                {/* Priority Selection */}
                <div className="priority-selector">
                  <label className="priority-label">
                    Select Priority <span className="asterisk">*</span>
                  </label>
                  <div className="priority-options">
                    <button
                      type="button"
                      value="high"
                      name="highpriority"
                      className={`priority-button high ${
                        priorities === "high" ? "active" : ""
                      }`}
                      onClick={handleOnChange}
                    >
                      <span className="dot high-dot"></span> HIGH PRIORITY
                    </button>
                    <button
                      type="button"
                      name="moderatepriority"
                      value="moderate"
                      className={`priority-button moderate ${
                        priorities === "moderate" ? "active" : ""
                      }`}
                      onClick={handleOnChange}
                    >
                      <span className="dot moderate-dot"></span> MODERATE
                      PRIORITY
                    </button>
                    <button
                      type="button"
                      name="lowpriority"
                      value="low"
                      className={`priority-button low ${
                        priorities === "low" ? "active" : ""
                      }`}
                      onClick={handleOnChange}
                    >
                      <span className="dot low-dot"></span> LOW PRIORITY
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  {/* Assignee Field */}
                  {taskData.checklist.length > 0 && (
                    <div>
                      <label className="assignee">
                        Assignee
                        <input
                          type="text"
                          name="assign"
                          value={taskData.assign}
                          className="assignee-input"
                          onChange={handleOnChange}
                          placeholder="Add Assignee"
                        />
                      </label>
                    </div>
                  )}

                  <label>
                    Checklist (
                    {taskData.checklist.filter((item) => item.completed).length}
                    /{taskData.checklist.length}){" "}
                    <span className="asterisk">*</span>
                  </label>

                  {/* Checklist items */}
                  {taskData.checklist.map((item, index) => (
                    <div key={index} className="checklist-item">
                      <input
                        type="checkbox"
                        name="checklist"
                        checked={item.completed}
                        onChange={() => handleChecklistCompletionChange(index)}
                      />
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) =>
                          handleChecklistChange(index, e.target.value)
                        }
                        placeholder="Add Checklist Item"
                      />
                      <img
                        src={deleteButton}
                        alt="Delete"
                        className="delete-icon"
                        onClick={() => handleDeleteChecklistItem(index)}
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    className="add-checklist"
                    onClick={handleAddChecklistItem}
                  >
                    + Add New
                  </button>
                </div>

                {/* Footer Buttons */}
                <div className="modal-footer">
                  <button
                    type="button"
                    name="dueDate"
                    className="select-due-date"
                    onClick={toggleCalendar}
                  >
                    {formatDateTaskModal(selectedDate)}
                  </button>

                  {/* Show the calendar  */}
                  {showCalendar && (
                    <div className="calendar-popup">
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="date-input"
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="save-btn"
                    onClick={handleSaveCard}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Task  */}
        {showEditTaskBar && (
          <div className="modal-overlay">
            <div className="task-modal">
              <form onSubmit={handleUpdateEditedTask}>
                {/* Title Input */}
                <div className="form-group">
                  <label htmlFor="title">
                    Title <span className="asterisk">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={editState.title}
                    onChange={handleEditChange}
                    placeholder={editState.title}
                    required
                  />
                </div>

                {/* Priority Selection */}
                <div className="priority-selector">
                  <label className="priority-label">
                    Select Priority <span className="asterisk">*</span>
                  </label>
                  <div className="priority-options">
                    <button
                      className="priority-button"
                      type="button"
                      onClick={() => handleEditPriorityChange("high")}
                    >
                      <img
                        src={red_circle}
                        alt="high priority"
                        classname="redcircle"
                      />{" "}
                      HIGH PRIORITY
                    </button>

                    <button
                      className="priority-button"
                      type="button"
                      onClick={() => handleEditPriorityChange("moderate")}
                    >
                      <img
                        src={blue_circle}
                        alt="moderate priority"
                        classname="bluecircle"
                      />{" "}
                      MODERATE PRIORITY
                    </button>

                    <button
                      className="priority-button"
                      type="button"
                      onClick={() => handleEditPriorityChange("low")}
                    >
                      <img
                        src={green_circle}
                        alt="low priority"
                        classname="greencircle"
                      />{" "}
                      LOW PRIORITY
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  {/* Assignee Field */}

                  <div>
                    <label className="assignee">
                      Assignee
                      <input
                        type="text"
                        name="assign"
                        value={editState.assign}
                        className="assignee-input"
                        onChange={handleEditChange}
                        placeholder="Add Assignee"
                      />
                    </label>
                  </div>

                  <label>
                    Checklist (
                    {taskData.checklist.filter((item) => item.completed).length}
                    /{taskData.checklist.length}){" "}
                    <span className="asterisk">*</span>
                  </label>

                  {/* Checklist items */}
                  {(editState.checklist || []).map((item, index) => (
                    <div key={index} className="checklist-item">
                      <input
                        type="checkbox"
                        name="checklist"
                        checked={item.completed}
                        onChange={() =>
                          handleEditChecklistCompletionChange(null, index)
                        }
                      />
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) =>
                          handleEditChecklistChange(index, e.target.value)
                        }
                        placeholder="Add Checklist Item"
                      />
                      <img
                        src={deleteButton}
                        alt="Delete"
                        className="delete-icon"
                        onClick={() => handleDeleteEditChecklistItem(index)}
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    className="add-checklist"
                    onClick={handleAddEditChecklistItem}
                  >
                    + Add New
                  </button>
                </div>

                {/* Footer Buttons */}
                <div className="modal-footer">
                  <button
                    type="button"
                    name="dueDate"
                    value={editState.dueDate}
                    className="select-due-date"
                    onClick={toggleCalendar}
                  >
                    {formatDateTaskModal(selectedDate)}
                  </button>

                  {/* Show the calendar  */}
                  {showCalendar && (
                    <div className="calendar-popup">
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={handleEditDate}
                        className="date-input"
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TaskBoard;
