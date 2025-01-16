package com.gccloud.ncservice.serviceimpl;

import com.gccloud.ncservice.entity.Client;
import com.gccloud.ncservice.entity.NewsPaperMasterRate;
import com.gccloud.ncservice.entity.RoGenerationData;
import com.gccloud.ncservice.repository.ClientRepository;
import com.gccloud.ncservice.repository.NewsPaperMasterRateRepository;
import com.gccloud.ncservice.repository.NewsPaperMasterRateRepository;
import com.gccloud.ncservice.repository.RoGenerationDataRepository;
import com.gccloud.ncservice.service.ImportService;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@Slf4j
public class ImportServiceImpl implements ImportService {

    private final NewsPaperMasterRateRepository masterRateRepo;

    @Autowired
    RoGenerationDataRepository roGenerationDataRepository;

    @Autowired
    ClientRepository clientRepository;


    @Autowired
    public ImportServiceImpl(NewsPaperMasterRateRepository masterRateRepo) {
        this.masterRateRepo = masterRateRepo;
    }

    private static final Logger logger = LoggerFactory.getLogger(ImportServiceImpl.class);

    @Override
    public void importData(MultipartFile file) {
        try {
            String fileName = file.getOriginalFilename();

            if (fileName == null || file.isEmpty()) {
                throw new IllegalArgumentException("File is empty or invalid.");
            }
            else{
                masterRateRepo.deleteAll();
                masterRateRepo.flush();
            }

            if (fileName.endsWith(".csv")) {
                processCsvFile(file);
            } else if (fileName.endsWith(".xls") || fileName.endsWith(".xlsx")) {
                processExcelFile(file);
            } else {
                throw new IllegalArgumentException("Unsupported file type. Only .csv, .xls, and .xlsx are allowed.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new IllegalArgumentException("Error occurred while importing data: " + e.getMessage());
        }
    }

    @Override
    public List<NewsPaperMasterRate> fecthAllMasterRates() {
        return masterRateRepo.findAll();
    }

    private void processCsvFile(MultipartFile file) throws IOException, CsvValidationException {
        try (CSVReader csvReader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            String[] nextLine;
            csvReader.readNext(); // Skip header

            while ((nextLine = csvReader.readNext()) != null) {
                NewsPaperMasterRate newspaper = mapToEntity(nextLine);
                masterRateRepo.save(newspaper); // Save using JPA repository
            }
        }
    }

    private void processExcelFile(MultipartFile file) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0); // Read the first sheet
            Iterator<Row> rowIterator = sheet.iterator();

            if (rowIterator.hasNext()) {
                rowIterator.next(); // Skip header row
            }

            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                NewsPaperMasterRate newspaper = mapToEntity(row);
                masterRateRepo.save(newspaper); // Save using JPA repository
            }
        }
    }


    private NewsPaperMasterRate mapToEntity(String[] data) {
        NewsPaperMasterRate newspaper = new NewsPaperMasterRate();

        // Extract NewspaperName and LastRenewedDate from index 1
        String[] nameAndDate = data[1].trim().toUpperCase().split(" - ");
        String newspaperName = nameAndDate[0].trim();
        String lastRenewedDate = nameAndDate.length > 1 ? nameAndDate[1].trim() : null;

        // Map the values to the entity with trimming and uppercasing
        newspaper.setNewspaperCode(data[0].trim().toUpperCase());
        newspaper.setNewspaperName(newspaperName); // Set the name
        newspaper.setLastRenewedDate(lastRenewedDate); // Set the last renewed date
        newspaper.setState(data[2].trim().toUpperCase());
        newspaper.setPlaceOfPublication(data[3].trim().toUpperCase());
        newspaper.setLanguage(data[4].trim().toUpperCase());
        newspaper.setPeriodicity(data[5].trim().toUpperCase());
        newspaper.setCategory(data[6].trim().toUpperCase());
        newspaper.setRegularityStatus(data[7].trim().toUpperCase());
        newspaper.setCirculationBase(data[8].trim().toUpperCase());
        newspaper.setCirculation(Long.parseLong(data[9].trim()));
        newspaper.setRate(Double.parseDouble(data[10].trim()));

        return newspaper;
    }

    private NewsPaperMasterRate mapToEntity(Row row) {
        NewsPaperMasterRate newspaper = new NewsPaperMasterRate();

        // Extract NewspaperName and LastRenewedDate from index 1
        String[] nameAndDate = getCellValue(row.getCell(1)).trim().toUpperCase().split(" - ");
        String newspaperName = nameAndDate[0].trim();
        String lastRenewedDate = nameAndDate.length > 1 ? nameAndDate[1].trim() : null;

        // Map the values to the entity with trimming and uppercasing
        newspaper.setNewspaperCode(getCellValue(row.getCell(0)).trim().toUpperCase());
        newspaper.setNewspaperName(newspaperName); // Set the name
        newspaper.setLastRenewedDate(lastRenewedDate); // Set the last renewed date
        newspaper.setState(getCellValue(row.getCell(2)).trim().toUpperCase());
        newspaper.setPlaceOfPublication(getCellValue(row.getCell(3)).trim().toUpperCase());
        newspaper.setLanguage(getCellValue(row.getCell(4)).trim().toUpperCase());
        newspaper.setPeriodicity(getCellValue(row.getCell(5)).trim().toUpperCase());
        newspaper.setCategory(getCellValue(row.getCell(6)).trim().toUpperCase());
        newspaper.setRegularityStatus(getCellValue(row.getCell(7)).trim().toUpperCase());
        newspaper.setCirculationBase(getCellValue(row.getCell(8)).trim().toUpperCase());
        newspaper.setCirculation(Long.parseLong(getCellValue(row.getCell(9)).trim()));
        newspaper.setRate(Double.parseDouble(getCellValue(row.getCell(10)).trim()));

        return newspaper;
    }


    private String getCellValue(Cell cell) {
        if (cell == null) {
            return null;
        }
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                } else {
                    return String.valueOf((int) cell.getNumericCellValue());
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return null;
        }
    }

    @Override
    public List<String> getAllState(String newPaperName) {
        return masterRateRepo.getAllState(newPaperName);
    }

    @Override
    public List<String> getAllPublicationName(String newspaperName) {
        return masterRateRepo.getPublicationName(newspaperName);
    }

    @Override
    public List<String> getLanguageByNewPaperName(String newspaperName) {
        return masterRateRepo.getLanguage(newspaperName);
    }

    @Override
    public String getDavRates(String newspaperName, String edition, String language) {
        return masterRateRepo.getDavRates(newspaperName,edition,language);
    }

    @Override
    public List<String> getPublicationNamesByNewspaperAndState(String newspaperName, String state) {
        return masterRateRepo.getPublicationNameByState(newspaperName, state);
    }

    @Override
    public List<String> getLanguageByNewspaperAndPublicationPlace(String newspaperName, String publicationPlace) {
        return masterRateRepo.getLanguageByPublication(newspaperName, publicationPlace);
    }

    @Override
    public String saveRoData(RoGenerationData roGenerationData) {
        try{

            roGenerationData.setClientName(roGenerationData.getClientName().toUpperCase());
            roGenerationData.setNewspaperName(roGenerationData.getNewspaperName().toUpperCase());
            roGenerationData.setState(roGenerationData.getState().toUpperCase());
            roGenerationData.setEdition(roGenerationData.getEdition().toUpperCase());
            roGenerationData.setLanguage(roGenerationData.getLanguage().toUpperCase());

            roGenerationDataRepository.save(roGenerationData);

            return "Successfully";

        }
        catch(Exception e){

            logger.error("Failed to Save Error :{}",e);
            return "Failed";

        }
    }

    @Override
    public String getDavRatesUsingPeriodicityAndCategory(String newspaperName, String edition, String language, String periodicity, String category) {
//         Dav Rates with Cateogry and Periodicity
        return masterRateRepo.getDavRatesWithHelpOfCatandPeriod(newspaperName,edition,language,periodicity,category);
    }

    @Override
    public List<String> getPeriodicityByNewPaperName(String newspaperName) {


        return masterRateRepo.getPeriodicityList(newspaperName);
    }

    @Override
    public List<String> fetchCategoryList(String newspaperName) {
        return masterRateRepo.getCategoryList(newspaperName);
    }

    @Override
    public List<String> fetchCategoryListByPeriodicityName(String newspaperName, String periodicity) {
        return masterRateRepo.getCategoryListByPeriodicity(newspaperName,periodicity);
    }

    @Override
    public List<String> getAllClientNameList() {
        return masterRateRepo.getAllClientList();
    }

    @Override
    public List<NewsPaperMasterRate> fetchNewsPapersMaster() {

        List<NewsPaperMasterRate> newsPaperMasterRates = masterRateRepo.findAll();

        return newsPaperMasterRates;

    }

    @Override
    public String saveClient(Client client) {

        try{

            client.setClientName(client.getClientName().toUpperCase());
            client.setClientShortForm(client.getClientShortForm().toUpperCase());

            clientRepository.save(client);

            return "Client Added Successfully";

        }
        catch(Exception e){

            logger.error("Failed to Save Error :{}",e);
            return "Failed";

        }
    }

    @Override
    public List<RoGenerationData> fetchRoData() {

        List<RoGenerationData> roGenerationData = roGenerationDataRepository.findAll();

        return roGenerationData;

    }

    @Override
    public RoGenerationData getRoDataById(Long id) {

        return roGenerationDataRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RO Data not found for ID: " + id));

    }
    @Override
    public List<String> getAllClientNameListBySubmissionDate(String submissionDate) {
        return masterRateRepo.getAllClientListBySubmissionDate(submissionDate);
    }

    @Override
    public List<String> getAllRoDateBySubmissionDateAndClient(String submissionDate, String clientName) {
        return masterRateRepo.getAllRoDateByClientNameAndSubmissionDate(submissionDate,clientName);
    }

    @Override
    public List<String> getAllNewspaperNameByClientRoDateSubmissionDate(String submissionDate, String clientName, String roDates) {
        return masterRateRepo.getNewspaperListBySubmitdateRoDateAndClientName(submissionDate,clientName,roDates);
    }

    @Override
    public List<Map<String,Object>> getReleaseOrderData(String submissionDate, String clientName, String roDates, String newspaper, String publishcationDate) {
        return masterRateRepo.getDataForReleaseOrder(submissionDate,clientName,roDates,newspaper,publishcationDate);
    }

    @Override
    public List<String> getPublishDate(String submissionDate, String clientName, String roDates, String newspaperName) {
        return masterRateRepo.getPublishcationDate(submissionDate,clientName,roDates,newspaperName);
    }

    @Override
    public List<Map<String, Object>> getClientData() {
        return clientRepository.fetchClientData();
    }


}
