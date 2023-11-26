import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import { auth } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import "../style.scss";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function Auth({ setActive, setUser }) {
  const [state, setState] = useState(initialState);
  const [signUp, setSignUp] = useState(false); //this is for login or signup choice
  const [focused, setFocused] = useState(false);

  const { firstName, lastName, email, password, confirmPassword } = state;
  const navigate = useNavigate();

  const handleChange = function (e) {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();

    if (!signUp) {
      if (email && password) {
        const { user } = await signInWithEmailAndPassword(
          auth,
          email,
          password
        ).catch((error) => {
          switch (error.code) {
            case "auth/invalid-login-credentials":
              toast.error(
                `either ${email} is not registered yet or  invalid  credentials`
              );
              break;
            default:
              toast.error(error.code);
              break;
          }
        });
        toast.success("Login succesfull");
        setUser(user);
        setActive("home");
      } else {
        return toast.error("All Field are mandatory!!");
      }
    } else {
      if (password !== confirmPassword) {
        return toast.error("Password doesn't match");
      }
      if (firstName && lastName && email && password) {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        ).catch((error) => {
          switch (error.code) {
            case "auth/email-already-in-use":
              toast.error(`${email} is already in use`);
              break;
            default:
              toast.error(error.code);
              break;
          }
        });
        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
        }).catch((error) => {
          switch (error.code) {
            default:
              toast.error(error.code);
              break;
          }
        });
        toast.success("User registered succesfully!");
        setActive("home");
        setUser(user);
      } else {
        return toast.error("All field are mandatory!!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      }
    }

    navigate("/");
  };

  return (
    <div className="container-fluid mb-4">
      <div className="container">
        <div className="col-12 text-center">
          <div className="text-center heading py-2">
            {!signUp ? "SignIn" : "SignUp"}
          </div>
        </div>
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-10 col-md-8 col-lg-6">
            <form className="row" onSubmit={handleAuth}>
              {signUp && (
                <>
                  <div className="col-6 py-3 inputField">
                    <input
                      type="text"
                      className="form-control input-text-box"
                      placeholder="First Name"
                      value={firstName}
                      name="firstName"
                      onChange={handleChange}
                      required
                      pattern="^[A-Za-z]{3,20}$"
                      autoComplete="off"
                      onBlur={() => setFocused(true)}
                      focused={focused.toString()}
                    />
                    <span className="error-msg">
                      *firstname must be 3-20 characters long without any
                      space,digit or special character
                    </span>
                  </div>
                  <div className="col-6 py-3 inputField">
                    <input
                      type="text"
                      className="form-control input-text-box"
                      placeholder="Last Name"
                      value={lastName}
                      name="lastName"
                      pattern="^[A-Za-z]{3,20}$"
                      onChange={handleChange}
                      required
                      onBlur={() => setFocused(true)}
                      focused={focused.toString()}
                      autoComplete="off"
                    />
                    <span className="error-msg">
                      *lastname must be 3-20 characters long without any
                      space,digit or special character
                    </span>
                  </div>
                </>
              )}

              <div className="col-12 py-3 inputField">
                <input
                  type="email"
                  className="form-control input-text-box"
                  placeholder="Email"
                  value={email}
                  name="email"
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  onBlur={() => setFocused(true)}
                  focused={focused.toString()}
                />
                <span className="error-msg">
                  *Email is either empty or invalid
                </span>
              </div>
              <div className="col-12 py-3 inputField">
                <input
                  type="password"
                  className="form-control input-text-box"
                  placeholder="Password"
                  value={password}
                  name="password"
                  onChange={handleChange}
                  required
                  pattern="^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$"
                  autoComplete="off"
                  onBlur={() => setFocused(true)}
                  focused={focused.toString()}
                />

                <span className="error-msg">
                  *Password should be 8-20 characters and include at least 1
                  letter,1 number and 1 special character!
                </span>
              </div>
              {signUp && (
                <>
                  <div className="col-12 py-3 inputField">
                    <input
                      type="password"
                      className="form-control input-text-box"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      name="confirmPassword"
                      onChange={handleChange}
                      pattern="^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$"
                      required
                      autoComplete="off"
                      onBlur={() => setFocused(true)}
                      focused={focused.toString()}
                    />
                    <span className="error-msg">
                      *Password should be 8-20 characters and include at least 1
                      letter,1 number and 1 special character!
                    </span>
                  </div>
                </>
              )}
              <div className="col-12 py-3 text-center">
                <button
                  className={`btn ${!signUp ? "btn-sign-in" : "btn-sign-up"} `}
                  type="submit"
                >
                  {!signUp ? "Sign-in" : "Sign-up"}
                </button>
              </div>
            </form>

            <div>
              {!signUp ? (
                <>
                  <div className="text-center justify-content-center mt-2 pt-2">
                    <p className="small fw-bold mt-2 pt-1 mb-0">
                      Don't have an account?&nbsp;
                      <span
                        className="link-danger"
                        style={{ textDecoration: "none", cursor: "pointer" }}
                        onClick={() => {
                          setSignUp(true);
                        }}
                      >
                        SignUp
                      </span>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center justify-content-center mt-2 pt-2">
                    <p className="small fw-bold mt-2 pt-1 mb-0">
                      Already have an account?&nbsp;
                      <span
                        className="link-danger"
                        style={{
                          textDecoration: "none",
                          cursor: "pointer",
                          color: "#298af2",
                        }}
                        onClick={() => setSignUp(false)}
                      >
                        SignIn
                      </span>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
