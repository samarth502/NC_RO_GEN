package com.gccloud.ncservice.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GenerateRoDTO {

    private String submissionDate;
    private String clientName;
    private String roDates;
    private String newspaper;
    private String publicationDate;
    private String generateRoNumber;

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

    public String getRoDates() {
        return roDates;
    }

    public void setRoDates(String roDates) {
        this.roDates = roDates;
    }

    public String getNewspaper() {
        return newspaper;
    }

    public void setNewspaper(String newspaper) {
        this.newspaper = newspaper;
    }

    public String getPublicationDate() {
        return publicationDate;
    }

    public void setPublicationDate(String publicationDate) {
        this.publicationDate = publicationDate;
    }

    public String getGenerateRoNumber() {
        return generateRoNumber;
    }

    public void setGenerateRoNumber(String generateRoNumber) {
        this.generateRoNumber = generateRoNumber;
    }

}
