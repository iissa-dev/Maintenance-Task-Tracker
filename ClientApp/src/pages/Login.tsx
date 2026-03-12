import { useState } from "react";
import LoginForm from "../forms/LoginForm";
import LoginImage from "../assets/images/undraw_enter-password_1kl4 (1).svg";
import RegisterForm from "../forms/RegisterForm";
function Login() {
  const [showLogin, setShowLogin] = useState(true);
  return (
    <main className="relative min-h-screen">
      <div
        className="md:grid md:grid-cols-2 gap-2.5 rounded-[20px] absolute bg-(--color-background) md:w-200 border neon-border
      left-[50%] top-[50%] translate-[-50%] overflow-hidden z-1"
      >
        <div
          className={`froms flex w-[200%] transition-all duration-500 ease-in-out ${!showLogin && "translate-x-[-50%]"}`}
        >
          <LoginForm onSignupClick={() => setShowLogin(false)} />
          <RegisterForm
            show={showLogin}
            onBackClick={() => setShowLogin(true)}
          />
        </div>
        <img
          className="object-cover hidden md:block absolute top-[50%] right-2.5 translate-y-[-50%]"
          width={"350px"}
          src={LoginImage}
          alt="Login Image"
        />
      </div>
    </main>
  );
}

export default Login;
