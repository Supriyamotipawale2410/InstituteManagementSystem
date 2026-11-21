
import { useState, useEffect } from "react";

function FacultyAllocation() {

    // API URLs
    const FACULTY_API = "https://localhost:7147/api/Faculty";
    const BATCH_API = "https://localhost:7147/api/Batch";
    const BATCH_MODULE_API = "https://localhost:7147/api/BatchModule";
    const FACULTY_ALLOCATION_API = "https://localhost:7147/api/FacultyBatchModule";

    // State variables
    const [faculties, setFaculties] = useState([]);
    const [batches, setBatches] = useState([]);
    const [modules, setModules] = useState([]);

    const [selectedFaculty, setSelectedFaculty] = useState("");
    const [selectedBatch, setSelectedBatch] = useState("");
    const [selectedModule, setSelectedModule] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [message, setMessage] = useState("");

    const [allocations, setAllocations] = useState([]);

    // Fetch faculty and batch data
    async function fetchData() {

        try {
            setLoading(true);
            setError("");

            const [facultyResponse, batchResponse] = await Promise.all([
                fetch(FACULTY_API),
                fetch(BATCH_API)
            ]);

            if (!facultyResponse.ok || !batchResponse.ok) {
                throw new Error("Failed to fetch faculty or batch data.");
            }

            const facultyData = await facultyResponse.json();
            const batchData = await batchResponse.json();

            setFaculties(facultyData);
            setBatches(batchData);

        }
        catch (error) {
            setError(error.message);
        }
        finally {
            setLoading(false);
        }
    }

    // Fetch modules assigned to selected batch
    async function fetchModules(batchId) {

        try {

            setModules([]);
            setSelectedModule("");
            setError("");

            const response = await fetch(
                `${BATCH_MODULE_API}/batch/${batchId}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch assigned modules.");
            }

            const data = await response.json();

            setModules(data);

        }
        catch (error) {
            setError(error.message);
        }
    }

    async function fetchAllocations(facultyId) {
        try {
            const response = await fetch(
                `${FACULTY_ALLOCATION_API}/faculty/${facultyId}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch faculty allocations.");
            }

            const data = await response.json();

            setAllocations(data);
        }
        catch (error) {
            setError(error.message);
        }
    }

    // Load data when page opens
    useEffect(() => {
        fetchData();
    }, []);

    async function handleAssign() {

        // Validate selections
        if (!selectedFaculty || !selectedBatch || !selectedModule) {
            setMessage("Please select faculty, batch and module.");
            return;
        }

        try {
            setMessage("");

            const response = await fetch(
                `${FACULTY_ALLOCATION_API}/assign`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        facultyId: Number(selectedFaculty),
                        batchId: Number(selectedBatch),
                        moduleId: Number(selectedModule)
                    })
                }
            );

            const responseText = await response.text();

            if (!response.ok) {
                throw new Error(responseText || "Failed to assign faculty.");
            }

            setMessage(responseText || "Faculty assigned successfully!");
            setSelectedModule("");

            setMessage("Faculty assigned successfully!");

            setSelectedModule("");
            await fetchAllocations(selectedFaculty);
        }
        catch (error) {
            setMessage(error.message);
        }
    }

    async function handleRemove(batchId, moduleId) {

    const confirmDelete = window.confirm(
        "Are you sure you want to remove this faculty allocation?"
    );

    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch(
            `${FACULTY_ALLOCATION_API}/remove/${selectedFaculty}/${batchId}/${moduleId}`,
            {
                method: "DELETE"
            }
        );

        const responseText = await response.text();

        if (!response.ok) {
            throw new Error(responseText || "Failed to remove allocation.");
        }

        setMessage("Faculty allocation removed successfully!");

        await fetchAllocations(selectedFaculty);
    }
    catch (error) {
        setMessage(error.message);
    }
}

    return (

        <div>

            <h2>Faculty Allocation</h2>

            {loading && <p>Loading data...</p>}

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            {!loading && !error && (

                <div>

                    {/* Faculty Dropdown */}
                    <div>

                        <label>Select Faculty</label>

                        <select
                            value={selectedFaculty}
                            onChange={(e) => {
                                const facultyId = e.target.value;

                                setSelectedFaculty(facultyId);
                                setAllocations([]);
                                setMessage("");

                                if (facultyId) {
                                    fetchAllocations(facultyId);
                                }
                            }}
                        >

                            <option value="">
                                -- Select Faculty --
                            </option>

                            {faculties.map((faculty) => (

                                <option
                                    key={faculty.facultyId}
                                    value={faculty.facultyId}
                                >
                                    {faculty.firstName} {faculty.lastName}
                                </option>

                            ))}

                        </select>

                    </div>

                    <br />

                    {/* Batch Dropdown */}
                    <div>

                        <label>Select Batch</label>

                        <select
                            value={selectedBatch}
                            onChange={(e) => {

                                const batchId = e.target.value;

                                setSelectedBatch(batchId);

                                if (batchId) {
                                    fetchModules(batchId);
                                }
                                else {
                                    setModules([]);
                                    setSelectedModule("");
                                }
                            }}
                        >

                            <option value="">
                                -- Select Batch --
                            </option>

                            {batches.map((batch) => (

                                <option
                                    key={batch.batchId}
                                    value={batch.batchId}
                                >
                                    {batch.batchName}
                                </option>

                            ))}

                        </select>

                    </div>

                    <br />

                    {/* Module Dropdown */}
                    {selectedBatch && (

                        <div>

                            <label>Select Module</label>

                            <select
                                value={selectedModule}
                                onChange={(e) => {
                                    setSelectedModule(e.target.value);
                                }}
                            >

                                <option value="">
                                    -- Select Module --
                                </option>

                                {modules.map((module) => (

                                    <option
                                        key={module.moduleId}
                                        value={module.moduleId}
                                    >
                                        {module.moduleName}
                                    </option>

                                ))}

                            </select>

                            {modules.length === 0 && (
                                <p>No modules are assigned to this batch.</p>
                            )}

                            {selectedFaculty && selectedBatch && selectedModule && (
                                <button onClick={handleAssign}>
                                    Assign Faculty
                                </button>
                            )}

                            {message && (
                                <p>{message}</p>
                            )}

                        </div>

                    )}

                </div>

            )}

            {allocations.length > 0 && (
                <div>
                    <h3>Existing Faculty Allocations</h3>

                    <table border="1" cellPadding="10">
                        <thead>
                            <tr>
                                <th>Batch</th>
                                <th>Module</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {allocations.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.batchName}</td>
                                    <td>{item.moduleName}</td>
                                    <td>
                <button
                    onClick={() =>
                        handleRemove(item.batchId, item.moduleId)
                    }
                >
                    Remove
                </button>
            </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>

    );
}

export default FacultyAllocation;
