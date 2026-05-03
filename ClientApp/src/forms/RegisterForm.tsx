import {
    faEnvelope,
    faUnlock,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import type {RegisterDto} from "../types";
import React, {useState} from "react";
import {useAuth} from "../hooks/useAuth";
import {PopupType, usePopup} from "../components/Popup";
import {ArrowLeft, ArrowRight} from "lucide-react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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

type Props = {
    show: boolean;
    onBackClick: () => void;
};

function RegisterForm({show = false, onBackClick}: Props) {
    const [data, setData] = useState<RegisterDto | null>(null);
    const {register, loading} = useAuth();
    const {alert, Modal} = usePopup();

    const handleData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setData((prev) => ({...(prev as RegisterDto), [name]: value}));
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!data) return;

        const result = await register(data);
        if (result.isSuccess) {
            await alert(result.message, "Registration Successful", PopupType.INFO);
            onBackClick();
            return;
        }

        await alert(result.message, "Registration Failed", PopupType.WARNING);
    };

    const isFilled = !!(
        data?.firstName?.trim() &&
        data?.lastName?.trim() &&
        data?.email?.trim() &&
        data?.userName?.trim() &&
        data?.password?.trim()
    );

    return (
        <div
            className={`w-full max-w-md mx-auto transition-all duration-500 ease-in-out ${
                show
                    ? "opacity-0 pointer-events-none translate-x-12"
                    : "opacity-100 translate-x-0"
            }`}
        >
            <button
                type="button"
                onClick={onBackClick}
                className="flex items-center gap-2 text-sub hover:text-primary transition-all mb-6 group"
            >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform"/>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Sign In</span>
            </button>

            <header className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
                <p className="text-sub text-xs mt-2 font-medium">Please fill in the details below.</p>
            </header>

            <form onSubmit={handleSignup} className="grid grid-cols-2 gap-x-4 gap-y-5">
                {INPUTS.map((input) => (
                    <div key={input.id}
                         className={`${input.name === "email" ? "col-span-2" : "col-span-1"} flex flex-col gap-1.5`}>
                        <label className="text-[9px] font-black uppercase tracking-widest text-sub/50 ml-1">
                            {input.placeholder}
                        </label>
                        <div className="relative group">
                            <input
                                onChange={handleData}
                                name={input.name}
                                type={input.type}
                                placeholder={`e.g. ${input.placeholder}`}
                                className="w-full bg-muted/20 border border-border px-4 py-3 rounded-xl text-sm outline-none 
                                           focus:border-primary/50 focus:bg-muted/40 transition-all placeholder:text-sub/10"
                                required
                            />
                         <FontAwesomeIcon icon={input.icon} className="absolute right-4 top-1/2 -translate-y-1/2 text-sub/20 pointer-events-none"/>
                        </div>
                    </div>
                ))}

                <div className="col-span-2 mt-4">
                    <button
                        type="submit"
                        disabled={!isFilled || loading}
                        className={`w-full py-3.5 rounded-xl shadow-xl flex justify-center items-center gap-3 transition-all duration-300 ${
                            isFilled && !loading
                                ? "bg-primary text-primary-foreground shadow-primary/20 hover:opacity-90 active:scale-[0.98]"
                                : "bg-muted/50 text-sub/30 border border-border cursor-not-allowed shadow-none"
                        }`}
                    >
                        <span>{loading ? "Processing..." : "Register Account"}</span>
                        {!loading && <ArrowRight size={18}/>}
                    </button>
                </div>
            </form>
            <Modal/>
        </div>
    );
}

export default RegisterForm;
