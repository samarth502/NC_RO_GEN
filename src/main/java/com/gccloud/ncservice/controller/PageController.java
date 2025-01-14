package com.gccloud.ncservice.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/nc")
public class PageController {

    @GetMapping(path = "/portal")
    public String goToPortalPage() {

        return "uploadMaster";
    }

}
