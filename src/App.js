import { Routes, Route } from "react-router-dom";
import Register from "../src/components/RegisterPage";
import Login from "../src/components/LoginPage";
import { Toaster } from "react-hot-toast";
import Layout from "../src/components/Layout";
import Analytics from "../src/components/Analytics";
import Settings from "../src/components/Settings";
import TaskBoard from "../src/components/TaskBoard";
import { AppProvider } from "./context/AppContext";
import Dashboard from "./components/taskCardWithId";

function App() {
  return (
    <>
      <AppProvider>
        <Toaster />

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route path="/board" element={<Layout />}>
            <Route path="board" element={<TaskBoard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Routes>
      </AppProvider>
    </>
  );
}
export default App;
