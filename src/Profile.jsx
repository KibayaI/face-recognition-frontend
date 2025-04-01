import React, { useEffect, useState } from "react";
import axios from "axios";
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
// import "./styles/Dashboard.css";

const AttendanceDashboard = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ date: "", role: "", timeSlot: "" });
  const [summary, setSummary] = useState({
    "07:00-10:00": 0,
    "11:00-14:00": 0,
    "15:00-18:00": 0,
  });

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

  return (
    <div className="container">
      <h2 className="title">Attendance Dashboard</h2>
      <div className="flex mb-4">
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="input"
        />
        <select
          name="role"
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          className="select"
        >
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        <select
          name="timeSlot"
          value={filters.timeSlot}
          onChange={(e) => setFilters({ ...filters, timeSlot: e.target.value })}
          className="select"
        >
          <option value="">All Time Slots</option>
          <option value="07:00-10:00">7:00 AM - 10:00 AM</option>
          <option value="11:00-14:00">11:00 AM - 2:00 PM</option>
          <option value="15:00-18:00">3:00 PM - 6:00 PM</option>
        </select>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          <h3 className="subtitle">Attendance Summary by Time Slot</h3>
          <ul>
            <li>07:00-10:00: {summary["07:00-10:00"]}</li>
            <li>11:00-14:00: {summary["11:00-14:00"]}</li>
            <li>15:00-18:00: {summary["15:00-18:00"]}</li>
          </ul>
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
  );
};

export default AttendanceDashboard;
