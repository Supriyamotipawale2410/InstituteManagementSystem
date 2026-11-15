
using InstituteManagement.Api.Data;
using InstituteManagement.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InstituteManagement.Api.Controller;

[Route("api/[controller]")]
[ApiController]
public class FacultyController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public FacultyController(ApplicationDbContext context)
    {
        _context = context;
    }

    // 1. GET: api/Faculty
    // Get all faculty members
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Faculty>>> GetAllFaculty()
    {
        var faculties = await _context.Faculties.ToListAsync();

        return Ok(faculties);
    }

    // 2. GET: api/Faculty/5
    // Get faculty by ID
    [HttpGet("{id}")]
    public async Task<ActionResult<Faculty>> GetFacultyById(int id)
    {
        var faculty = await _context.Faculties.FindAsync(id);

        if (faculty == null)
        {
            return NotFound("Faculty not found.");
        }

        return Ok(faculty);
    }

    // 3. POST: api/Faculty
    // Add a new faculty member
    [HttpPost]
    public async Task<ActionResult<Faculty>> AddFaculty(Faculty faculty)
    {
        _context.Faculties.Add(faculty);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetFacultyById),
            new { id = faculty.FacultyId },
            faculty
        );
    }

    // 4. PUT: api/Faculty/5
    // Update an existing faculty member
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateFaculty(int id, Faculty updatedFaculty)
    {
        if (id != updatedFaculty.FacultyId)
        {
            return BadRequest("Faculty ID mismatch.");
        }

        var existingFaculty = await _context.Faculties.FindAsync(id);

        if (existingFaculty == null)
        {
            return NotFound("Faculty not found.");
        }

        existingFaculty.FirstName = updatedFaculty.FirstName;
        existingFaculty.LastName = updatedFaculty.LastName;
        existingFaculty.Email = updatedFaculty.Email;
        existingFaculty.PhoneNumber = updatedFaculty.PhoneNumber;
        existingFaculty.Department = updatedFaculty.Department;
        existingFaculty.Specialization = updatedFaculty.Specialization;
        existingFaculty.JoiningDate = updatedFaculty.JoiningDate;
        existingFaculty.IsActive = updatedFaculty.IsActive;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // 5. DELETE: api/Faculty/5
    // Delete faculty only if no module assignments exist
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFaculty(int id)
    {
        var faculty = await _context.Faculties.FindAsync(id);

        if (faculty == null)
        {
            return NotFound("Faculty not found.");
        }

        bool hasAssignments = await _context.FacultyBatchModules
            .AnyAsync(fbm => fbm.FacultyId == id);

        if (hasAssignments)
        {
            return Conflict(
                "This faculty member has module assignments. Deactivate the faculty member instead."
            );
        }

        _context.Faculties.Remove(faculty);

        await _context.SaveChangesAsync();

        return Ok("Faculty deleted successfully.");
    }
}
