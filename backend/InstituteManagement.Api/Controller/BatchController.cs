
using InstituteManagement.Api.Data;
using InstituteManagement.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InstituteManagement.Api.Controller;

[Route("api/[controller]")]
[ApiController]
public class BatchController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BatchController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Batch
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Batch>>> GetAllBatches()
    {
        var batches = await _context.Batches.ToListAsync();

        return Ok(batches);
    }

    // GET: api/Batch/1
    [HttpGet("{id}")]
    public async Task<ActionResult<Batch>> GetBatchById(int id)
    {
        var batch = await _context.Batches.FindAsync(id);

        if (batch == null)
        {
            return NotFound("Batch not found.");
        }

        return Ok(batch);
    }

    // POST: api/Batch
    [HttpPost]
    public async Task<ActionResult<Batch>> AddBatch(Batch batch)
    {
        _context.Batches.Add(batch);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetBatchById),
            new { id = batch.BatchId },
            batch
        );
    }

    // PUT: api/Batch/1
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBatch(
        int id, Batch updatedBatch)
    {
        if (id != updatedBatch.BatchId)
        {
            return BadRequest("Batch ID mismatch.");
        }

        var existingBatch = await _context.Batches.FindAsync(id);

        if (existingBatch == null)
        {
            return NotFound("Batch not found.");
        }

        existingBatch.BatchName = updatedBatch.BatchName;
        existingBatch.StartDate = updatedBatch.StartDate;
        existingBatch.EndDate = updatedBatch.EndDate;
        existingBatch.IsActive = updatedBatch.IsActive;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Batch/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBatch(int id)
    {
        var batch = await _context.Batches.FindAsync(id);

        if (batch == null)
        {
            return NotFound("Batch not found.");
        }

        bool hasModules = await _context.BatchModules
            .AnyAsync(bm => bm.BatchId == id);

        if (hasModules)
        {
            return Conflict(
                "This batch has associated modules. Remove its associations before deleting."
            );
        }

        _context.Batches.Remove(batch);

        await _context.SaveChangesAsync();

        return Ok("Batch deleted successfully.");
    }
}
