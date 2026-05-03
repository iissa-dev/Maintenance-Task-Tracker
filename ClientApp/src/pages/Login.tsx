import {useState} from "react";
import LoginForm from "../forms/LoginForm.tsx";
import RegisterForm from "../forms/RegisterForm.tsx";
import LoginImage from  "../assets/images/undraw_decide_g91m.svg"
function Login() {
    const [showLogin, setShowLogin] = useState(true);

    
    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-background">
            {/* Increased max-width to give the registration grid more horizontal room */}
            <div className="relative w-full max-w-5xl min-h-150 bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

                {/* Sliding Form Section */}
                <div className="w-full md:w-1/2 relative overflow-hidden bg-card">
                    <div
                        className={`flex w-[200%] h-full transition-transform duration-500 ease-in-out ${
                            !showLogin ? "-translate-x-1/2" : "translate-x-0"
                        }`}
                    >
                        {/* Login View */}
                        <div className="w-1/2 p-8 md:p-14 flex flex-col justify-center">
                            <LoginForm onSignupClick={() => setShowLogin(false)} />
                        </div>

                        {/* Register View */}
                        <div className="w-1/2 p-8 md:p-14 flex flex-col justify-center">
                            <RegisterForm
                                show={showLogin}
                                onBackClick={() => setShowLogin(true)}></RegisterForm>
                        </div>
                    </div>
                </div>

                {/* Static Illustration Side */}
                <div className="hidden md:flex md:w-1/2 bg-muted/10 items-center justify-center p-12 border-l border-border/50">
                    <div className="relative w-full max-w-87.5 text-center">
                        <img src={LoginImage} alt="Auth" className="w-full drop-shadow-2xl mb-8" />
                        <h2 className="text-3xl font-bold gradient-text">Maintenance Pro</h2>
                        <p className="text-sub text-sm mt-3 leading-relaxed">
                            Streamline your facility management and task tracking in one secure place.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Login;