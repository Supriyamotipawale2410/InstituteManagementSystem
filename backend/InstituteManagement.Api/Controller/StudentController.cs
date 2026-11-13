using InstituteManagement.Api.Data;
using InstituteManagement.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudentById(int id)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
            {
                return NotFound();
            }

            return Ok(student);
        }

        [HttpPost]
        public async Task<IActionResult> AddStudent(Student student)
        {
            _context.Students.Add(student);

            await _context.SaveChangesAsync();

            return Ok(student);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, Student student)
        {
            var existingStudent = await _context.Students.FindAsync(id);

            if (existingStudent == null)
            {
                return NotFound();
            }

            existingStudent.FirstName = student.FirstName;
            existingStudent.LastName = student.LastName;
            existingStudent.Email = student.Email;
            existingStudent.PhoneNumber = student.PhoneNumber;
            existingStudent.DateOfBirth = student.DateOfBirth;
            existingStudent.AdmissionDate = student.AdmissionDate;

            await _context.SaveChangesAsync();

            return Ok(existingStudent);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
            {
                return NotFound();
            }

            _context.Students.Remove(student);

            await _context.SaveChangesAsync();

            return Ok("Student deleted successfully.");
        }


    }
}
