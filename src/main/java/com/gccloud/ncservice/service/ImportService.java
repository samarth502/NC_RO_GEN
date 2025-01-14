package com.gccloud.ncservice.service;

import com.gccloud.ncservice.entity.NewsPaperMasterRate;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Component
public interface ImportService {

    void importData(MultipartFile file);

    List<NewsPaperMasterRate> fecthAllMasterRates();
}
