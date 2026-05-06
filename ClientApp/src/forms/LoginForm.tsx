import {useState} from "react";
import {useAuth} from "../hooks/useAuth";
import type {LoginDto} from "../types";
import {useNavigate} from "react-router-dom";
import {PopupType, usePopup} from "../components/Popup";
import {User, Lock, Eye, EyeOff} from "lucide-react";

type Params = {
    onSignupClick: () => void;
};

function LoginForm({onSignupClick}: Params) {
    const [showPass, setShowPass] = useState(false);
    const [data, setData] = useState<LoginDto>({userName: "", password: ""});
    const {login} = useAuth();
    const navigate = useNavigate();
    const {alert, Modal} = usePopup();

    const handleData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const result = await login(data);
            if (result.isSuccess) {
                navigate("/");
                return;
            }
            await alert(result.message, "Authentication Failed", PopupType.WARNING);
        } catch (error) {
            console.error("Login Error:", error);
        }
    };

    const isFilled = !!(data.userName && data.password);

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col justify-center h-full animate-in fade-in slide-in-from-left-4 duration-500"
                autoComplete="off"
            >
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Login</h1>
                    <p className="text-sub text-sm">Enter your credentials to access your account.</p>
                </header>

                <div className="space-y-5">
                    {/* Username Field */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-sub ml-1"
                               htmlFor="user-name">
                            Username
                        </label>
                        <div className="relative group">
                            <User
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-sub/40 group-focus-within:text-primary transition-colors"
                                size={18}/>
                            <input
                                onChange={handleData}
                                name="userName"
                                className="w-full bg-muted/30 border border-border pl-11 pr-4 py-3 rounded-xl text-sm outline-none focus:border-primary/50 transition-all placeholder:text-sub/20"
                                type="text"
                                id="user-name"
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[11px] font-black uppercase tracking-widest text-sub"
                                   htmlFor="password">
                                Password
                            </label>
                        </div>
                        <div className="relative group">
                            <Lock
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-sub/40 group-focus-within:text-primary transition-colors"
                                size={18}/>
                            <input
                                onChange={handleData}
                                name="password"
                                className="w-full bg-muted/30 border border-border pl-11 pr-12 py-3 rounded-xl text-sm outline-none focus:border-primary/50 transition-all placeholder:text-sub/20"
                                type={showPass ? "text" : "password"}
                                id="password"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-sub/40 hover:text-sub transition-colors"
                            >
                                {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                            </button>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={!isFilled}
                            className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg ${
                                isFilled
                                    ? "bg-primary text-primary-foreground shadow-primary/20 hover:opacity-90 active:scale-[0.98]"
                                    : "bg-muted text-sub cursor-not-allowed border border-border"
                            }`}
                        >
                            Sign In
                        </button>
                    </div>

                    {/* Footer */}
                    <p className="text-sm text-sub text-center mt-6">
                        Don't have an account?{" "}
                        <button
                            type="button"
                            onClick={onSignupClick}
                            className="text-main font-bold hover:underline transition-all"
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </form>
            <Modal/>
        </>
    );
}

export default LoginForm;