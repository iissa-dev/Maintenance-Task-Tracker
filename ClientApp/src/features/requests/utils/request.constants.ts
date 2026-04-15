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
