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
    public class BooksController : ControllerBase
    {
        private readonly BookContext _context;

        public BooksController(BookContext context)
        {
            _context = context;
        }

        // GET: api/Books
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookDTO>>> GetBooks()
        {
            return await _context.Books
                .Select(x => ItemToDTO(x))
                .ToListAsync();
        }

        // GET: api/Books/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BookDTO>> GetBook(long id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            return ItemToDTO(book);
        }

        [HttpPost]
        [Route("UpdateBook")]
        public async Task<ActionResult<BookDTO>> UpdateBook(BookDTO bookDTO)
        {
            var book = await _context.Books.FindAsync(bookDTO.Id);
            if (book == null)
            {
                return NotFound();
            }
            book.Author = bookDTO.Author;
            book.Title = bookDTO.Title;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!BookExists(bookDTO.Id))
            {
                return NotFound();
            }

            return CreatedAtAction(
                nameof(UpdateBook),
                new { id = book.Id },
                ItemToDTO(book));
        }

        [HttpPost]
        [Route("CreateBook")]
        public async Task<ActionResult<BookDTO>> CreateBook(BookDTO bookDTO)
        {
            var book = new Book
            {
                Author = bookDTO.Author,
                Title = bookDTO.Title
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetBook),
                new { id = book.Id },
                ItemToDTO(book));
        }

        // DELETE: api/Books/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Book>> DeleteBook(long id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }
            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
            return NoContent();
        }


        private bool BookExists(long id) =>
            _context.Books.Any(e => e.Id == id);

        private static BookDTO ItemToDTO(Book book) =>
            new BookDTO
            {
                Id = book.Id,
                Author = book.Author,
                Title = book.Title
            };
    }
}
