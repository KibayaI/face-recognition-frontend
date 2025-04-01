import { React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [logFields, setLogfields] = useState({
    email: "",
    password: "",
  });
  // const [eye, setEye] = useState("eye");

  function onFIeldChange(e) {
    if (e.target.name === "emailField") {
      setLogfields({
        email: e.target.value,
        password: logFields.password,
      });
    } else {
      setLogfields({
        email: logFields.email,
        password: e.target.value,
      });
    }
    setError("");
  }

  async function login(e) {
    e.preventDefault();

    const user = await fetch("http://localhost:8000/user/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logFields),
    }).then((user) => user.json());

    if (user.Success) {
      localStorage.setItem("user", JSON.stringify(user.user_id));
      navigate("/");
    } else if (user.Error == "Email does not exist") {
      setError("Email does not exist!!!");
    } else {
      setError("Incorrect password!!!");
    }
  }
  // const currentUser = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="entry login-page">
      <form onSubmit={login}>
        <div className="form-fields">
          <input
            id="emailField"
            name="emailField"
            type="email"
            required
            placeholder="Email"
            value={logFields.email}
            onChange={onFIeldChange}
          />
        </div>

        <div className="form-fields">
          <input
            type="password"
            id="passwordField"
            name="passwordField"
            required
            placeholder="Password"
            value={logFields.password}
            onChange={onFIeldChange}
          />
        </div>
        <label className="slant error">{error}</label>

        <button>Login</button>
        <br />
        <label className="slant">
          Don't have an account?&nbsp;
          <Link to="/SignUp">Sign Up</Link>
        </label>
      </form>
    </div>
  );
};

export default Login;
