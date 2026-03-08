using Core.Entities;
using Core.Exceptions;
using Core.Interfaces.Repository;
using Core.Interfaces.Service;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using Repositories;
using Repositories.Data;
using Services;
using Services.Profiles;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(optoins =>
{
	optoins.AddPolicy("ReactAppPolicy", policy =>
	{
		policy.WithOrigins("http://localhost:5173")
			  .AllowAnyMethod()
			  .AllowAnyHeader();
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
		Title = "MainTenance Task Tracker",
		Description = "An ASP.NET Core Web API for managing MainTenance Task Tracker items",
	});
});

builder.Services.AddAutoMapper(typeof(CategoryProfile));
builder.Services.AddAutoMapper(typeof(RequestProfile));

builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IRequestService, RequestService>();
builder.Services.AddScoped<IRequestRepository, RequestRepository>();
builder.Services.AddScoped<ICategoryService, CategoryServcie>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();

builder.Services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
{
	options.Password.RequireDigit = true;
	options.Password.RequiredLength = 8;
	options.Password.RequireNonAlphanumeric = false;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();
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

app.UseDefaultFiles();

app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("ReactAppPolicy");

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("index.html");

app.Run();