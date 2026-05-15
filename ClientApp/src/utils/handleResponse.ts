import type { Result } from "../types";

export const handleResponse = async <T>(promise: Promise<Result<T>>) => {
  const res = await promise;
  if (!res.isSuccess) throw new Error(res?.message);
  return res;
};