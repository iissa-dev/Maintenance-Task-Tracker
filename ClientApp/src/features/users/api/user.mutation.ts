import type { AddUserDto, UpdateUserDto } from "../../../types";
import {
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import { userService } from "../../../services/userService";
import { handleResponse } from "../../../utils/handleResponse";
import { useGenericMutation, type alertType } from "../../../utils/mutationFactory";

type userProps = {
  PageNumber: number;
  PageSize: number;
  role: number;
  appliedSearch?: string;
};

export const useUsers = ({
  PageNumber,
  PageSize,
  role,
  appliedSearch,
}: userProps) => {
  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["users", appliedSearch, PageNumber, role],
    queryFn: () =>
      userService.users({
        PageNumber,
        PageSize,
        role,
        searchByUserName: appliedSearch,
      }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  return {
    users: data?.data?.items ?? [],
    totalCount: data?.data?.totalPages ?? 0,
    isLoading,
    isPlaceholderData,
  };
};

export const useUpdateUser = (onClose : () => void, {alert}: alertType ) => {
  const mutation = useGenericMutation<
    { id: number; data: UpdateUserDto },
    void
  >(
    (data) => handleResponse(userService.updateUser(data.id, data.data)),
    ["users", "user-profile"],
    {alert},
    "User Updated Successfully",
    onClose,
  );
  return mutation;
};

export const useAddUser = (onClose : () => void, {alert}: alertType ) => {
  const mutation = useGenericMutation<AddUserDto, void>(
    (data) => handleResponse(userService.addNewEmployee(data)),
    ["users"],
    {alert},
    "User Added Successfully",
    onClose,
  );
  return mutation;
};

export const useDeleteUser = ({ alert }: alertType) => {
  const mutation = useGenericMutation<number, void>(
    (data) => handleResponse(userService.deleteUser(data)),
    ["users"],
    {alert},
    "User Deleted Successfully",
  );
  return mutation;
};

export const useProfile = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => await userService.getProfile(),
    staleTime: 1000 * 60 * 10,
  });

  return {
    user: data?.data,
    isLoading,
    error,
  };
};
