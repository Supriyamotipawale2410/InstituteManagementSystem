
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

    public DbSet<User> Users { get; set; }

    public DbSet<Batch> Batches { get; set; }

    public DbSet<Module> Modules { get; set; }

    public DbSet<BatchModule> BatchModules { get; set; }

    public DbSet<Faculty> Faculties { get; set; }

    public DbSet<FacultyBatchModule> FacultyBatchModules { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User email must be unique.
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Composite primary key for BatchModule.
        modelBuilder.Entity<BatchModule>()
            .HasKey(bm => new { bm.BatchId, bm.ModuleId });

        // Batch relationship.
        modelBuilder.Entity<BatchModule>()
            .HasOne(bm => bm.Batch)
            .WithMany(b => b.BatchModules)
            .HasForeignKey(bm => bm.BatchId)
            .OnDelete(DeleteBehavior.Restrict);

        // Module relationship.
        modelBuilder.Entity<BatchModule>()
            .HasOne(bm => bm.Module)
            .WithMany(m => m.BatchModules)
            .HasForeignKey(bm => bm.ModuleId)
            .OnDelete(DeleteBehavior.Restrict);


        // FacultyBatchModule composite primary key
        modelBuilder.Entity<FacultyBatchModule>()
            .HasKey(fbm => new
            {
                fbm.FacultyId,
                fbm.BatchId,
                fbm.ModuleId
            });

        // Faculty relationship
        modelBuilder.Entity<FacultyBatchModule>()
            .HasOne(fbm => fbm.Faculty)
            .WithMany(f => f.FacultyBatchModules)
            .HasForeignKey(fbm => fbm.FacultyId)
            .OnDelete(DeleteBehavior.Restrict);

        // BatchModule relationship
        modelBuilder.Entity<FacultyBatchModule>()
            .HasOne(fbm => fbm.BatchModule)
            .WithMany()
            .HasForeignKey(fbm => new
            {
                fbm.BatchId,
                fbm.ModuleId
            })
            .OnDelete(DeleteBehavior.Restrict);
    }
}
