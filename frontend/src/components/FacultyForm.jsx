
import { useState, useEffect } from "react";

function FacultyForm({ initialData, onSave, onCancel }) {

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        department: "",
        specialization: "",
        joiningDate: "",
        isActive: true
    });

    // Fill the form when editing an existing faculty member
    useEffect(() => {

        if (initialData) {
            setFormData({
                firstName: initialData.firstName,
                lastName: initialData.lastName,
                email: initialData.email,
                phoneNumber: initialData.phoneNumber || "",
                department: initialData.department,
                specialization: initialData.specialization || "",
                joiningDate: initialData.joiningDate
                    ? initialData.joiningDate.substring(0, 10)
                    : "",
                isActive: initialData.isActive
            });
        }

    }, [initialData]);

    // Update a particular field
    function handleChange(event) {

        const { name, value, type, checked } = event.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    }

    // Submit the form
    function handleSubmit(event) {

        event.preventDefault();

        onSave(formData);
    }

    return (
        <div>
            <h2>
                {initialData ? "Edit Faculty" : "Add Faculty"}
            </h2>

            <form onSubmit={handleSubmit}>

                <label>First Name</label>
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <label>Last Name</label>
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <label>Phone Number</label>
                <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                />

                <br /><br />

                <label>Department</label>
                <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <label>Specialization</label>
                <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                />

                <br /><br />

                <label>Joining Date</label>
                <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <label>
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                    />
                    Active Faculty
                </label>

                <br /><br />

                <button type="submit">
                    {initialData ? "Update Faculty" : "Add Faculty"}
                </button>

                <button type="button" onClick={onCancel}>
                    Cancel
                </button>

            </form>
        </div>
    );
}

export default FacultyForm;
