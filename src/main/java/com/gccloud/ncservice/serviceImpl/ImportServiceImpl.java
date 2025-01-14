package com.gccloud.ncservice.serviceImpl;

import com.gccloud.ncservice.service.ImportService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
public class ImportServiceImpl implements ImportService {

    @Override
    public void importData(MultipartFile file) {



    }

}
