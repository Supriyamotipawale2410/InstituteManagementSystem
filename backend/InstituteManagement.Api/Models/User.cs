using System.ComponentModel.DataAnnotations;
namespace InstituteManagement.Api.Models;

public class User
{

    public int UserId { get; set; }

    [Required]
    [StringLength(100)]
    public string FullName {  get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(100)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    [StringLength(20)]
    public string Role { get; set; } = "Student";

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}