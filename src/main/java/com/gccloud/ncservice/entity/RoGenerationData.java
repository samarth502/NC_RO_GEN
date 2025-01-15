package com.gccloud.ncservice.entity;


import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Builder
@Entity
@Getter
@Setter
@Table(name = "ro_data")
public class RoGenerationData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String roNumber;
    private String roDate;
    private String length;
    private String dateOfPublication;
    private String breadth;
    private String totalSize;
    private String priceToNewsPaper;
    private String amount;
    private String gst;
    private String netPayable;
    private String emailId;
    private String phoneNumber;
    private String submissionDate;
    private String clientName;
    private String pageNumber;
    private String newspaperName;
    private String state;
    private String edition;
    private String dav;
    private String colorPercentage;
    private String color;
    private String language;
    private String gstType;

    public String getGstType() {
        return gstType;
    }

    public void setGstType(String gstType) {
        this.gstType = gstType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoNumber() {
        return roNumber;
    }

    public void setRoNumber(String roNumber) {
        this.roNumber = roNumber;
    }

    public String getRoDate() {
        return roDate;
    }

    public void setRoDate(String roDate) {
        this.roDate = roDate;
    }

    public String getLength() {
        return length;
    }

    public void setLength(String length) {
        this.length = length;
    }

    public String getDateOfPublication() {
        return dateOfPublication;
    }

    public void setDateOfPublication(String dateOfPublication) {
        this.dateOfPublication = dateOfPublication;
    }

    public String getBreadth() {
        return breadth;
    }

    public void setBreadth(String breadth) {
        this.breadth = breadth;
    }

    public String getTotalSize() {
        return totalSize;
    }

    public void setTotalSize(String totalSize) {
        this.totalSize = totalSize;
    }

    public String getPriceToNewsPaper() {
        return priceToNewsPaper;
    }

    public void setPriceToNewsPaper(String priceToNewsPaper) {
        this.priceToNewsPaper = priceToNewsPaper;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getGst() {
        return gst;
    }

    public void setGst(String gst) {
        this.gst = gst;
    }

    public String getNetPayable() {
        return netPayable;
    }

    public void setNetPayable(String netPayable) {
        this.netPayable = netPayable;
    }

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getSubmissionDate() {
        return submissionDate;
    }

    public void setSubmissionDate(String submissionDate) {
        this.submissionDate = submissionDate;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getPageNumber() {
        return pageNumber;
    }

    public void setPageNumber(String pageNumber) {
        this.pageNumber = pageNumber;
    }

    public String getNewspaperName() {
        return newspaperName;
    }

    public void setNewspaperName(String newspaperName) {
        this.newspaperName = newspaperName;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getEdition() {
        return edition;
    }

    public void setEdition(String edition) {
        this.edition = edition;
    }

    public String getDav() {
        return dav;
    }

    public void setDav(String dav) {
        this.dav = dav;
    }

    public String getColorPercentage() {
        return colorPercentage;
    }

    public void setColorPercentage(String colorPercentage) {
        this.colorPercentage = colorPercentage;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }



}
