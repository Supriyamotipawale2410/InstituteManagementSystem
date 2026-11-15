
namespace InstituteManagement.Api.Models;

public class FacultyBatchModule
{
    // Foreign key referencing Faculty
    public int FacultyId { get; set; }

    // Foreign key referencing BatchModule
    public int BatchId { get; set; }

    public int ModuleId { get; set; }

    // Navigation properties
    public Faculty Faculty { get; set; } = null!;

    public BatchModule BatchModule { get; set; } = null!;
}
