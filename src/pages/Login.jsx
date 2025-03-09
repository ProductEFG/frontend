import React, { useEffect, useState } from "react";
import FormField from "../components/FormField.jsx";
import Button from "../components/Button.jsx";
import { userService } from "../services/user.service.js";
import { useAuth } from "../providers/AuthProvider.jsx";
import { useNavigate } from "react-router";
import UserEntity from "../entities/userEntity.js";

const Login = () => {
  const navigate = useNavigate();

  const { user, setUser, admin } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    try {
      if (!username || !password) {
        if (!username) {
          setUsernameError(true);
        }
        if (!password) {
          setPasswordError(true);
        }
        return;
      } else {
        setUsernameError(false);
        setPasswordError(false);
      }

      const user = await userService.login(username, password);
      await setUser(new UserEntity(user));
      sessionStorage.setItem("token", JSON.stringify(user));

      const enabledTabs = 0;
      sessionStorage.setItem("enabledTabs", JSON.stringify(enabledTabs));
      navigate("/");
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
    if (admin) {
      navigate("/admin/home");
    }
  }, [navigate, user]);

  return (
    <div className="flex flex-row w-screen h-screen overflow-hidden justify-center items-center container">
      <div className="flex flex-row big:justify-center big:items-center">
        <div className="w-[50%] rounded-2xl overflow-hidden">
          <img
            src="/images/auth-bg.png"
            alt="Login"
            className="w-[100%] h-auto object-cover"
          />
        </div>

        <div className="flex flex-col w-[50%]">
          <div className="bg-white h-[550px] flex flex-col rounded-xl p-5 m-2 ml-[18px] big:justify-between">
            <div className="flex flex-col justify-center items-center gap-5">
              <div className="flex flex-row justify-center items-center">
                <img src="/images/main_logos.jpg" alt="Login Page" />
              </div>

              <div className="flex flex-col gap-2">
                <h6 className="font-semibold text-[21px]">Welcome Back!</h6>
                <p className="text-white-200 text-sm leading-6">
                  Let's navigate the kidzenia App together - we can't wait to
                  introduce you into a world of limitless possibilities
                </p>
              </div>

              <div className="w-full flex flex-col justify-center items-center">
                <FormField
                  type="text"
                  startAdornmentUrl="/images/profile.svg"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => {
                    setUsernameError(false);
                    setUsername(e.target.value);
                  }}
                  error={usernameError}
                  errorMessage="Please enter your username"
                />

                <FormField
                  type="password"
                  startAdornmentUrl="/images/password.svg"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPasswordError(false);
                    setPassword(e.target.value);
                  }}
                  error={passwordError}
                  errorMessage="Please enter your password"
                />
              </div>
            </div>
            {loginError && (
              <p className="text-red-500 mt-2 ml-2 text-center">{loginError}</p>
            )}

            <div className="w-full flex flex-col justify-center items-center gap-2 mt-10">
              <Button
                name="Login"
                onClick={handleLogin}
                loading={loading}
                otherClasses="bg-purple text-white w-full"
              />
              <p className="text-sm text-white-200">
                Doesn’t have an account?{" "}
                <a href="/register" className="text-purple font-semibold">
                  Sign Up
                </a>
              </p>
            </div>
          </div>
          {/* <div className="bg-white flex flex-row items-center md:p-5 m-5 md:px-10 px-4 h-[122px] mt-4 rounded-xl">
            <img src="/images/profilelist.svg" className="max-md:w-20" />
            <div className="md:mr-10 mr-2 ml-6">
              <h6 className="md:text-[16px] text-xs pb-2">
                Join 100k+ happy users!
              </h6>
              <p className="md:text-[16px] text-white-200 text-xs">
                Click the arrow on right to see what our current achieved so
                far.
              </p>
            </div>
            <Link
              to="/leaderboards"
              state={{ from: "/login" }}
              className="bg-purple md:p-5 p-3 rounded-full"
            >
              <img src="/images/rightline.svg" className="w-10" />
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
