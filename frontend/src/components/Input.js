"use client";

import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

export default function Input({
  label,
  type,
  placeholder,
  name,
  value,
  onChange,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const icons = {
    "First Name": <FaUser />,
    "Last Name": <FaUser />,
    "Full Name": <FaUser />,
    "Email Address": <FaEnvelope />,
    Email: <FaEnvelope />,
    "Phone Number": <FaPhone />,
    Password: <FaLock />,
    "Confirm Password": <FaLock />,
  };

  const inputType =
    type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {icons[label]}
        </span>

        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="
            w-full
            rounded-xl
            border
            border-gray-200
            bg-gray-50
            py-3
            pl-12
            pr-12
            text-gray-700
            outline-none
            transition-all
            duration-300
            focus:border-blue-500
            focus:bg-white
            focus:ring-4
            focus:ring-blue-100
          "
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
    </div>
  );
}