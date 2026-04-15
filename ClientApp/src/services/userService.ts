import type {
  UserReponseDto,
  Result,
  PageResult,
  UpdateUserDto,
  AddUserDto,
} from "../types/index";
import apiClent from "../api/apiClient";

type Params = {
  PageNumber: number;
  PageSize: number;
  role?: number;
  searchByUserName?: string;
};

export const userService = {
  deleteUser: async (id: number): Promise<Result> => {
    return apiClent.delete(`/Admin/Delete/${id}`);
  },
  addNewEmployee: async (data: AddUserDto): Promise<Result> => {
    return apiClent.post("/Admin/CreateEmployeeAsync", data);
  },
  updateUser: async (id: number, data: UpdateUserDto): Promise<Result> => {
    console.log(data);
    return apiClent.put(`/Admin/UpdateUser/${id}`, data);
  },
  users: async ({
    PageNumber,
    PageSize,
    role,
    searchByUserName,
  }: Params): Promise<Result<PageResult<UserReponseDto>>> => {
    return apiClent.get("/Admin/Users", {
      params: {
        pageNumber: PageNumber,
        pageSize: PageSize,
        roleId: role,
        searchByUserName: searchByUserName,
      },
    });
  },
};
