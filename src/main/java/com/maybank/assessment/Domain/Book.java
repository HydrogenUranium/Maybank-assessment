package com.maybank.assessment.Domain;

import javax.persistence.Entity;
import javax.persistence.Id;

/*
 Entity for Book , id is preferable using int or long but since this is demo
 it uses String for id
*/
@Entity
public class Book {

    @Id
    private String id;
    private String name;
    private String description;

    public Book() {

    }

    /**
     * @param id
     * @param name
     * @param description
     */
    public Book(String id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    /**
     * @return the id
     */
    public String getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the description
     */
    public String getDescription() {
        return description;
    }

    /**
     * @param description the description to set
     */
    public void setDescription(String description) {
        this.description = description;
    }

}
