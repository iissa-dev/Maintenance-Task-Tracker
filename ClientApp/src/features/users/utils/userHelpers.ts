import type { UserResponseDto } from "../../../types";

export const prepareUserDataForEdit = (user: UserResponseDto) => {
  const [firstName, ...rest] = user?.fullName?.split(" ") ?? [];
  return {
    firstName,
    lastName: rest.join(" "),
    email: user?.email ?? "",
    userName: user?.userName ?? "",
    phoneNumber: user?.phoneNumber ?? ""
  };
};