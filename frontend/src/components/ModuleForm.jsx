
import { useState } from "react";

function ModuleForm({ initialData, onSave, onCancel }) {

    const [moduleName, setModuleName] = useState(
        initialData?.moduleName || ""
    );

    const [description, setDescription] = useState(
        initialData?.description || ""
    );

    const [isActive, setIsActive] = useState(
        initialData?.isActive ?? true
    );

    function handleSubmit(e) {
        e.preventDefault();

        const moduleData = {
            moduleName,
            description,
            isActive
        };

        if (initialData) {
            moduleData.moduleId = initialData.moduleId;
        }

        onSave(moduleData);
    }

    return (
        <form onSubmit={handleSubmit}>

            <h3>
                {initialData ? "Update Module" : "Add New Module"}
            </h3>

            <div>
                <label>Module Name</label>

                <input
                    type="text"
                    value={moduleName}
                    onChange={(e) => setModuleName(e.target.value)}
                    placeholder="Enter module name"
                    required
                />
            </div>

            <div>
                <label>Description</label>

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter module description"
                    rows="4"
                />
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                    />
                    Active Module
                </label>
            </div>

            <button type="submit">
                {initialData ? "Update Module" : "Add Module"}
            </button>

            <button type="button" onClick={onCancel}>
                Cancel
            </button>

        </form>
    );
}

export default ModuleForm;
