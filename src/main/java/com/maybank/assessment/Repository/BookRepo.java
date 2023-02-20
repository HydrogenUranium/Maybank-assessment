package com.maybank.assessment.Repository;

import com.maybank.assessment.Domain.Book;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepo extends JpaRepository<Book, String> {

}
