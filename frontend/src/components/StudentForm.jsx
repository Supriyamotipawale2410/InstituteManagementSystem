function StudentForm({ newStudent, onInputChange, onSubmit, saving, editingStudentId }) {

    return (
        <form onSubmit={onSubmit}>

            <h2>{editingStudentId ? "Edit Student" : "Add New Student"}</h2>

            <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={newStudent.firstName}
                onChange={onInputChange}
                required
            />

            <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={newStudent.lastName}
                onChange={onInputChange}
                required
            />

            <input
                type="email"
                name="email"
                placeholder="Email"
                value={newStudent.email}
                onChange={onInputChange}
                required
            />

            <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={newStudent.phoneNumber}
                onChange={onInputChange}
                required
            />

            <label>Date of Birth</label>
            <input
                type="date"
                name="dateOfBirth"
                value={newStudent.dateOfBirth}
                onChange={onInputChange}
                required
            />

            <label>Admission Date</label>
            <input
                type="date"
                name="admissionDate"
                value={newStudent.admissionDate}
                onChange={onInputChange}
                required
            />

            <button type="submit" disabled={saving}>
                {saving
                    ? "Saving..."
                    : editingStudentId
                        ? "Update Student"
                        : "Save Student"}
            </button>

        </form>
    );
}

export default StudentForm;