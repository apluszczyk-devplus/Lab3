using AdvancedProgramming_Lesson3.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AdvancedProgramming_Lesson3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PeopleController : ControllerBase
    {
        private readonly PersonContext _context;

        public PeopleController(PersonContext context)
        {
            _context = context;
        }

        // GET: api/People
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PersonDTO>>> GetPeople()
        {
            return await _context.People
                .Select(x => ItemToDTO(x))
                .ToListAsync();
        }

        // GET: api/People/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PersonDTO>> GetPerson(long id)
        {
            var person = await _context.People.FindAsync(id);
            if (person == null)
            {
                return NotFound();
            }

            return ItemToDTO(person);
        }

        [HttpPost]
        [Route("UpdatePerson")]
        public async Task<ActionResult<PersonDTO>> UpdatePerson(PersonDTO personDTO)
        {
            var person = await _context.People.FindAsync(personDTO.Id);
            if (person == null)
            {
                return NotFound();
            }
            person.Name = personDTO.Name;
            person.Surname = personDTO.Surname;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!PersonExists(personDTO.Id))
            {
                return NotFound();
            }

            return CreatedAtAction(
                nameof(UpdatePerson),
                new { id = person.Id },
                ItemToDTO(person));
        }

        [HttpPost]
        [Route("CreatePerson")]
        public async Task<ActionResult<PersonDTO>> CreatePerson(PersonDTO personDTO)
        {
            var person = new Person
            {
                Name = personDTO.Name,
                Surname = personDTO.Surname
            };

            _context.People.Add(person);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetPerson),
                new { id = person.Id },
                ItemToDTO(person));
        }

        // DELETE: api/People/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Person>> DeletePerson(long id)
        {
            var person = await _context.People.FindAsync(id);
            if (person == null)
            {
                return NotFound();
            }
            _context.People.Remove(person);
            await _context.SaveChangesAsync();
            return NoContent();
        }


        private bool PersonExists(long id) =>
            _context.People.Any(e => e.Id == id);

        private static PersonDTO ItemToDTO(Person person) =>
            new PersonDTO
            {
                Id = person.Id,
                Name = person.Name,
                Surname = person.Surname
            };
    }
}
