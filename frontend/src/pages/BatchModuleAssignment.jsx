
import { useState, useEffect } from "react";

function BatchModuleAssignment() {

    // API URLs
    const BATCH_API = "https://localhost:7147/api/Batch";
    const MODULE_API = "https://localhost:7147/api/Module";
    const ASSIGNMENT_API = "https://localhost:7147/api/BatchModule";

    // State variables
    const [batches, setBatches] = useState([]);
    const [modules, setModules] = useState([]);

    const [selectedBatch, setSelectedBatch] = useState("");
    const [selectedModules, setSelectedModules] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Fetch batches and modules
    async function fetchData() {

        try {
            setLoading(true);
            setError("");

            const [batchResponse, moduleResponse] = await Promise.all([
                fetch(BATCH_API),
                fetch(MODULE_API)
            ]);

            if (!batchResponse.ok || !moduleResponse.ok) {
                throw new Error("Failed to fetch batches or modules.");
            }

            const batchData = await batchResponse.json();
            const moduleData = await moduleResponse.json();

            setBatches(batchData);
            setModules(moduleData);

        }
        catch (error) {
            setError(error.message);
        }
        finally {
            setLoading(false);
        }
    }

    // Assign selected modules to the selected batch
    async function handleAssignModules() {

        if (!selectedBatch) {
            setMessage("Please select a batch.");
            return;
        }

        if (selectedModules.length === 0) {
            setMessage("Please select at least one module.");
            return;
        }

        try {

            setMessage("");

            for (const moduleId of selectedModules) {

                const response = await fetch(
                    `${ASSIGNMENT_API}/assign`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            batchId: Number(selectedBatch),
                            moduleId: moduleId
                        })
                    }
                );

                if (!response.ok) {

                    const errorText = await response.text();

                    throw new Error(
                        errorText || "Module assignment failed."
                    );
                }
            }

            setMessage("Modules assigned successfully!");

            // Clear selected modules after successful assignment
            setSelectedModules([]);

        }
        catch (error) {
            setMessage(error.message);
        }
    }

    // Fetch data when component loads
    useEffect(() => {
        fetchData();
    }, []);

    return (

        <div>

            <h2>Batch Module Assignment</h2>

            {/* Loading message */}
            {loading && <p>Loading data...</p>}

            {/* Error message */}
            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            {!loading && !error && (

                <div>

                    {/* Batch dropdown */}
                    <div>

                        <label>Select Batch</label>

                        <select
                            value={selectedBatch}
                            onChange={(e) => {

                                setSelectedBatch(e.target.value);

                                // Clear previous module selections
                                setSelectedModules([]);

                                setMessage("");
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

                    {/* Module checkboxes */}
                    {selectedBatch && (

                        <div>

                            <h3>Select Modules</h3>

                            {modules.map((module) => (

                                <div key={module.moduleId}>

                                    <label>

                                        <input
                                            type="checkbox"

                                            checked={selectedModules.includes(
                                                module.moduleId
                                            )}

                                            onChange={(e) => {

                                                if (e.target.checked) {

                                                    setSelectedModules([
                                                        ...selectedModules,
                                                        module.moduleId
                                                    ]);

                                                }
                                                else {

                                                    setSelectedModules(
                                                        selectedModules.filter(
                                                            id => id !== module.moduleId
                                                        )
                                                    );

                                                }

                                            }}
                                        />

                                        {module.moduleName}

                                    </label>

                                </div>

                            ))}

                        </div>

                    )}

                    {/* Selected module count */}
                    {selectedBatch && (

                        <p>
                            Selected Modules: {selectedModules.length}
                        </p>

                    )}

                    {/* Assign button */}
                    <button
                        onClick={handleAssignModules}
                        disabled={
                            !selectedBatch ||
                            selectedModules.length === 0
                        }
                    >
                        Assign Modules
                    </button>

                    {/* Success or failure message */}
                    {message && (

                        <p>
                            {message}
                        </p>

                    )}

                </div>

            )}

        </div>

    );
}

export default BatchModuleAssignment;
