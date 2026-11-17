
using InstituteManagement.Api.Data;
using InstituteManagement.Api.DTOs;
using InstituteManagement.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InstituteManagement.Api.Controller;

[Route("api/[controller]")]
[ApiController]
public class BatchModuleController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BatchModuleController(ApplicationDbContext context)
    {
        _context = context;
    }

    // POST: api/BatchModule/assign
    [HttpPost("assign")]
    public async Task<IActionResult> AssignModule(
        AssignModuleDto dto)
    {
        // Check whether batch exists
        var batch = await _context.Batches
            .FindAsync(dto.BatchId);

        if (batch == null)
        {
            return NotFound("Batch not found");
        }

        // Check whether module exists
        var module = await _context.Modules
            .FindAsync(dto.ModuleId);

        if (module == null)
        {
            return NotFound("Module not found");
        }

        // Check duplicate assignment
        var alreadyAssigned = await _context.BatchModules
            .AnyAsync(bm =>
                bm.BatchId == dto.BatchId &&
                bm.ModuleId == dto.ModuleId);

        if (alreadyAssigned)
        {
            return Conflict("Module is already assigned to this batch");
        }

        // Create relationship
        var batchModule = new BatchModule
        {
            BatchId = dto.BatchId,
            ModuleId = dto.ModuleId
        };

        _context.BatchModules.Add(batchModule);

        await _context.SaveChangesAsync();

        return Ok("Module assigned to batch successfully");
    }

    // GET: api/BatchModule/batch/1
    [HttpGet("batch/{batchId}")]
    public async Task<IActionResult> GetModulesByBatch(int batchId)
    {
        var batch = await _context.Batches
            .FindAsync(batchId);

        if (batch == null)
        {
            return NotFound("Batch not found");
        }

        var modules = await _context.BatchModules
            .Where(bm => bm.BatchId == batchId)
            .Include(bm => bm.Module)
            .Select(bm => new
            {
                bm.Module.ModuleId,
                bm.Module.ModuleName,
                bm.Module.Description,
                bm.Module.IsActive
            })
            .ToListAsync();

        return Ok(modules);
    }

    // DELETE: api/BatchModule/remove/1/2
    [HttpDelete("remove/{batchId}/{moduleId}")]
    public async Task<IActionResult> RemoveModule(
        int batchId, int moduleId)
    {
        var assignment = await _context.BatchModules
            .FindAsync(batchId, moduleId);

        if (assignment == null)
        {
            return NotFound("Module assignment not found");
        }

        _context.BatchModules.Remove(assignment);

        await _context.SaveChangesAsync();

        return Ok("Module removed from batch successfully");
    }
}
