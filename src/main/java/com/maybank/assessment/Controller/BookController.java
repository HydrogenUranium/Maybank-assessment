package com.maybank.assessment.Controller;

import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

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
import org.springframework.web.util.UriComponentsBuilder;
import java.net.URI;

@RestController
public class BookController {

    @Autowired
    private BookService bookService;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${api.key}")
    private String apiKey;

    final String API = "https://www.googleapis.com/books/v1/volumes";

    private static final Logger logger = LoggerFactory.getLogger(BookController.class);

    private static final Pattern SAFE_QUERY = Pattern.compile("^[A-Za-z0-9\\s\-]{1,100}$");

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
    /**
     * Fetches book data from Google Books API by title.
     *
     * Endpoint: GET /API/{id}
     * - Path variable 'id': book title (alphanumeric, space, hyphen, max 100 chars)
     * - Produces: application/json
     * - Success: 200 with JSON payload from Google Books
     * - Client error: 400 for invalid input or blocked host/scheme
     * - Upstream error: 502 when external API is unavailable
     */
    @RequestMapping(method = RequestMethod.GET, value = "/API/{id}", produces = "application/json")
    public ResponseEntity<JsonNode> getBookAPI(@PathVariable String id) throws JsonMappingException, JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        if (!SAFE_QUERY.matcher(id).matches()) {
            JsonNode error = mapper.createObjectNode().put("error", "Invalid input");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        URI uri = UriComponentsBuilder.fromHttpUrl(API)
                .queryParam("q", id)
                .queryParam("inauthor", "keyes")
                .queryParam("key", apiKey)
                .build(true)
                .toUri();

        if (!"https".equalsIgnoreCase(uri.getScheme()) || !"www.googleapis.com".equalsIgnoreCase(uri.getHost())) {
            JsonNode error = mapper.createObjectNode().put("error", "Blocked host or scheme");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);
        if (response.getStatusCodeValue() == 200) {
            JsonNode json = mapper.readTree(response.getBody());
            return ResponseEntity.ok(json);
        } else {
            JsonNode error = mapper.createObjectNode().put("error", "API is not available");
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(error);
        }
    }

}
