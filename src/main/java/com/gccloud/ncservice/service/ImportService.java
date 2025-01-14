package com.gccloud.ncservice.service;

import com.gccloud.ncservice.entity.NewsPaperMasterRate;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Component
public interface ImportService {

    void importData(MultipartFile file);

    List<NewsPaperMasterRate> fecthAllMasterRates();

    List<String> getAllState(String newPaperName);

    List<String> getAllPublicationName(String newspaperName);

    List<String> getLanguageByNewPaperName(String newspaperName);

    String getDavRates(String newspaperName, String state, String edition, String language);
}
