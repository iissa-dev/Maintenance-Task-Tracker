using Core.Enums;

namespace Core.Exceptions
{
	public class AppException : Exception
	{
		public AppError ErrorCode;
		public AppException(AppError errorCode, string Message)
			: base(Message)
		{
			ErrorCode = errorCode;
		}

		public AppException(AppError errorCode, string message, Exception innerException)
	  : base(message, innerException)
		{
			ErrorCode = errorCode;
		}
	}
}
