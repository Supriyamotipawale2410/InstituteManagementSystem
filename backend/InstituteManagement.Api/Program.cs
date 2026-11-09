
using Microsoft.EntityFrameworkCore;
using InstituteManagement.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Register controllers
builder.Services.AddControllers();

// Configure Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure SQL Server Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Map controller APIs
app.MapControllers();

// Home endpoint
app.MapGet("/", () =>
    "Institute Management System API is running.");

// Database connection check
app.MapGet("/db-check", async (ApplicationDbContext db) =>
{
    bool isConnected = await db.Database.CanConnectAsync();

    return isConnected
        ? Results.Ok("SQL Server Database Connected Successfully!")
        : Results.Problem("Database connection failed.");
});

app.Run();
