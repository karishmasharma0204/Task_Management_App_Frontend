import { BACKEND_URL } from "../utils/constant";
import axios from "axios";
import toast from "react-hot-toast";

export const register = async ({ name, email, password }) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/auth/register`,
      {
        name,
        email,
        password
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    return response;
  } catch (error) {
    toast.error("User Already Exists!!!");

    return new Error(error.response.data.message);
  }
};

//To login user
export const login = async ({ name, email, password }) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/auth/login`,
      {
        name,
        email,
        password
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    return response;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

//To update password
// export const updatePassword = async ({
//   name,
//   email,
//   password,
//   newPassword
// }) => {
//   try {
//     console.log("Sending request with data:", {
//       name,
//       email,
//       password,
//       newPassword
//     });

//     const response = await axios.post(
//       `${BACKEND_URL}/auth/updatePassword`,
//       { name, email, password, newPassword },
//       {
//         headers: {
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     console.log("Response received:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Error in updatePassword:",
//       error.response?.data || error.message
//     );

//     // Throw a new error with a more user-friendly message
//     throw new Error(error.response?.data?.message || "Error updating password");
//   }
// };

//Update password
// Update password
export const updatePassword = async ({ email, oldPassword, newPassword }) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/auth/updatePassword`,
      {
        email,
        oldPassword,
        newPassword
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    toast.success("Password updated successfully!");
    return response;
  } catch (error) {
    toast.error("Failed to update password.");
    throw new Error(error.response.data.message);
  }
};
