
using InstituteManagement.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace InstituteManagement.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Student> Students { get; set; }
}
