using Api.Data;
using Application.DependencyInjection;
using Domain.Exceptions;
using Infrastructure.DependencyInjection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
	options.AddPolicy("ReactAppPolicy", policy =>
	{
		policy.WithOrigins("http://localhost:5173", "http://localhost:5174")
			  .AllowAnyMethod()
			  .AllowAnyHeader()
			  .AllowCredentials();
	});
});

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
	options.SwaggerDoc("v1", new OpenApiInfo
	{
		Version = "v1",
		Title = "Maintenance Task Tracker",
		Description = "An ASP.NET Core Web API for managing Maintenance Task Tracker items",
	});
});


builder.Services.AddRepositoriesServiceExtensions(builder.Configuration);
builder.Services.AddApplicationsServices();


// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();


builder.Services.AddAuthentication(options =>
{
	options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
	options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
	options.TokenValidationParameters = new TokenValidationParameters
	{
		ValidateIssuer = true,
		ValidateAudience = true,
		ValidateLifetime = true,
		ValidateIssuerSigningKey = true,
		ValidIssuer = builder.Configuration["Jwt:Issuer"],
		ValidAudience = builder.Configuration["Jwt:Audience"],
		IssuerSigningKey = new SymmetricSecurityKey(
			Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]!))
	};
});

var app = builder.Build();

await app.Services.SeedAsync();



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
				isSuccess = false,
				message = contextFeature.Error.Message
			});
		}
	});
});

app.UseDefaultFiles();

app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("ReactAppPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("index.html");

app.Run();