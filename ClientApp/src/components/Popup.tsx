import {
    faCircleInfo,
    faXmark,
    faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";
import "./Popup.css";
import {createPortal} from "react-dom";

export const PopupType = {
    INFO: "info",
    DANGER: "danger",
    WARNING: "warning",
} as const;

export type PopupTypeValue = (typeof PopupType)[keyof typeof PopupType];

type Mode = "confirm" | "alert";

type PopupState = {
    message: string;
    title: string;
    type: PopupTypeValue;
    resolve: (value: boolean) => void;
    mode: Mode;
};

function handleTypeIcon(type: PopupTypeValue) {
    if (type === PopupType.INFO) return <FontAwesomeIcon icon={faCircleInfo}/>;

    if (type === PopupType.WARNING)
        return <FontAwesomeIcon icon={faTriangleExclamation}/>;

    if (type === PopupType.DANGER) return <FontAwesomeIcon icon={faXmark}/>;

    return null;
}

export function usePopup() {
    const [state, setState] = useState<PopupState | null>(null);

    const confirm = (message: string, title: string, type: PopupTypeValue): Promise<boolean> => {
        return new Promise<boolean>((resolve) => {
            setState({message, title, type, resolve, mode: "confirm"});
        });
    };

    const alert = (message: string, title: string, type: PopupTypeValue): Promise<boolean> => {
        return new Promise<boolean>((resolve) => {
            setState({message, title, type, resolve, mode: "alert"});
        });
    };

    const handle = (result: boolean) => {
        if (!state) return;
        state.resolve(result);
        setState(null);
    };

    const Modal = () => {
        if (!state) return null;

        const iconColor = state.type === "danger" ? "text-danger" :
            state.type === "warning" ? "text-warning" : "text-primary";

        return createPortal(
            <>
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-2000"
                     onClick={() => handle(false)}/>

                <div className="fixed inset-0 flex justify-center items-center z-2001 pointer-events-none p-4">
                    <div
                        className="bg-card border border-border p-8 w-full max-w-sm rounded-2xl shadow-2xl pointer-events-auto animate-in zoom-in-95 duration-200">

                        <div className="flex flex-col items-center text-center mb-6">
                            <div className={`text-4xl mb-4 ${iconColor} opacity-90`}>
                                {handleTypeIcon(state.type)}
                            </div>
                            <h3 className="text-xl font-bold text-main tracking-tighter uppercase">
                                {state.title}
                            </h3>
                        </div>

                        <p className="text-sub text-center font-medium leading-relaxed mb-8 px-2">
                            {state.message}
                        </p>

                        <div className="flex gap-3">
                            {state.mode === "confirm" && (
                                <button
                                    onClick={() => handle(false)}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sub font-bold text-sm hover:bg-muted/50 transition-all"
                                >
                                    Cancel
                                </button>
                            )}

                            <button
                                onClick={() => handle(true)}
                                className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all ${
                                    state.type === "danger"
                                        ? "bg-danger text-white shadow-danger/20 hover:bg-danger/90"
                                        : "bg-primary text-white shadow-primary/20 hover:bg-primary/90"
                                }`}
                            >
                                {state.mode === "confirm" ? "Confirm" : "Understood"}
                            </button>
                        </div>
                    </div>
                </div>
            </>,
            document.body,
        );
    };

    return {confirm, alert, Modal};
}