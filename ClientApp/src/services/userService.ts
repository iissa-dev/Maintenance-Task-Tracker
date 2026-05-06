import type {
    UserResponseDto,
    Result,
    PageResult,
    UpdateUserDto,
    AddUserDto,
} from "../types/index";
import apiClient from "../api/apiClient";

type Params = {
    PageNumber: number;
    PageSize: number;
    role?: number;
    searchByUserName?: string;
};

export const userService = {
    deleteUser: async (id: number): Promise<Result> => {
        return apiClient.delete(`/Admin/Delete/${id}`);
    },
    addNewEmployee: async (data: AddUserDto): Promise<Result> => {
        return apiClient.post("/Admin/CreateEmployeeAsync", data);
    },
    updateUser: async (id: number, data: UpdateUserDto): Promise<Result> => {
        return apiClient.put(`/Admin/UpdateUser/${id}`, data);
    },
    users: async ({
                      PageNumber,
                      PageSize,
                      role,
                      searchByUserName,
                  }: Params): Promise<Result<PageResult<UserResponseDto>>> => {
        return apiClient.get("/Admin/Users", {
            params: {
                pageNumber: PageNumber,
                pageSize: PageSize,
                roleId: role,
                searchByUserName: searchByUserName,
            },
        });
    },
};
