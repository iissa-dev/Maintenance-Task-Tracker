namespace Core.Entities
{
	public class Person
	{
		public int Id { get; set; }
		public string FirstName { get; set; } = string.Empty;
		public string SecondName { get; set; } = string.Empty;
		public string ThirdName { get; set; } = string.Empty;
		public string LatestName { get; set; } = string.Empty;
		public string PhoneNumber { get; set; } = string.Empty;
		public DateTime BirthDate { get; set; }

		public int UserId { get; set; }
		public ApplicationUser User { get; set; } = new ApplicationUser();
	}
}
