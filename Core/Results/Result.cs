using Core.Enums;

public class Result
{
	public bool IsSuccess { get; protected set; }
	public string? Message { get; protected set; }
	public AppError? ErrorCode { get; protected set; }

	public static Result Success(string? message = null)
		=> new()
		{
			IsSuccess = true,
			Message = message ?? "Operation completed successfully."
		};

	public static Result Failure(string message, AppError errorCode)
		=> new()
		{
			IsSuccess = false,
			Message = message,
			ErrorCode = errorCode
		};
}

public class Result<T> : Result
{
	public T? Data { get; private set; }

	public static Result<T> Success(T data, string? message = null)
		=> new()
		{
			IsSuccess = true,
			Data = data,
			Message = message ?? "Operation completed successfully."
		};

	public static new Result<T> Failure(string message, AppError errorCode)
		=> new()
		{
			IsSuccess = false,
			Message = message,
			ErrorCode = errorCode
		};
}