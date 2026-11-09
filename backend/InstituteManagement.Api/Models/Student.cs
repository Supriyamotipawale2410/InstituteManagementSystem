
using System.ComponentModel.DataAnnotations;

namespace InstituteManagement.Api.Models;

public class Student
{
    public int StudentId { get; set; }

    [Required]
    [StringLength(50)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(100)]
    public string Email { get; set; } = string.Empty;

    [StringLength(15)]
    public string? PhoneNumber { get; set; }

    public DateTime DateOfBirth { get; set; }

    public DateTime AdmissionDate { get; set; }
}
