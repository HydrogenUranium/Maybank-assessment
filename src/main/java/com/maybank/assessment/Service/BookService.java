package com.maybank.assessment.Service;

import java.util.List;
import java.util.Optional;

import com.maybank.assessment.Domain.Book;
import com.maybank.assessment.Repository.BookRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class BookService {

    @Autowired
    private BookRepo bookRepo;

    public List<Book> getAllBooks() {
        return bookRepo.findAll();
    }

    public Optional<Book> getBook(String id) {
        Optional<Book> book = bookRepo.findById(id);
        return book;
    }

    public void addBook(Book book) {
        bookRepo.save(book);
    }

    public void deleteBook(String id) {
        bookRepo.deleteById(id);
    }

    public void updateBook(Book book, String id) {
        bookRepo.save(book);
    }

    public Page<Book> findPageBook(int pageSize){
         Page<Book> bookpage = bookRepo.findAll(PageRequest.ofSize(pageSize)); 
         return bookpage; 
    }
}
