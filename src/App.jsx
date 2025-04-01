import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import "./styles/global.css";
import "./styles/Dashboard.css";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Link, Navigate, useNavigate } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const [details, setDetails] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [filters, setFilters] = useState({ date: "", timeSlot: "" });
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    "07:00-10:00": 0,
    "11:00-14:00": 0,
    "15:00-18:00": 0,
  });
  const navigate = useNavigate()

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/attendance-records/"
      );
      setAttendanceData(response.data);
      calculateSummary(response.data);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (data) => {
    const summaryData = {
      "07:00-10:00": 0,
      "11:00-14:00": 0,
      "15:00-18:00": 0,
    };
    data.forEach((record) => {
      summaryData[record.time_slot] += 1;
    });
    setSummary(summaryData);
  };

  const filteredData = attendanceData.filter((record) => {
    return (
      (!filters.date || record.attendance_date === filters.date) &&
      (!filters.role || record.user.role === filters.role) &&
      (!filters.timeSlot || record.time_slot === filters.timeSlot)
    );
  });

  const pieData = Object.keys(summary).map((key) => ({
    name: key,
    value: summary[key],
  }));

  const colors = ["#28a745", "#dc3545", "#ffc107"];

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchUserAndDetails = async () => {
      try {
        const userResponse = await axios.get(
          `http://127.0.0.1:8000/pic/${currentUser}/`
        );
        setUser(userResponse.data);

        const detailsUrl =
          userResponse.data.role === "teacher"
            ? "http://127.0.0.1:8000/attendance-records/"
            : `http://127.0.0.1:8000/details/${currentUser}/`;

        const detailsResponse = await axios.get(detailsUrl);
        setDetails(detailsResponse.data);
        // console.log(object)
        setAttendance(detailsResponse.data.attendance_records || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserAndDetails();
  }, []);

  const filteredAttendance = details.filter(
    (record) =>
      (!filters.date || record.attendance_date === filters.date) &&
      (!filters.timeSlot || record.time_slot === filters.timeSlot)
  );

  return (
    <div className="container">
      <div className="sidebar">
        <div className="logo">
          <label htmlFor="logo">Smart Attend</label>
        </div>
        <ul>
          <a href="#">
            <li>Dashboard</li>
          </a>

          <Link to={"/cam"}>
            <li>Live Feed </li>
          </Link>

          <label className="logout"
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/login")
            }}
          >
            Log Out
          </label>
        </ul>
      </div>
      <div className="main">
        <div className="header">
          <h2 className="title">Welcome, {user?.name}</h2>
          <img src={`http://localhost:8000/${user?.photo}`} alt={currentUser} />
        </div>
        <div className="dashboard">
          {user?.profile_picture && (
            <img
              src={user.profile_picture}
              alt="Profile"
              className="profile-pic"
            />
          )}
          <div className="filters">
            <input
              type="date"
              name="date"
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="filter-input"
            />
            <select
              name="timeSlot"
              onChange={(e) =>
                setFilters({ ...filters, timeSlot: e.target.value })
              }
              className="filter-input"
            >
              <option value="">All Time Slots</option>
              <option value="07:00-10:00">7:00 AM - 10:00 AM</option>
              <option value="11:00-14:00">11:00 AM - 2:00 PM</option>
              <option value="15:00-18:00">3:00 PM - 6:00 PM</option>
            </select>
          </div>
          {filteredAttendance.length === 0 ? (
            <p className="no-data">No attendance records found.</p>
          ) : (
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Time Slot</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((record) => (
                  <tr key={record.attendance_id}>
                    <td>{record.user.name}</td>
                    <td>{record.attendance_date}</td>
                    <td>{record.time_slot}</td>
                    <td>{record.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div>
            <div className="flex mb-4"></div>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div>
       
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={pieData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={colors[index % colors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
