
namespace InstituteManagement.Api.Models;

public class BatchModule
{
    // Foreign key pointing to Batch
    public int BatchId { get; set; }

    // Foreign key pointing to Module
    public int ModuleId { get; set; }

    // Navigation properties
    public Batch Batch { get; set; } = null!;

    public Module Module { get; set; } = null!;
}
