using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InstituteManagement.Api.Data;

namespace InstituteManagement.Api.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StudentController(ApplicationDbContext context)
        {
            _context   = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllStudent()
        {
            var students = await _context.Students.ToListAsync();
            return Ok(students);
        }
    }
}
