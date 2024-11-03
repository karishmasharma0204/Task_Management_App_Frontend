import { BACKEND_URL } from "../utils/constant";
import axios from "axios";

//To create the task
export const createTask = async ({ data }) => {
  const token = localStorage.getItem("token");
  console.log(token);

  try {
    const URL = `${BACKEND_URL}/task`;

    const response = await axios.post(URL, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      }
    });
    console.log(response.data);
    return response;
  } catch (error) {
    console.error("Error in createTask:", error);
    throw error;
  }
};

//To get the task
// export const getTasks = async () => {
//   try {
//     const URL = `${BACKEND_URL}/task`;
//     const response = await axios.get(URL);
//     return response;
//   } catch (error) {
//     return new Error(error.response.data.message);
//   }
// };
export const getTasks = async (id) => {
  try {
    const URL = id ? `${BACKEND_URL}/task/${id}` : ` ${BACKEND_URL}/task`;
    // const URL = ${BACKEND_URL}/task;
    const response = await axios.get(URL);
    return response;
  } catch (error) {
    return new Error(error.response.data.message);
  }
};

//To update the task
export const updateTask = async (id, newCategory) => {
  try {
    const URL = `${BACKEND_URL}/task/${id}`;
    const token = localStorage.getItem("token");
    const response = await axios.patch(URL, newCategory, {
      headers: {
        Authorization: token
      }
    });
    return response;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Error updating task"
    };
  }
};

//To delete a task
export const deleteTask = async (id) => {
  console.log(id);
  try {
    const URL = ` ${BACKEND_URL}/task/${id}`;
    const token = localStorage.getItem("token");
    const response = await axios.delete(URL, {
      headers: {
        Authorization: token
      }
    });
    console.log(response);
    return response;
  } catch (error) {
    return new Error(error.response.data.message);
  }
};
