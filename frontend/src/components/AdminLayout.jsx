
import { NavLink, Outlet } from "react-router-dom";

function AdminLayout() {

    const menuItems = [
        { name: "Dashboard", path: "/admin" },
        { name: "Students", path: "/admin/students" },
        { name: "Faculty", path: "/admin/faculty" },
        { name: "Batches", path: "/admin/batches" },
        { name: "Modules", path: "/admin/modules" },
        { name: "Batch Module Assignment", path: "/admin/batch-modules" },
        { name: "Faculty Allocation", path: "/admin/faculty-allocation" }
    ];

    return (
        <div style={{
            display: "flex",
            minHeight: "100vh",
            fontFamily: "Arial"
        }}>

            {/* Sidebar */}
            <div style={{
                width: "240px",
                backgroundColor: "#24243e",
                color: "white",
                padding: "20px"
            }}>

                <h2>Institute Admin</h2>

                <hr />

                <nav style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                }}>

                    {menuItems.map((item) => (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/admin"}
                            style={({ isActive }) => ({
                                color: "white",
                                textDecoration: "none",
                                padding: "10px",
                                borderRadius: "5px",
                                backgroundColor: isActive
                                    ? "#5757a5"
                                    : "transparent"
                            })}
                        >
                            {item.name}
                        </NavLink>

                    ))}

                </nav>

            </div>

            {/* Main Content */}
            <div style={{
                flex: 1,
                padding: "30px",
                backgroundColor: "#f4f5f9"
            }}>

                <Outlet />

            </div>

        </div>
    );
}

export default AdminLayout;
