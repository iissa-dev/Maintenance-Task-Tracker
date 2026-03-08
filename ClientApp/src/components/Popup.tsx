import {
  faCircleInfo,
  faCircleXmark,
  faXmark,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import "./Popup.css";

export const PopupType = {
  INFO: "info",
  DANGER: "danger",
  WARNING: "warning",
} as const;

type PopupTypeValue = (typeof PopupType)[keyof typeof PopupType];

type Mode = "confirm" | "alert";

type PopupState = {
  message: string;
  title: string;
  type: PopupTypeValue;
  resolve: (value: boolean) => void;
  mode: Mode;
};

function handleTypeIcon(type: PopupTypeValue) {
  if (type === PopupType.INFO) return <FontAwesomeIcon icon={faCircleInfo} />;

  if (type === PopupType.WARNING)
    return <FontAwesomeIcon icon={faTriangleExclamation} />;

  if (type === PopupType.DANGER) return <FontAwesomeIcon icon={faXmark} />;

  return null;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePopup() {
  const [state, setState] = useState<PopupState | null>(null);

  const confirm = (
    message: string,
    title: string,
    type: PopupTypeValue,
  ): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setState({ message, title, type, resolve, mode: "confirm" });
    });
  };

  const alert = (
    message: string,
    title: string,
    type: PopupTypeValue,
  ): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setState({ message, title, type, resolve, mode: "alert" });
    });
  };

  const handle = (result: boolean) => {
    if (!state) return;
    state.resolve(result);
    setState(null);
  };

  const Modal = () => {
    if (!state) return null;

    return (
      <>
        <div className="overlay fixed inset-0 bg-black/25 backdrop-blur-[2px] z-1000" />

        <div className="popap-container fixed inset-0 flex justify-center items-center z-1001">
          <div className="content bg-primary/10 p-5 w-100 rounded-[10px] backdrop-blur-[5px]">
            <div className="mb-5 text-white font-bold text-shadow-sm">
              {state.title}
            </div>

            <div className="" onClick={() => handle(false)}>
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="bg-danger/10 text-danger absolute -top-3.5 -right-3.5 cursor-pointer text-[25px] border border-white rounded-full w-6! h-6!"
              />
            </div>

            <div className="status-icon">{handleTypeIcon(state.type)}</div>

            <p className="mes text-shadow-sm mb-5 text-white font-bold">
              {state.message}
            </p>

            <div className="btns flex justify-end gap-2.5">
              {state.mode === "confirm" && (
                <input
                  onClick={() => handle(false)}
                  className="btn-danger"
                  type="button"
                  value="Cancel"
                />
              )}

              <input
                onClick={() => handle(true)}
                className="btn-primary"
                type="button"
                value="Ok"
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  return { confirm, alert, Modal };
}
