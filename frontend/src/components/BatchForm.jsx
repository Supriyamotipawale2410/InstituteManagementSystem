
import { useState } from "react";

function BatchForm({ initialData, onSave, onCancel }) {

    const [batchName, setBatchName] = useState(
        initialData?.batchName || ""
    );

    const [startDate, setStartDate] = useState(
        initialData?.startDate?.split("T")[0] || ""
    );

    const [endDate, setEndDate] = useState(
        initialData?.endDate?.split("T")[0] || ""
    );

    const [isActive, setIsActive] = useState(
        initialData?.isActive ?? true
    );

    function handleSubmit(e) {
        e.preventDefault();

        const batchData = {
            batchName,
            startDate: `${startDate}T00:00:00`,
            endDate: endDate
                ? `${endDate}T00:00:00`
                : null,
            isActive
        };

        if (initialData) {
            batchData.batchId = initialData.batchId;
        }

        onSave(batchData);
    }

    return (
        <form onSubmit={handleSubmit}>

            <h3>
                {initialData ? "Update Batch" : "Add New Batch"}
            </h3>

            <div>
                <label>Batch Name</label>

                <input
                    type="text"
                    value={batchName}
                    onChange={(e) => setBatchName(e.target.value)}
                    placeholder="Enter batch name"
                    required
                />
            </div>

            <div>
                <label>Start Date</label>

                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>End Date</label>

                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                />
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                    />
                    Active Batch
                </label>
            </div>

            <button type="submit">
                {initialData ? "Update Batch" : "Add Batch"}
            </button>

            <button type="button" onClick={onCancel}>
                Cancel
            </button>

        </form>
    );
}

export default BatchForm;
