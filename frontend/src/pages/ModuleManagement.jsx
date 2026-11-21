
import { useState, useEffect } from "react";
import ModuleForm from "../components/ModuleForm";

function ModuleManagement() {

    const API_URL = "https://localhost:7147/api/Module";

    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [selectedModule, setSelectedModule] = useState(null);

    // Fetch all modules
    async function fetchModules() {

        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to fetch modules");
            }

            const data = await response.json();

            setModules(data);
        }
        catch (error) {
            setError(error.message);
        }
        finally {
            setLoading(false);
        }
    }

    // Load modules when component renders
    useEffect(() => {
        fetchModules();
    }, []);

    // Add module
    async function handleAddModule(moduleData) {

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(moduleData)
            });

            if (!response.ok) {
                throw new Error("Failed to add module");
            }

            alert("Module added successfully");

            setShowForm(false);

            fetchModules();
        }
        catch (error) {
            alert(error.message);
        }
    }

    // Select module for editing
    function handleEditModule(module) {

        setSelectedModule(module);
        setShowForm(true);
    }

    // Update module
    async function handleUpdateModule(moduleData) {

        try {
            const response = await fetch(
                `${API_URL}/${moduleData.moduleId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(moduleData)
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update module");
            }

            alert("Module updated successfully");

            setShowForm(false);
            setSelectedModule(null);

            fetchModules();
        }
        catch (error) {
            alert(error.message);
        }
    }

    // Delete module
    async function handleDeleteModule(moduleId) {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this module?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/${moduleId}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to delete module. It may be assigned to a batch."
                );
            }

            alert("Module deleted successfully");

            fetchModules();
        }
        catch (error) {
            alert(error.message);
        }
    }

    // Handle form submission
    function handleSaveModule(moduleData) {

        if (selectedModule) {
            handleUpdateModule(moduleData);
        }
        else {
            handleAddModule(moduleData);
        }
    }

    // Cancel form
    function handleCancel() {

        setShowForm(false);
        setSelectedModule(null);
    }

    return (
        <div>

            <h2>Module Management</h2>

            <button
                onClick={() => {
                    setSelectedModule(null);
                    setShowForm(true);
                }}
            >
                Add New Module
            </button>

            {showForm && (
                <ModuleForm
                    initialData={selectedModule}
                    onSave={handleSaveModule}
                    onCancel={handleCancel}
                />
            )}

            <hr />

            {loading && <p>Loading modules...</p>}

            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && (
                <table border="1" cellPadding="10">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Module Name</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {modules.length === 0 ? (
                            <tr>
                                <td colSpan="5">
                                    No modules available
                                </td>
                            </tr>
                        ) : (
                            modules.map((module) => (
                                <tr key={module.moduleId}>

                                    <td>{module.moduleId}</td>

                                    <td>{module.moduleName}</td>

                                    <td>{module.description}</td>

                                    <td>
                                        {module.isActive
                                            ? "Active"
                                            : "Inactive"}
                                    </td>

                                    <td>
                                        <button
                                            onClick={() =>
                                                handleEditModule(module)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDeleteModule(module.moduleId)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>

                                </tr>
                            ))
                        )}

                    </tbody>

                </table>
            )}

        </div>
    );
}

export default ModuleManagement;
