
import { useState, useEffect } from "react";

function BatchModuleAssignment() {

    const BATCH_API = "https://localhost:7147/api/Batch";
    const MODULE_API = "https://localhost:7147/api/Module";

    const [batches, setBatches] = useState([]);
    const [modules, setModules] = useState([]);

    const [selectedBatch, setSelectedBatch] = useState("");
    const [selectedModules, setSelectedModules] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function fetchData() {
        try {
            setLoading(true);
            setError("");

            const [batchResponse, moduleResponse] = await Promise.all([
                fetch(BATCH_API),
                fetch(MODULE_API)
            ]);

            if (!batchResponse.ok || !moduleResponse.ok) {
                throw new Error("Failed to fetch data");
            }

            const batchData = await batchResponse.json();
            const moduleData = await moduleResponse.json();

            setBatches(batchData);
            setModules(moduleData);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <h2>Batch Module Assignment</h2>

            {loading && <p>Loading data...</p>}

            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && (
                <div>
                    <div>
                        <label>Select Batch</label>

                        <select
                            value={selectedBatch}
                            onChange={(e) => {
                                setSelectedBatch(e.target.value);
                                setSelectedModules([]);
                            }}
                        >
                            <option value="">-- Select Batch --</option>

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

                    {selectedBatch && (
                        <div>
                            <h3>Select Modules</h3>

                            {modules.map((module) => (
                                <div key={module.moduleId}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={selectedModules.includes(module.moduleId)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedModules([
                                                        ...selectedModules,
                                                        module.moduleId
                                                    ]);
                                                } else {
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

                    {selectedBatch && (
                        <p>
                            Selected Modules: {selectedModules.length}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default BatchModuleAssignment;
