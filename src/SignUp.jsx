// import { React, useState } from "react";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import "./styles/global.css";

// const SignUp = () => {
//   const [regDetails, setRegDetails] = useState({
//     name: "",
//     email: "",
//     role: "",
//     password: "",
//   });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   function onFIeldChange(e) {
//     if (e.target.name === "nameField") {
//       setRegDetails({
//         name: e.target.value,
//         email: regDetails.email,
//         role: regDetails.role,
//         password: regDetails.password,
//       });
//     } else if (e.target.name === "emailField") {
//       setRegDetails({
//         name: regDetails.name,
//         email: e.target.value,
//         role: regDetails.role,
//         password: regDetails.password,
//       });
//       setError("");
//     } else if (e.target.name === "roleField") {
//       setRegDetails({
//         name: regDetails.name,
//         email: regDetails.email,
//         role: e.target.value,
//         password: regDetails.password,
//       });
//     } else if (e.target.name === "passwordField") {
//       setRegDetails({
//         name: regDetails.name,
//         email: regDetails.email,
//         role: regDetails.role,
//         password: e.target.value,
//       });
//     }
//   }

//   async function register(e) {
//     e.preventDefault();

//     try {
//       const user = await fetch("http://localhost:8000/users/", {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(regDetails),
//       }).then((user) => user.json());

//       if (!user.Error) {
//         // console.log("post success!!");
//         // console.log(user);
//         localStorage.setItem("user", JSON.stringify(user.user_id));
//         navigate("/");
//         // console.log(localStorage.getItem("user"));
//       } else {
//         setError("Email Address already in use!!!");
//         console.log(user);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   return (
//     <div className="entry">
//       <form onSubmit={register}>
//         <div className="form-fields">
//           <label htmlFor="textInput">Name</label>
//           <input
//             id="name"
//             name="nameField"
//             type="text"
//             required
//             placeholder="Name"
//             defaultValue={regDetails.name}
//             onChange={onFIeldChange}
//           />
//         </div>

//         <div className="form-fields">
//           <label htmlFor="emailField">Email</label>
//           <input
//             id="emailField"
//             name="emailField"
//             type="email"
//             required
//             placeholder="Email"
//             value={regDetails.email}
//             onChange={onFIeldChange}
//           />
//         </div>
//         <label className="error slant">{error}</label>

//         <div className="form-fields">
//           <label htmlFor="roleField">Role</label>
//           <input
//             type="text"
//             id="roleField"
//             name="roleField"
//             required
//             placeholder="Role"
//             value={regDetails.role}
//             onChange={onFIeldChange}
//           />
//         </div>

//         <div className="form-fields">
//           <label htmlFor="passwordField">Password</label>
//           <input
//             type="password"
//             id="passwordField"
//             name="passwordField"
//             required
//             placeholder="Password"
//             minLength={8}
//             value={regDetails.password}
//             onChange={onFIeldChange}
//           />
//         </div>

//         <button>Sign Up</button>
//         <br />

//         <label className="slant">
//           Already have an account?&nbsp;
//           <Link to="/Login">Log In</Link>
//         </label>
//       </form>
//     </div>
//   );
// };

// export default SignUp;

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
