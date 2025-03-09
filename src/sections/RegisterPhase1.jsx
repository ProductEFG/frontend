import React, { useEffect, useState } from "react";
import FormField from "../components/FormField.jsx";
import Button from "../components/Button.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse, isValid } from "date-fns";
import { Link } from "react-router-dom";

const RegisterPhase1 = ({ data, updateData, onNext }) => {
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [dateError, setDateError] = useState(false);

  const handleInputChange = (e) => {
    updateData({ ...data, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    const formattedDate = date ? format(date, "yyyy/MM/dd") : "";
    updateData({ ...data, date_of_birth: formattedDate });
  };

  const validate = () => {
    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    let errorState = true;
    if (!data.first_name || !nameRegex.test(data.first_name)) {
      setFirstNameError(true);
      errorState = false;
    } else {
      setFirstNameError(false);
    }
    if (!data.last_name || !nameRegex.test(data.last_name)) {
      setLastNameError(true);
      errorState = false;
    } else {
      setLastNameError(false);
    }
    const today = new Date();
    const selectedDate = new Date(data.date_of_birth);
    if (!data.date_of_birth || selectedDate >= today) {
      setDateError(true);
      errorState = false;
    } else {
      setDateError(false);
    }

    return errorState;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="flex flex-row p-6 items-center h-screen container">
      <div className="w-[50%] rounded-xl overflow-hidden">
        <img
          src="/images/auth-bg.png"
          className="w-full h-auto object-cover"
          alt="Register"
        />
      </div>
      <div className="flex flex-col w-1/2">
        <div className="bg-white flex flex-col justify-between rounded-xl m-2 ml-[18px] p-8 gap-6 ">
          <div className="flex flex-row justify-center items-center">
            <img
              src="/images/main_logos.svg"
              alt="Register Page"
              className=""
            />
          </div>

          <div className="flex flex-col gap-1">
            <h6 className="font-semibold text-[21px]">Create Your Account</h6>
            <p className="text-white-200 leading-6 text-sm">
              Welcome to Kidzania Trading App -- we can't wait to introduce you
              into a world of limitless possibilities
            </p>
          </div>

          <div className="w-full flex flex-col justify-center items-center">
            <FormField
              type="text"
              name="first_name"
              startAdornmentUrl="/images/profile.svg"
              placeholder="First Name"
              value={data.first_name}
              onChange={(e) => {
                setFirstNameError(false);
                handleInputChange(e);
              }}
              error={firstNameError}
              errorMessage="Please enter a valid first name"
            />

            <FormField
              type="text"
              name="last_name"
              startAdornmentUrl="/images/profile.svg"
              placeholder="Last Name"
              value={data.last_name}
              onChange={(e) => {
                setLastNameError(false);
                handleInputChange(e);
              }}
              error={lastNameError}
              errorMessage="Please enter a valid last name"
            />

            <div className="w-full -translate-x-2">
              <DatePicker
                selected={
                  isValid(parse(data.date_of_birth, "yyyy/MM/dd", new Date()))
                    ? parse(data.date_of_birth, "yyyy/MM/dd", new Date())
                    : null
                }
                onChange={handleDateChange}
                customInput={
                  <FormField
                    type="text"
                    name="date_of_birth"
                    startAdornmentUrl="/images/calendar.svg"
                    placeholder="Date of Birth"
                    value={data.date_of_birth}
                    error={dateError}
                    errorMessage="Please enter a valid date"
                  />
                }
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                dateFormat="yyyy/MM/dd"
                maxDate={new Date()}
                yearDropdownItemNumber={100}
                shouldCloseOnSelect={true}
              />
            </div>
          </div>

          <div className="w-full flex flex-col justify-center items-center gap-2">
            <Button
              name="Sign Up"
              onClick={handleNext}
              otherClasses="bg-purple text-white w-full h-[44px] text-sm"
            />
            <p className="text-white-200 text-sm">
              Already had an account?{" "}
              <a href="/login" className="text-purple font-semibold">
                Login
              </a>
            </p>
          </div>
        </div>

        {/* <div className="bg-white flex flex-row items-center  m-5 p-5 mt-4 px-10 h-[122] rounded-xl">
            <img src="/images/profilelist.svg" />
            <div className="mr-10 ml-6">
              <h6 className="text-[14px]">Join 100k+ happy users!</h6>
              <p className="text-[14px] text-white-200">
                Click the arrow on right to see what our current achieved so
                far.
              </p>
            </div>
            <Link
              to="/leaderboards"
              state={{ from: "/register" }}
              className="bg-purple p-5 rounded-full"
            >
              <img src="/images/rightline.svg" className="w-10" />
            </Link>
          </div> */}
      </div>
    </div>
  );
};

export default RegisterPhase1;
