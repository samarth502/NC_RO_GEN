package com.gccloud.ncservice.controller;

import com.gccloud.ncservice.entity.NewsPaperMasterRate;
import com.gccloud.ncservice.service.ImportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final ImportService importService;

    @Autowired
    public ApiController(ImportService importService) {
        this.importService = importService;
    }


    @PostMapping(path="/upload/master_data",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> uploadMasterData(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Validate file
            if (file.isEmpty()) {
                response.put("status", "error");
                response.put("message", "File is empty. Please upload a valid Excel or CSV file.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            String fileName = file.getOriginalFilename();

            // Check file type
            if (!(fileName.endsWith(".csv") || fileName.endsWith(".xls") || fileName.endsWith(".xlsx"))) {
                response.put("status", "error");
                response.put("message", "Invalid file type. Only .csv, .xls, and .xlsx files are allowed.");
                return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(response);
            }

            // Process file
            importService.importData(file);
            List<NewsPaperMasterRate> masterRates = importService.fecthAllMasterRates();

            // Success response
            response.put("status", "success");
            response.put("message", "File uploaded successfully.");
            response.put("fileName", fileName);
            response.put("masterRates", masterRates);
            return ResponseEntity.status(HttpStatus.OK).body(response);

        } catch (Exception e) {
            // Error response
            response.put("status", "error");
            response.put("message", "An error occurred while processing the file.");
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


}
