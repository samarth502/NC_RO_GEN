package com.gccloud.ncservice.service;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public interface ImportService {

    void importData(MultipartFile file);

}
