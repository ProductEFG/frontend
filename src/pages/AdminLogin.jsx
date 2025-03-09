import React, { useEffect, useState } from "react";
import FormField from "../components/FormField.jsx";
import Button from "../components/Button.jsx";
import { userService } from "../services/user.service.js";
import { useAuth } from "../providers/AuthProvider.jsx";
import { useNavigate } from "react-router";
import UserEntity from "../entities/userEntity.js";
import { Link } from "react-router-dom";
import { adminService } from "../services/admin.services.js";
import AdminEntity from "../entities/adminEntity.js";

const AdminLogin = () => {
  const navigate = useNavigate();

  const { user, admin, setAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    try {
      if (!email || !password) {
        if (!email) {
          setEmailError(true);
        }
        if (!password) {
          setPasswordError(true);
        }
        return;
      } else {
        setEmailError(false);
        setPasswordError(false);
      }

      const admin = await adminService.login(email, password);
      const adminEntity = new AdminEntity(admin);
      await setAdmin(adminEntity);
      sessionStorage.setItem("admintoken", JSON.stringify(adminEntity));

      navigate("/admin/home");
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
    <div className="flex flex-row md:flex-row items-center justify-center h-screen w-screen container">
      <div className="w-[50%] overflow-hidden rounded-xl">
        <img
          src="/images/admin/admin_login.svg"
          className="object-cover w-full h-auto max-h-[700px]"
          alt="Admin Login"
        />
      </div>
      <div className=" bg-white flex flex-col w-1/2 justify-center rounded-2xl">
        <div className="flex flex-col justify-between p-5 m-5 mt-0">
          <div className="flex flex-col justify-center gap-3">
            <div className="flex flex-row justify-center items-center">
              <img src="/images/main_logos.jpg" />
            </div>

            <h6 className="font-semibold text-2xl p-2">
              Log In to your Admin Account
            </h6>

            <div className="w-full flex flex-col justify-center items-center gap-2">
              <FormField
                type="text"
                startAdornmentUrl="/images/admin/email.svg"
                placeholder="Email Address ..."
                value={email}
                onChange={(e) => {
                  setEmailError(false);
                  setEmail(e.target.value);
                }}
                error={emailError}
                errorMessage="Please enter your email"
              />

              <FormField
                type="password"
                startAdornmentUrl="/images/admin/password.svg"
                placeholder="Password ..."
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

          <div className="w-full flex flex-col items-center justify-center gap-2 pt-10">
            <Button
              name="Log In"
              onClick={handleLogin}
              loading={loading}
              otherClasses="bg-purple text-white w-full mb-5"
            />
            <div className="border-t-[#CCCCCC] border-t pt-5 w-[95%]">
              Having a trouble?{" "}
              <a href="/register" className="text-purple font-semibold">
                Contact IT Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
