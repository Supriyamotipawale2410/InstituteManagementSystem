
using System.ComponentModel.DataAnnotations;

namespace InstituteManagement.Api.Models;

public class Module
{
    public int ModuleId { get; set; }

    [Required]
    [StringLength(100)]
    public string ModuleName { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;

    // One module can be assigned to multiple batches.
    public ICollection<BatchModule> BatchModules { get; set; }
        = new List<BatchModule>();
}
