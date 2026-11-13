import StudentForm from "../components/StudentForm";
import StudentTable from "../components/StudentTable";
import { useState, useEffect } from "react";

function StudentManagament(){

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [editingStudentId, setEditingStudentId] = useState(null);

    const [newStudent, setNewStudent] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        admissionDate: ""
    });

    async function fetchStudents() {

    try {

        const response = await fetch(
            "https://localhost:7147/api/Student"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch students");
        }

        const data = await response.json();

        setStudents(data);

    }
    catch (error) {

        setError(error.message);

    }
    finally {

        setLoading(false);

    }

}

function handleEdit(student) {

    setEditingStudentId(student.studentId);

    setNewStudent({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phoneNumber: student.phoneNumber,
        dateOfBirth: student.dateOfBirth?.split("T")[0] || "",
        admissionDate: student.admissionDate?.split("T")[0] || ""
    });

    setShowForm(true);
}

function handleInputChange(event) {
    const { name, value } = event.target;

    setNewStudent(previousStudent => ({
        ...previousStudent,
        [name]: value
    }));
}

async function handleSubmit(event) {

    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {

        const url = editingStudentId
            ? `https://localhost:7147/api/Student/${editingStudentId}`
            : "https://localhost:7147/api/Student";

        const method = editingStudentId ? "PUT" : "POST";

        const response = await fetch(url, {

            method: method,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(newStudent)

        });

        if (!response.ok) {
            throw new Error("Failed to save student");
        }

        setMessage(
            editingStudentId
                ? "Student updated successfully!"
                : "Student added successfully!"
        );

        setNewStudent({
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            dateOfBirth: "",
            admissionDate: ""
        });

        setEditingStudentId(null);
        setShowForm(false);

        await fetchStudents();

    }
    catch (error) {
        setError(error.message);
    }
    finally {
        setSaving(false);
    }
}

async function handleDelete(id) {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
        return;
    }

    setError("");
    setMessage("");

    try {

        const response = await fetch(
            `https://localhost:7147/api/Student/${id}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete student");
        }

        setMessage("Student deleted successfully!");

        await fetchStudents();

    }
    catch (error) {
        setError(error.message);
    }
}

useEffect(() => {

    fetchStudents();

}, []);

    return (
    <div>
        <h1>Student Management</h1>
        {message && <p>{message}</p>}
{error && <p>{error}</p>}

<button onClick={() => setShowForm(!showForm)}>
    Add Student
</button>

{showForm && (
    <StudentForm
    newStudent={newStudent}
    onInputChange={handleInputChange}
    onSubmit={handleSubmit}
    saving={saving}
    editingStudentId={editingStudentId}
/>
)}

        {loading && <p>Loading students...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && (
            <StudentTable
                students={students}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
)}

    </div>
);
}

export default StudentManagament;