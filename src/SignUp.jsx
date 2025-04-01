import { useState } from "react";
import axios from "axios";
import "./styles/SignUp.css";
import { useNavigate, Link } from "react-router-dom";

const RegisterUser = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formPayload = new FormData();

    for (let key in formData) {
      formPayload.append(key, formData[key]);
    }
    if (photo) {
      formPayload.append("photo", photo);
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/register/",
        formPayload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(response.data);
      localStorage.setItem("user", JSON.stringify(response.data.user_id));
      navigate("/");
    } catch (error) {
      console.log(error);
      setMessage("Registration failed. Try again.");
    }
  };

  return (
    <div className="entry">
      <div>
        <h2>User Registration</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-fields">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-fields">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-fields">
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-fields">
          <label htmlFor="role">Role</label>
          <select className="role" name="role" onChange={handleChange} required>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button>Sign Up</button>

        <label className="slant">
          Already have an account?&nbsp;
          <Link to="/login">Log In</Link>
        </label>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default RegisterUser;
