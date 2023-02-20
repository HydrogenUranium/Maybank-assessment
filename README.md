# Maybank Assessment REST API
Java Backend Interview Assignment

<!-- ABOUT THE PROJECT -->
## About The Project
This project is related to the book API dummy to explore the collection of books available in the database. With the API, it allows users to UPDATE, INSERT, GET and DELETE the book collection from the database. Not only that, the API also allows users to call external API (Google book API) by putting the book title as parameter. Further, the API allows the users to obtain results within the page size.

<!-- GETTING STARTED-->
## Getting Started
Upon application start up, the application will initialize the seed data in file data.sql. It will insert the 20 different book collections. The purpose is to test the page size of this book collection API. 

### Built With

Tools and framework used to develop this book collection API:

* [Spring Boot](https://spring.io/projects/spring-boot)
* [MSSQL database](https://www.microsoft.com/en-us/sql-server/sql-server-2019)
* [Microsoft sql server management studio ](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver15)
* [Visual Studio](https://visualstudio.microsoft.com/)
* [Postman](https://www.postman.com/)

<!-- API Testing-->
## API Testing
* To get all books collection in the database
  * GET  http://127.0.0.1:8082/books 

* To insert book details for the collection in the database
  * POST
http://127.0.0.1:8082/book
  ```json
    {
       "id": "aws ",
       "name": "aws Security",
       "description": "aws Security descrption"
     }

* To delete book details for the collection in the database by using the book id 
  * DELETE http://127.0.0.1:8082/book/aws
  
* To update book details for the collection in the database by using the book id
  * PUT http://127.0.0.1:8082/book/java
  ```json
  {
    "id": "Java",
    "name": "Java framework update",
    "description": "Java framework Description update version 2"
   }
  
* To get book details for the collection in the database by using page size   
  * GET http://127.0.0.1:8082/bookPage/10
  
* To call external API (Google book API) by putting the title of the book as parameter 
  * GET http://127.0.0.1:8082/API/java
 
