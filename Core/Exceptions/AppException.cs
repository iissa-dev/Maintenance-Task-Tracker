using Core.Enums;

namespace Core.Exceptions
{
	/// <summary>
	/// Represents errors that occur during application execution and includes an application-specific error code.
	/// </summary>
	/// <remarks>Use this exception to provide additional context about application errors by specifying an error
	/// code alongside the standard exception message. The error code can be used to categorize or handle errors in a more
	/// granular way than standard exceptions allow.</remarks>
	public class AppException : Exception
	{
		/// <summary>
		/// Represents the application-specific error code associated with the current operation.
		/// </summary>
		public AppError ErrorCode;

		/// <summary>
		/// Initializes a new instance of the AppException class with a specified error code and error message.
		/// </summary>
		/// <param name="errorCode">The error code that identifies the specific application error.</param>
		/// <param name="Message">The message that describes the error.</param>
		public AppException(AppError errorCode, string Message)
			: base(Message)
		{
			ErrorCode = errorCode;
		}

		/// <summary>
		/// Initializes a new instance of the AppException class with a specified error code, error message, and a reference
		/// to the inner exception that is the cause of this exception.
		/// </summary>
		/// <param name="errorCode">The application-specific error code that identifies the type of error.</param>
		/// <param name="message">The message that describes the error.</param>
		/// <param name="innerException">The exception that is the cause of the current exception, or null if no inner exception is specified.</param>
		public AppException(AppError errorCode, string message, Exception innerException)
	  : base(message, innerException)
		{
			ErrorCode = errorCode;
		}
	}
}
