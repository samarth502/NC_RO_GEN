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

}
