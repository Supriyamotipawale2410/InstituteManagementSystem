
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./components/AdminLayout";

import StudentManagement from "./pages/StudentManagement";
import FacultyManagement from "./pages/FacultyManagement";
import BatchManagement from "./pages/BatchManagement";
import ModuleManagement from "./pages/ModuleManagement";
import BatchModuleAssignment from "./pages/BatchModuleAssignment";
import FacultyAllocation from "./pages/FacultyAllocation";

function Dashboard() {
    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome to IMS.</p>
            <p>Select a section from the sidebar to manage institute records.</p>
        </div>
    );
}

function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* Redirect home page to Admin Dashboard */}
                <Route
                    path="/"
                    element={<Navigate to="/admin" />}
                />

                {/* Admin Layout */}
                <Route path="/admin" element={<AdminLayout />}>

                    <Route index element={<Dashboard />} />

                    <Route
                        path="students"
                        element={<StudentManagement />}
                    />

                    <Route
                        path="faculty"
                        element={<FacultyManagement />}
                    />

                    <Route
                        path="batches"
                        element={<BatchManagement />}
                    />

                    <Route
                        path="modules"
                        element={<ModuleManagement />}
                    />

                    <Route
                        path="batch-modules"
                        element={<BatchModuleAssignment />}
                    />
                    <Route
                    path="faculty-allocation"
                    element={<FacultyAllocation />}
                />

                </Route>

                

            </Routes>

        </BrowserRouter>
    );
}

export default App;
