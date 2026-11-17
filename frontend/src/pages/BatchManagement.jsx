
import { useState, useEffect } from "react";
import BatchForm from "../components/BatchForm";

function BatchManagement() {

    const API_URL = "https://localhost:7147/api/Batch";

    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState(null);

    // Fetch all batches
    async function fetchBatches() {

        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to fetch batches");
            }

            const data = await response.json();

            setBatches(data);
        }
        catch (error) {
            setError(error.message);
        }
        finally {
            setLoading(false);
        }
    }

    // Load batches when component renders
    useEffect(() => {
        fetchBatches();
    }, []);

    // Add batch
    async function handleAddBatch(batchData) {

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(batchData)
            });

            if (!response.ok) {
                throw new Error("Failed to add batch");
            }

            alert("Batch added successfully");

            setShowForm(false);

            fetchBatches();
        }
        catch (error) {
            alert(error.message);
        }
    }

    // Select batch for editing
    function handleEditBatch(batch) {

        setSelectedBatch(batch);
        setShowForm(true);
    }

    // Update batch
    async function handleUpdateBatch(batchData) {

        try {
            const response = await fetch(
                `${API_URL}/${batchData.batchId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(batchData)
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update batch");
            }

            alert("Batch updated successfully");

            setShowForm(false);
            setSelectedBatch(null);

            fetchBatches();
        }
        catch (error) {
            alert(error.message);
        }
    }

    // Delete batch
    async function handleDeleteBatch(batchId) {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this batch?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/${batchId}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to delete batch. It may have assigned modules."
                );
            }

            alert("Batch deleted successfully");

            fetchBatches();
        }
        catch (error) {
            alert(error.message);
        }
    }

    // Handle form submission
    function handleSaveBatch(batchData) {

        if (selectedBatch) {
            handleUpdateBatch(batchData);
        }
        else {
            handleAddBatch(batchData);
        }
    }

    // Cancel form
    function handleCancel() {

        setShowForm(false);
        setSelectedBatch(null);
    }

    return (
        <div>

            <h2>Batch Management</h2>

            <button
                onClick={() => {
                    setSelectedBatch(null);
                    setShowForm(true);
                }}
            >
                Add New Batch
            </button>

            {showForm && (
                <BatchForm
                    initialData={selectedBatch}
                    onSave={handleSaveBatch}
                    onCancel={handleCancel}
                />
            )}

            <hr />

            {loading && <p>Loading batches...</p>}

            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && (
                <table border="1" cellPadding="10">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Batch Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {batches.length === 0 ? (
                            <tr>
                                <td colSpan="6">
                                    No batches available
                                </td>
                            </tr>
                        ) : (
                            batches.map((batch) => (
                                <tr key={batch.batchId}>

                                    <td>{batch.batchId}</td>

                                    <td>{batch.batchName}</td>

                                    <td>
                                        {batch.startDate?.split("T")[0]}
                                    </td>

                                    <td>
                                        {batch.endDate
                                            ? batch.endDate.split("T")[0]
                                            : "Not decided"}
                                    </td>

                                    <td>
                                        {batch.isActive
                                            ? "Active"
                                            : "Inactive"}
                                    </td>

                                    <td>
                                        <button
                                            onClick={() =>
                                                handleEditBatch(batch)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDeleteBatch(batch.batchId)
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

export default BatchManagement;
