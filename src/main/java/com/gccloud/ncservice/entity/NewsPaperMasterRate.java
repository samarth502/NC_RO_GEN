package com.gccloud.ncservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Entity
@Table(name = "newspaper")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsPaperMasterRate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "newspaper_code", nullable = false, unique = true)
    private String newspaperCode;

    @Column(name = "newspaper_name", nullable = false)
    private String newspaperName;

    @Column(name = "state", nullable = false)
    private String state;

    @Column(name = "place_of_publication", nullable = false)
    private String placeOfPublication;

    @Column(name = "language", nullable = false)
    private String language;

    @Column(name = "periodicity", nullable = false)
    private String periodicity;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "regularity_status", nullable = false)
    private String regularityStatus;

    @Column(name = "circulation_base", nullable = false)
    private String circulationBase;

    @Column(name = "circulation", nullable = false)
    private int circulation;

    @Column(name = "rate", nullable = false)
    private double rate;
}