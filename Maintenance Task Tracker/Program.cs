using AutoMapper;
using Core.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using Repositories.Data;
using Services.Profiles;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
	options.SwaggerDoc("v1", new OpenApiInfo
	{
		Version = "v1",
		Title = "MainTenance Task Tracker",
		Description = "An ASP.NET Core Web API for managing MainTenance Task Tracker items",
	});
});

builder.Services.AddAutoMapper(typeof(CategoryProfile));


// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
	?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

builder.Services.AddDbContext<AppDbContext>(options =>
options.UseSqlServer(connectionString,
b=> b.MigrationsAssembly("Repositories")));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseExceptionHandler(appError =>
{
	appError.Run(async context =>
	{
		context.Response.ContentType = "application/json";
		var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
		if (contextFeature != null)
		{
			context.Response.StatusCode = contextFeature.Error switch
			{
				AppException ex => (int)ex.ErrorCode,
				_ => StatusCodes.Status500InternalServerError
			};

			await context.Response.WriteAsJsonAsync(new
			{
				message = contextFeature.Error.Message
			});
		}
	});
});

app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
	