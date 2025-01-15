package com.gccloud.ncservice.serviceimpl;

import com.gccloud.ncservice.repository.NewsPaperMasterRateRepository;
import com.gccloud.ncservice.service.RoGenerationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoGenerationServiceImpl implements RoGenerationService {

    @Autowired
    NewsPaperMasterRateRepository newsPaperMasterRateRepository;


    @Override
    public List<String> getNewsPaperName() {
        return newsPaperMasterRateRepository.getAllNewsPaperName();
    }


}
