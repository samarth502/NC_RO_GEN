package com.gccloud.ncservice.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Builder
@Entity
@Table(name = "newspaper")
public class NewsPaperMasterRate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "newspaper_code", nullable = false, unique = true)
    private String newspaperCode;

    @Column(name = "newspaper_name", nullable = false)
    private String newspaperName;

    @Column(name = "last_renewed_date", nullable = false)
    private String lastRenewedDate;

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
    private long circulation;

    @Column(name = "rate", nullable = false)
    private double rate;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNewspaperCode() {
        return newspaperCode;
    }

    public void setNewspaperCode(String newspaperCode) {
        this.newspaperCode = newspaperCode;
    }

    public String getNewspaperName() {
        return newspaperName;
    }

    public void setNewspaperName(String newspaperName) {
        this.newspaperName = newspaperName;
    }

    public String getLastRenewedDate() {
        return lastRenewedDate;
    }

    public void setLastRenewedDate(String lastRenewedDate) {
        this.lastRenewedDate = lastRenewedDate;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPlaceOfPublication() {
        return placeOfPublication;
    }

    public void setPlaceOfPublication(String placeOfPublication) {
        this.placeOfPublication = placeOfPublication;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getPeriodicity() {
        return periodicity;
    }

    public void setPeriodicity(String periodicity) {
        this.periodicity = periodicity;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getRegularityStatus() {
        return regularityStatus;
    }

    public void setRegularityStatus(String regularityStatus) {
        this.regularityStatus = regularityStatus;
    }

    public String getCirculationBase() {
        return circulationBase;
    }

    public void setCirculationBase(String circulationBase) {
        this.circulationBase = circulationBase;
    }

    public long getCirculation() {
        return circulation;
    }

    public void setCirculation(long circulation) {
        this.circulation = circulation;
    }

    public double getRate() {
        return rate;
    }

    public void setRate(double rate) {
        this.rate = rate;
    }
}
