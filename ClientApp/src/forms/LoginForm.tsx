import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import type { LoginDto } from "../types";
import { useNavigate } from "react-router-dom";
import { PopupType, usePopup } from "../components/Popup";

type Params = {
  onSignupClick: () => void;
};
function LoginForm({ onSignupClick }: Params) {
  // States
  const [showPass, setShowPass] = useState(false);
  const [data, setData] = useState<LoginDto>({ userName: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();
  const { alert, Modal } = usePopup();

  const handleData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isLogin = await login(data);
    if (isLogin.isSuccess) {
      navigate("/");
      return;
    }

    await alert(isLogin.message, "Error", PopupType.WARNING);
  };
  const isFilled = data.userName && data.password ? true : false;
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-[50%] p-7.5"
        autoComplete="off"
      >
        <div className="inputs">
          <h1 className="text-[40px] font-bold text-center">Login</h1>
          <div className="user mb-3.75 flex flex-col md:w-[80%]">
            <label className="block mb-1.25 text-[14px]" htmlFor="user-name">
              UserName
            </label>
            <input
              onChange={handleData}
              name="userName"
              className="rounded-[30px] p-2.5 text-[16px] w-full mb-1.25 border border-[#ccc] outline-none"
              type="text"
              id="user-name"
              required
            />
          </div>
          <div className="password mb-3.75 flex flex-col md:w-[80%]">
            <label className="block mb-1.25 text-[14px]" htmlFor="password">
              Password
            </label>
            <input
              onChange={handleData}
              name="password"
              className="rounded-[30px] p-2.5 text-[16px] w-full mb-1.25 border border-[#ccc] outline-none"
              type={showPass ? "text" : "password"}
              id="password"
              required
            />
          </div>
          <div className="show-pass mb-1.25 flex gap-2.5 items-center select-none">
            <input
              onChange={() => setShowPass(!showPass)}
              type="checkbox"
              id="accepte"
            />
            <label htmlFor="accepte" className="text-[13px]">
              Show password
            </label>
          </div>
          <div className="actions md:w-[80%]">
            <input
              className={`rounded-[30px] p-2.5 text-[16px] w-full mb-1.25 transtion-all duration-300
                      outline-none cursor-pointer font-bold ${isFilled ? "btn-primary" : "btn-ghost"}`}
              type="submit"
              value="Login"
            />
          </div>
          <div className="no-account ">
            <p className="text-[14px] text-soft text-center w-[80%] text-nowrap">
              Don't have account?
              <span
                onClick={onSignupClick}
                className="text-soft cursor-pointer font-bold hover:underline"
              >
                Sing up
              </span>
            </p>
          </div>
        </div>
      </form>
      <Modal />
    </>
  );
}

export default LoginForm;
