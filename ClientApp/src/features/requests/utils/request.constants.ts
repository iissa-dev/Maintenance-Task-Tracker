import type {ResponseRequestDto, UserResponseDto} from "../../../types";

export function getStatusStyle(status: string) {
    switch (status) {
        case "Completed":
            return "bg-success/10 text-success border-success/20";
        case "InProgress":
            return "bg-warning/10 text-warning border-warning/20";
        default:
            return "bg-primary/10 text-main border-primary/20";
    }
}

export const RequestStatus = {
    Pending: 0,
    InProgress: 1,
    Completed: 2,
} as const;

export const STATUS_LABELS = {
    [RequestStatus.Pending]: "Pending",
    [RequestStatus.InProgress]: "InProgress",
    [RequestStatus.Completed]: "Completed",
} as const;


export type RequestCardProps = {
    requests: ResponseRequestDto[];
    employees: UserResponseDto[];
    onRemoveRequest: (requestId: number) => void;
    onGoNext: () => void;
    onGoBack: () => void;
    onAssignTask: (requestId: number, employeeId: number, employeeName: string) => Promise<void>;
    onCategoryIdSelect: (categoryId: number) => void;
}

export type RequestItemProps = {
    request: ResponseRequestDto;
    employees: UserResponseDto[];
    role: string;
    onRemoveRequest: (requestId: number) => void;
    onAssignTask: (requestId: number, employeeId: number, employeeName: string) => Promise<void>;
}