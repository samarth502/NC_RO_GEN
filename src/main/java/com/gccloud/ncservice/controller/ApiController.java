package com.gccloud.ncservice.controller;

import com.gccloud.ncservice.DTO.GenerateRoDTO;
import com.gccloud.ncservice.entity.Client;
import com.gccloud.ncservice.entity.NewsPaperMasterRate;
import com.gccloud.ncservice.entity.RoGenerationData;
import com.gccloud.ncservice.service.ImportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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


    @GetMapping("/getState")
    public List<String> getStateByNewspaperName(@RequestParam("newspaperName") String newspaperName){


        List<String> state = importService.getAllState(newspaperName);

        return state;
    }

    @GetMapping("/fetchPublicationName")
    public List<String> getAllPublicationNames(
            @RequestParam(value ="newspaperName") String newspaperName,
            @RequestParam(value ="state", required = false) String state) {

        List<String> publicationNames;

        // Check if the optional parameter 'state' is present
        if (state != null && !state.isEmpty()) {
            // Call service method considering both newspaperName and state
            publicationNames = importService.getPublicationNamesByNewspaperAndState(newspaperName, state);
        } else {
            // Call service method with only newspaperName
            publicationNames = importService.getAllPublicationName(newspaperName);
        }

        return publicationNames;
    }


    @GetMapping("/language")
    public List<String> getAllLanguageWithNewspaper(
            @RequestParam("newspaperName") String newspaperName,
            @RequestParam(value = "publicationPlace", required = false) String publicationPlace) {

        List<String> languages;

        // Check if the optional parameter 'publicationPlace' is provided
        if (publicationPlace != null && !publicationPlace.isEmpty()) {
            // Call service method with both newspaperName and publicationPlace
            languages = importService.getLanguageByNewspaperAndPublicationPlace(newspaperName, publicationPlace);
        } else {
            // Call service method with only newspaperName
            languages = importService.getLanguageByNewPaperName(newspaperName);
        }

        return languages;
    }


    @GetMapping("/getDavRates")
    public String getDavRatesBy(@RequestParam("newspaperName") String newspaperName,
                                      @RequestParam("edition") String edition,
                                      @RequestParam("language") String language,
                                @RequestParam(value = "periodicity", required = false) String periodicity,
                                @RequestParam(value = "category", required = false) String category

    ){
        String davRates = "";
        if ((periodicity == null || periodicity.isEmpty()) || (category == null || category.isEmpty()) || periodicity.equals("") || category.equals("")) {
            davRates = importService.getDavRates(newspaperName, edition, language);
        }
        else{
//            Dav Rate using Periodicity and category
            davRates = importService.getDavRatesUsingPeriodicityAndCategory(newspaperName, edition, language,periodicity,category);
        }

        return davRates;
    }

    @GetMapping("/fetchPeriodicity")
    public List<String> getPeriodicityData( @RequestParam("newspaperName") String newspaperName){


        List<String> periodicityData = importService.getPeriodicityByNewPaperName(newspaperName);
        return periodicityData;

    }
    @GetMapping("/fetchCategory")
    public List<String> getCategoryData( @RequestParam("newspaperName") String newspaperName,
                                         @RequestParam(value = "periodicity",required = false) String periodicity){

        List<String> categoryData;
        if(periodicity.isEmpty() || periodicity.equals("") || (periodicity == null)){
            categoryData = importService.fetchCategoryList(newspaperName);
        }
        else{
            categoryData = importService.fetchCategoryListByPeriodicityName(newspaperName,periodicity);
        }


        return categoryData;

    }

    @PostMapping("/submitRoData")
    public String goToSaveRoData(@RequestBody RoGenerationData roGenerationData){

        String message = importService.saveRoData(roGenerationData);
        return message;
    }

    @GetMapping("/fetchClientList")
    public List<String> goToShoewClientList(){

        List<String> clientList = importService.getAllClientNameList();
        return clientList;
    }

//    get client name by Submission date
    @GetMapping("/getClientNameForSubmissionDate/{submissionDate}")
    public List<String> getClientNameBySubmissionDate(@PathVariable String submissionDate){

//        System.out.println("submissionDate "+ submissionDate);

        List<String> clientList = importService.getAllClientNameListBySubmissionDate(submissionDate);
        return clientList;

    }

//    GET  RO Date Using Submission Date and Client Name
    @GetMapping("/getRoDates/{submissionDate}/{clientName}")
    public List<String> getRoDatesBySubmissionAndClientName(@PathVariable String submissionDate, @PathVariable String clientName){

        List<String> roDates = importService.getAllRoDateBySubmissionDateAndClient(submissionDate,clientName);
        return roDates;

    }


    //    GET newspaper name by  RO Date , Submission Date and Client Name
    @GetMapping("/getNewspaperName/{submissionDate}/{clientName}/{roDates}")
    public List<String> getNewsPaperNamebyClientSubmissionDateRODate(@PathVariable String submissionDate, @PathVariable String clientName, @PathVariable String roDates){

        List<String> newspaperList = importService.getAllNewspaperNameByClientRoDateSubmissionDate(submissionDate,clientName,roDates);
        return newspaperList;

    }

    //    GET newspaper name by  RO Date , Submission Date and Client Name
    @GetMapping("/getPublishCationDate/{submissionDate}/{clientName}/{roDates}/{newspaperName}")
    public List<String> getPublishDate(@PathVariable String submissionDate,
                                                                     @PathVariable String clientName,
                                                                     @PathVariable String roDates,
                                                                     @PathVariable String newspaperName){

        List<String> publishDateList = importService.getPublishDate(submissionDate,clientName,roDates,newspaperName);
        return publishDateList;

    }

        @PostMapping("/getReleaseOrder")
    public List<Map<String,Object>> getDataForReleaseOrder(@RequestBody GenerateRoDTO generateRoDTO){

            String  submissionDate=generateRoDTO.getSubmissionDate();
            String  clientName = generateRoDTO.getClientName();
            String  roDates = generateRoDTO.getRoDates();
            String  newspaper = generateRoDTO.getNewspaper();
            String  publishcationDate = generateRoDTO.getPublicationDate();
            String  generateRoNumber = generateRoDTO.getGenerateRoNumber();

        return importService.getReleaseOrderData(submissionDate,clientName,roDates,newspaper,publishcationDate,generateRoNumber);


    }


    @GetMapping("/newspapersMaster")
    public List<NewsPaperMasterRate> fetchNewsPapersMaster(){

        List<NewsPaperMasterRate> newsPaperMasterRates = importService.fetchNewsPapersMaster();

        return newsPaperMasterRates;
    }


    @PostMapping("/addClient")
    public String addClient(@RequestBody Client client){

        String message = importService.saveClient(client);

        return message;
    }


    @GetMapping("/fetchRoData")
    public List<RoGenerationData> fetchRoData(){

        List<RoGenerationData> roGenerationData = importService.fetchRoData();

        return roGenerationData;
    }

    @GetMapping("/deleteClientById/{id}")
    public void fetchRoData(@PathVariable(value = "id") Long id){

        importService.deleteClientById(id);

    }

    // Endpoint to fetch RO data by ID
    @GetMapping("/getRoDataById/{id}")
    public RoGenerationData getRoDataById(@PathVariable Long id) {

        return importService.getRoDataById(id);
    }

    // Endpoint to fetch RO data by ID
    @GetMapping("/getClientFullData")
    public List<Map<String,Object>> getClientData() {

        return importService.getClientData();
    }

    // Endpoint to fetch RO data by ID
    @GetMapping("/getClientID/{clientName}")
    public List<Map<String,Object>> getClientId(@PathVariable String clientName) {

        return importService.getClientID(clientName);
    }


//    last Digit Ro Number
    @GetMapping("/getSpeicalRoNumber/{clientName}/{submissionDate}")
    public String getLastDigitRoNumber(@PathVariable String clientName,@PathVariable String submissionDate) {

        return importService.getLastDigitRoNumber(clientName,submissionDate);
    }

    //    GET newspaper name by  RO Date , Submission Date and Client Name
    @GetMapping("/getRoList/{submissionDate}/{clientName}/{roDates}/{newspaperName}/{publishDate}")
    public List<String> getListOfRo(@PathVariable String submissionDate,
                                       @PathVariable String clientName,
                                       @PathVariable String roDates,
                                       @PathVariable String newspaperName,
                                       @PathVariable String publishDate
                                       ){

        return importService.getListOfRoForGeneration(submissionDate,clientName,roDates,newspaperName,publishDate);

    }


}
