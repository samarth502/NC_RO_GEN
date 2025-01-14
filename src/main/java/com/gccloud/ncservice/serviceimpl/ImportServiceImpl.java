package com.gccloud.ncservice.serviceimpl;

import com.gccloud.ncservice.entity.NewsPaperMasterRate;
import com.gccloud.ncservice.repository.NewsPaperMasterRateRepository;
import com.gccloud.ncservice.service.ImportService;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import jakarta.transaction.Transactional;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Iterator;
import java.util.List;

@Service
@Transactional
public class ImportServiceImpl implements ImportService {


    private final NewsPaperMasterRateRepository masterRateRepo;

    @Autowired
    public ImportServiceImpl(NewsPaperMasterRateRepository masterRateRepo) {
        this.masterRateRepo = masterRateRepo;
    }


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
        String[] nameAndDate = data[1].split(" - ");
        String newspaperName = nameAndDate[0];
        String lastRenewedDate = nameAndDate.length > 1 ? nameAndDate[1] : null;

        // Map the values to the entity
        newspaper.setNewspaperCode(data[0]);
        newspaper.setNewspaperName(newspaperName); // Set the name
        newspaper.setLastRenewedDate(lastRenewedDate); // Set the last renewed date
        newspaper.setState(data[2]);
        newspaper.setPlaceOfPublication(data[3]);
        newspaper.setLanguage(data[4]);
        newspaper.setPeriodicity(data[5]);
        newspaper.setCategory(data[6]);
        newspaper.setRegularityStatus(data[7]);
        newspaper.setCirculationBase(data[8]);
        newspaper.setCirculation(Long.parseLong(data[9]));
        newspaper.setRate(Double.parseDouble(data[10]));

        return newspaper;
    }


    private NewsPaperMasterRate mapToEntity(Row row) {
        NewsPaperMasterRate newspaper = new NewsPaperMasterRate();

        // Extract NewspaperName and LastRenewedDate from index 1
        String[] nameAndDate = getCellValue(row.getCell(1)).split(" - ");
        String newspaperName = nameAndDate[0];
        String lastRenewedDate = nameAndDate.length > 1 ? nameAndDate[1] : null;

        // Map the values to the entity
        newspaper.setNewspaperCode(getCellValue(row.getCell(0)));
        newspaper.setNewspaperName(newspaperName); // Set the name
        newspaper.setLastRenewedDate(lastRenewedDate); // Set the last renewed date
        newspaper.setState(getCellValue(row.getCell(2)));
        newspaper.setPlaceOfPublication(getCellValue(row.getCell(3)));
        newspaper.setLanguage(getCellValue(row.getCell(4)));
        newspaper.setPeriodicity(getCellValue(row.getCell(5)));
        newspaper.setCategory(getCellValue(row.getCell(6)));
        newspaper.setRegularityStatus(getCellValue(row.getCell(7)));
        newspaper.setCirculationBase(getCellValue(row.getCell(8)));
        newspaper.setCirculation(Long.parseLong(getCellValue(row.getCell(9))));
        newspaper.setRate(Double.parseDouble(getCellValue(row.getCell(10))));

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

}
