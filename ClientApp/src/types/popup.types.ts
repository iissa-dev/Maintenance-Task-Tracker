export const PopupType = {
    INFO: "info",
    DANGER: "danger",
    WARNING: "warning",
} as const;

export type PopupTypeValue = (typeof PopupType)[keyof typeof PopupType];

type Mode = "confirm" | "alert";

export type PopupState = {
    message: string;
    title: string;
    type: PopupTypeValue;
    resolve: (value: boolean) => void;
    mode: Mode;
};