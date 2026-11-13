function StudentTable({ students, onEdit, onDelete }) {

    return (
        <table border="1" cellPadding="10">

            <thead>
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                {students.map((student) => (
                    <tr key={student.studentId}>
                        <td>{student.studentId}</td>
                        <td>{student.firstName}</td>
                        <td>{student.lastName}</td>
                        <td>{student.email}</td>
                        <td>{student.phoneNumber}</td>
                        <td>
                            <button onClick={() => onEdit(student)}>
                                Edit
                            </button>

                            <button onClick={() => onDelete(student.studentId)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>

        </table>
    );
}

export default StudentTable;