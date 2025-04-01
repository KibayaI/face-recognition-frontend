import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MarkAttendaceFace = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attendanceResult, setAttendanceResult] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    setLoading(true);
    setAttendanceResult(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/mark-attendance/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setAttendanceResult(response.data);
      toast.success("Attendance marked successfully!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Face not recognized.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Mark Attendance</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4"
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="border p-2 rounded-lg w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
        >
          {loading ? "Processing..." : "Upload & Mark Attendance"}
        </button>
      </form>

      {attendanceResult && (
        <div className="mt-4 p-4 bg-green-100 rounded-lg text-green-700">
          <p>
            <strong>Message:</strong> {attendanceResult.message}
          </p>
          <p>
            <strong>Attendance ID:</strong> {attendanceResult.attendance_id}
          </p>
        </div>
      )}
    </div>
  );
};

export default MarkAttendaceFace;
