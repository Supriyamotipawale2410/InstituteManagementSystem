
using InstituteManagement.Api.Data;
using InstituteManagement.Api.DTOs;
using InstituteManagement.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InstituteManagement.Api.Controller;

[Route("api/[controller]")]
[ApiController]
public class FacultyBatchModuleController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public FacultyBatchModuleController(ApplicationDbContext context)
    {
        _context = context;
    }

    // POST: api/FacultyBatchModule/assign
    [HttpPost("assign")]
    public async Task<IActionResult> AssignFaculty(
        AssignFacultyDto dto)
    {
        // Check faculty exists
        var faculty = await _context.Faculties
            .FindAsync(dto.FacultyId);

        if (faculty == null)
        {
            return NotFound("Faculty not found");
        }

        // Check whether batch-module combination exists
        var batchModule = await _context.BatchModules
            .FindAsync(dto.BatchId, dto.ModuleId);

        if (batchModule == null)
        {
            return NotFound(
                "This module is not assigned to the specified batch"
            );
        }

        // Check duplicate assignment
        var alreadyAssigned = await _context.FacultyBatchModules
            .AnyAsync(fbm =>
                fbm.FacultyId == dto.FacultyId &&
                fbm.BatchId == dto.BatchId &&
                fbm.ModuleId == dto.ModuleId);

        if (alreadyAssigned)
        {
            return Conflict(
                "Faculty is already assigned to this batch and module"
            );
        }

        var assignment = new FacultyBatchModule
        {
            FacultyId = dto.FacultyId,
            BatchId = dto.BatchId,
            ModuleId = dto.ModuleId
        };

        _context.FacultyBatchModules.Add(assignment);

        await _context.SaveChangesAsync();

        return Ok("Faculty assigned successfully");
    }

    // GET: api/FacultyBatchModule/faculty/1
    [HttpGet("faculty/{facultyId}")]
    public async Task<IActionResult> GetAssignmentsByFaculty(
        int facultyId)
    {
        var faculty = await _context.Faculties
            .FindAsync(facultyId);

        if (faculty == null)
        {
            return NotFound("Faculty not found");
        }

        var assignments = await _context.FacultyBatchModules
            .Where(fbm => fbm.FacultyId == facultyId)
            .Join(
                _context.BatchModules
                    .Include(bm => bm.Batch)
                    .Include(bm => bm.Module),
                fbm => new { fbm.BatchId, fbm.ModuleId },
                bm => new { bm.BatchId, bm.ModuleId },
                (fbm, bm) => new
                {
                    fbm.FacultyId,
                    bm.BatchId,
                    bm.Batch.BatchName,
                    bm.ModuleId,
                    bm.Module.ModuleName
                }
            )
            .ToListAsync();

        return Ok(assignments);
    }

    // DELETE: api/FacultyBatchModule/remove/1/1/2
    [HttpDelete("remove/{facultyId}/{batchId}/{moduleId}")]
    public async Task<IActionResult> RemoveAssignment(
        int facultyId, int batchId, int moduleId)
    {
        var assignment = await _context.FacultyBatchModules
            .FindAsync(facultyId, batchId, moduleId);

        if (assignment == null)
        {
            return NotFound("Faculty assignment not found");
        }

        _context.FacultyBatchModules.Remove(assignment);

        await _context.SaveChangesAsync();

        return Ok("Faculty assignment removed successfully");
    }
}
