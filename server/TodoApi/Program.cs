using Microsoft.EntityFrameworkCore;
using TodoApi.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",    // React dev server
                "http://localhost:5173",    // Vite dev server
                "http://localhost:4173"     // Vite preview
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// If using EF Core + PostgreSQL (optional, only if you've done this)
builder.Services.AddDbContext<TodoContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("TodoDb")));

var app = builder.Build();

// Configure the HTTP request pipeline
app.UseHttpsRedirection();

// Use CORS middleware (must be before UseAuthorization and MapControllers)
app.UseCors("AllowReactApp");

app.MapControllers(); // Enables your [ApiController] routes

app.Run();
