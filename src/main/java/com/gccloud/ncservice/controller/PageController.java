package com.gccloud.ncservice.controller;


import com.gccloud.ncservice.service.RoGenerationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/nc")
public class PageController {

    @Autowired
    RoGenerationService roGenerationService;

    @GetMapping(path = "/portal")
    public String goToPortalPage(Model theModel) {

        List<String> newsPaperName = roGenerationService.getNewsPaperName();
        theModel.addAttribute("newsPaperName",newsPaperName);

        return "uploadMaster";
    }


}
