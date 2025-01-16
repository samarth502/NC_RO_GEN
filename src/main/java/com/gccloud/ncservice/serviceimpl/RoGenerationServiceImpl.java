package com.gccloud.ncservice.serviceimpl;

import com.gccloud.ncservice.entity.NewsPaperMasterRate;
import com.gccloud.ncservice.repository.ClientRepository;
import com.gccloud.ncservice.repository.NewsPaperMasterRateRepository;
import com.gccloud.ncservice.service.RoGenerationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoGenerationServiceImpl implements RoGenerationService {

    @Autowired
    NewsPaperMasterRateRepository newsPaperMasterRateRepository;


    @Autowired
    ClientRepository clientRepository;


    @Override
    public List<String> getNewsPaperName() {
        return newsPaperMasterRateRepository.getAllNewsPaperName();
    }

    @Override
    public List<String> fetchTheClientList() {
        return clientRepository.fetchClientList();
    }


}
