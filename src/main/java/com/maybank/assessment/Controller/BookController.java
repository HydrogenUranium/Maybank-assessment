package com.maybank.assessment.Controller;

import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.maybank.assessment.Domain.Book;
import com.maybank.assessment.Service.BookService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class BookController {

    @Autowired
    private BookService bookService;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${api.key}")
    private String apiKey;

    final String API = "https://www.googleapis.com/books/v1/volumes?q=";

    private static final Logger logger = LoggerFactory.getLogger(BookController.class);

    // get all books in DB
    @RequestMapping("/books")
    public List<Book> getallBook() {
        return bookService.getAllBooks();
    }

    // get only 1 book by id
    @GetMapping("/books/{id}")
    public Optional<Book> getTopic(@PathVariable String id) {
        return bookService.getBook(id);
    }

    // insert new book details in DB
    @RequestMapping(method = RequestMethod.POST, value = "/book")
    public @ResponseBody ResponseEntity<String> addBook(@RequestBody Book book) {
        bookService.addBook(book);
        return new ResponseEntity<String>("POST Response", HttpStatus.OK);
    }

    // delete book by using id ex: java or python
    @RequestMapping(method = RequestMethod.DELETE, value = "/book/{id}")
    public @ResponseBody ResponseEntity<String> deleteBook(@PathVariable String id) {
        bookService.deleteBook(id);
        return new ResponseEntity<String>("DELETE Response", HttpStatus.OK);
    }

    // update book details in DB
    @RequestMapping(method = RequestMethod.PUT, value = "/book/{id}")
    public @ResponseBody ResponseEntity<String> updateBook(@RequestBody Book book, @PathVariable String id) {
        bookService.updateBook(book, id);
        return new ResponseEntity<String>("PUT Response", HttpStatus.OK);
    }

    // get all books by page size
    @RequestMapping(method = RequestMethod.GET, value = "/bookPage/{pageSize}")
    public List<Book> getAllPage(@PathVariable int pageSize) {
        Page<Book> pageBook = bookService.findPageBook(pageSize);
        List<Book> book = pageBook.getContent();
        return book;
    }

    // Request Google Book API by using id as book title
    @RequestMapping(method = RequestMethod.GET, value = "/API/{id}")
    public String getBookAPI(@PathVariable String id) throws JsonMappingException, JsonProcessingException {
        ResponseEntity<String> response = restTemplate.getForEntity(API + id + "+inauthor:keyes&key=" + apiKey,
                String.class);
        if (response.getStatusCodeValue() == 200) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode json = mapper.readTree(response.getBody());
            return json.toString();
        } else {
            return "API is not available";
        }
    }

}
