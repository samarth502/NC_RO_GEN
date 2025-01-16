package com.gccloud.ncservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "client")
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String clientName;

    @Column(unique = true)
    private String clientShortForm;

    // Default constructor
    public Client() {}

    // Parameterized constructor
    public Client(Long id, String clientName, String clientShortForm) {
        this.id = id;
        this.clientName = clientName;
        this.clientShortForm = clientShortForm;
    }

    // Getter and Setter for 'id'
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // Getter and Setter for 'clientName'
    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    // Getter and Setter for 'clientShortForm'
    public String getClientShortForm() {
        return clientShortForm;
    }

    public void setClientShortForm(String clientShortForm) {
        this.clientShortForm = clientShortForm;
    }


}
