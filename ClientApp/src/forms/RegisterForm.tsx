import {
  faArrowLeft,
  faArrowRight,
  faEnvelope,
  faUnlock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { RegisterDto } from "../types";
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { PopupType, usePopup } from "../components/Popup";
import { easeInOut, motion } from "framer-motion";

const INPUTS = [
  {
    type: "text",
    name: "firstName",
    id: "firstName",
    placeholder: "First Name",
    icon: faUser,
  },
  {
    type: "text",
    name: "lastName",
    id: "lastName",
    placeholder: "Last Name",
    icon: faUser,
  },
  {
    type: "email",
    name: "email",
    id: "email",
    placeholder: "Email",
    icon: faEnvelope,
  },
  {
    type: "text",
    name: "userName",
    id: "username",
    placeholder: "User Name",
    icon: faUser,
  },

  {
    type: "password",
    name: "password",
    id: "password",
    placeholder: "Password",
    icon: faUnlock,
  },
];

type Parps = {
  show: boolean;
  onBackClick: () => void;
};
function RegisterForm({ show = false, onBackClick }: Parps) {
  // State
  const [data, setData] = useState<RegisterDto | null>(null);
  const { register, loading } = useAuth();
  const { alert, Modal } = usePopup();
  // Logic
  const handleData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((perv) => ({ ...(perv as RegisterDto), [name]: value }));
  };

  const handleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!data) return;

    const isRegister = await register(data);
    if (isRegister.isSuccess) {
      await alert(isRegister.message, "Regiester", PopupType.INFO);
      onBackClick();
      return;
    }

    await alert(isRegister.message, "Error", PopupType.WARNING);
  };

  const isFilled = !!(
    data?.firstName?.trim() &&
    data?.lastName?.trim() &&
    data?.email?.trim() &&
    data?.userName?.trim() &&
    data?.password?.trim()
  );

  return (
    <>
      <form
        className={`registry p-7.5 grid grid-cols-2 relative w-[50%] gap-2.5 h-fit transition-all duration-500 ease-in-out ${show === true ? "opacity-0 -z-10" : ""}`}
        action="/login"
        method="POST"
        autoComplete="off"
      >
        <div
          onClick={onBackClick}
          className="absolute top-5 left-5 text-[20px] cursor-pointer"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </div>
        <h1 className="col-span-2 text-[40px] font-bold text-white text-center mb-7.5">
          Registry
        </h1>
        {INPUTS.map((input) => (
          <div
            key={input.id}
            className={`${input.name === "email" ? "col-span-2 " : ""}  form-box relative`}
          >
            <input
              onChange={handleData}
              className="rounded-[30px] p-2.5 w-full text-[15px] mb-1.25
                     border border-[#ccc] outline-none placeholder:text-[13px]"
              type={input.type}
              placeholder={input.placeholder}
              name={input.name}
              id={input.id}
            />
            <FontAwesomeIcon
              icon={input.icon}
              className="absolute top-[50%] right-2.5 translate-y-[-50%]"
            />
          </div>
        ))}
        <div className="sign-up col-span-2 flex items-center justify-between">
          <button
            onClick={handleSignup}
            type="submit"
            className={` py-2 px-3.75 rounded-[20px] cursor-pointer ${isFilled ? " btn-primary" : " btn-ghost"}`}
          >
            Sign Up
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
          {loading && (
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3].map((i) => (
                <motion.span
                  key={i}
                  className="w-2.5 h-2.5 bg-(--color-primary) block rounded-full"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: easeInOut,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </form>
      <Modal />
    </>
  );
}

export default RegisterForm;
