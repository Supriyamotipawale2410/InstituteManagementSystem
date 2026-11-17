
using InstituteManagement.Api.Data;
using InstituteManagement.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InstituteManagement.Api.Controller;

[Route("api/[controller]")]
[ApiController]
public class ModuleController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ModuleController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Module
    [HttpGet]
    public async Task<IActionResult> GetModules()
    {
        var modules = await _context.Modules.ToListAsync();

        return Ok(modules);
    }

    // GET: api/Module/1
    [HttpGet("{id}")]
    public async Task<IActionResult> GetModuleById(int id)
    {
        var module = await _context.Modules.FindAsync(id);

        if (module == null)
        {
            return NotFound("Module not found");
        }

        return Ok(module);
    }

    // POST: api/Module
    [HttpPost]
    public async Task<IActionResult> AddModule(Module module)
    {
        _context.Modules.Add(module);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetModuleById),
            new { id = module.ModuleId },
            module
        );
    }

    // PUT: api/Module/1
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateModule(
        int id, Module updatedModule)
    {
        if (id != updatedModule.ModuleId)
        {
            return BadRequest("Module ID mismatch");
        }

        var existingModule = await _context.Modules.FindAsync(id);

        if (existingModule == null)
        {
            return NotFound("Module not found");
        }

        existingModule.ModuleName = updatedModule.ModuleName;
        existingModule.Description = updatedModule.Description;
        existingModule.IsActive = updatedModule.IsActive;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/Module/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteModule(int id)
    {
        var module = await _context.Modules.FindAsync(id);

        if (module == null)
        {
            return NotFound("Module not found");
        }

        bool isAssigned = await _context.BatchModules
            .AnyAsync(bm => bm.ModuleId == id);

        if (isAssigned)
        {
            return Conflict(
                "Cannot delete this module because it is assigned to a batch."
            );
        }

        _context.Modules.Remove(module);

        await _context.SaveChangesAsync();

        return Ok("Module deleted successfully");
    }
}
