
import { useState, useEffect } from "react";
import FacultyForm from "../components/FacultyForm";

function FacultyManagement() {

    const [faculties, setFaculties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    // Stores the faculty selected for editing
    const [selectedFaculty, setSelectedFaculty] = useState(null);

    useEffect(() => {
        fetchFaculties();
    }, []);

    // GET API
    async function fetchFaculties() {

        try {
            const response = await fetch(
                "https://localhost:7147/api/Faculty"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch faculty records");
            }

            const data = await response.json();
            setFaculties(data);
        }
        catch (error) {
            setError(error.message);
        }
        finally {
            setLoading(false);
        }
    }

    // POST API - Add Faculty
    async function handleAddFaculty(formData) {

        try {

            const response = await fetch(
                "https://localhost:7147/api/Faculty",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            if (!response.ok) {
                throw new Error("Failed to add faculty");
            }

            await fetchFaculties();

            setShowForm(false);

            alert("Faculty added successfully!");

        }
        catch (error) {
            alert(error.message);
        }
    }

    // Select Faculty for Editing
    function handleEditFaculty(faculty) {

        setSelectedFaculty(faculty);

        setShowForm(true);
    }

    // PUT API - Update Faculty
    async function handleUpdateFaculty(formData) {

        try {

            const response = await fetch(
                `https://localhost:7147/api/Faculty/${selectedFaculty.facultyId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...formData,
                        facultyId: selectedFaculty.facultyId
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update faculty");
            }

            await fetchFaculties();

            setShowForm(false);
            setSelectedFaculty(null);

            alert("Faculty updated successfully!");

        }
        catch (error) {
            alert(error.message);
        }
    }


// DELETE API - Delete Faculty
async function handleDeleteFaculty(facultyId) {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this faculty member?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `https://localhost:7147/api/Faculty/${facultyId}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {

            const errorMessage = await response.text();

            throw new Error(errorMessage || "Failed to delete faculty");
        }

        await fetchFaculties();

        alert("Faculty deleted successfully!");

    }
    catch (error) {

        alert(error.message);

    }
}


    return (
        <div>

            <h1>Faculty Management</h1>

            <button
                type="button"
                onClick={() => {
                    setSelectedFaculty(null);
                    setShowForm(true);
                }}
            >
                Add Faculty
            </button>

            {showForm && (
                <FacultyForm
                    initialData={selectedFaculty}
                    onSave={
                        selectedFaculty
                            ? handleUpdateFaculty
                            : handleAddFaculty
                    }
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedFaculty(null);
                    }}
                />
            )}

            {loading && <p>Loading faculty records...</p>}

            {error && <p>{error}</p>}

            {!loading && !error && (

                <table border="1" cellPadding="10">

                    <thead>
                        <tr>
                            <th>Faculty ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Specialization</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        {faculties.map((faculty) => (

                            <tr key={faculty.facultyId}>
                                <td>{faculty.facultyId}</td>
                                <td>{faculty.firstName}</td>
                                <td>{faculty.lastName}</td>
                                <td>{faculty.email}</td>
                                <td>{faculty.department}</td>
                                <td>{faculty.specialization}</td>

                                <td>
                                    <button
                                        type="button"
                                        onClick={() => handleEditFaculty(faculty)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDeleteFaculty(faculty.facultyId)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>

                        ))}

                    </tbody>

                </table>

            )}

        </div>
    );
}

export default FacultyManagement;
