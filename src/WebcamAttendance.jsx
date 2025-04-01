import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/global.css"

const WebcamAttendance = () => {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [attendanceResult, setAttendanceResult] = useState(null);

  useEffect(() => {
    const interval = setInterval(captureAndSend, 10000);
    return () => clearInterval(interval);
  }, []);

  const captureAndSend = async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setLoading(true);
    setAttendanceResult(null);

    const blob = await fetch(imageSrc).then((res) => res.blob());
    const formData = new FormData();
    formData.append("image", blob, "attendance.jpg");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/mark-attendance/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setAttendanceResult(response.data);
      console.log(attendanceResult);

      toast.success("Attendance marked!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Face not recognized.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="camCont">
        <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
      {loading && <p>Processing...</p>}
      {attendanceResult && (
        <div>
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

export default WebcamAttendance;
