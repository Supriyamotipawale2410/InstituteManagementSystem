
using System.ComponentModel.DataAnnotations;

namespace InstituteManagement.Api.Models;

public class Batch
{
    public int BatchId { get; set; }

    [Required]
    [StringLength(100)]
    public string BatchName { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public bool IsActive { get; set; } = true;

    // Navigation property:
    // One batch can have multiple module assignments.
    public ICollection<BatchModule> BatchModules { get; set; }
        = new List<BatchModule>();
}
