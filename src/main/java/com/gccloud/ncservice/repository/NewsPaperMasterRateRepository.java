package com.gccloud.ncservice.repository;

import com.gccloud.ncservice.entity.NewsPaperMasterRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface NewsPaperMasterRateRepository extends JpaRepository<NewsPaperMasterRate, Long> {

    @Query(value = "SELECT DISTINCT(newspaper_name) FROM newspaper order by newspaper_name asc;",nativeQuery = true)
    List<String> getAllNewsPaperName();

    @Query(value = "SELECT distinct(state) FROM newspaper  where newspaper_name=?1 order by state asc;",nativeQuery = true)
    List<String> getAllState(String newPaperName);

    @Query(value = "SELECT distinct(place_of_publication) FROM newspaper where newspaper_name=?1 order by place_of_publication asc;",nativeQuery = true)
    List<String> getPublicationName(String newspaperName);

    @Query(value = "SELECT distinct(place_of_publication) FROM newspaper where newspaper_name=?1 and state=?2 order by place_of_publication asc;",nativeQuery = true)
    List<String> getPublicationNameByState(String newspaperName, String state);

    @Query(value = "SELECT distinct(language) FROM newspaper  where newspaper_name=?1 order by language asc;",nativeQuery = true)
    List<String> getLanguage(String newspaperName);

    @Query(value = "SELECT distinct(language) FROM newspaper  where newspaper_name=?1 and place_of_publication=?2 order by language asc;",nativeQuery = true)
    List<String> getLanguageByPublication(String newspaperName, String publication);

    @Query(value = "SELECT distinct(rate) FROM newspaper  where newspaper_name=?1 AND place_of_publication=?2 AND language =?3;",nativeQuery = true)
    String getDavRates(String newspaperName, String edition, String language);

    @Query(value = "SELECT distinct(rate) FROM newspaper  where newspaper_name=?1 AND place_of_publication=?2 AND language =?3 AND periodicity=?4 AND category=?5 ;",nativeQuery = true)
    String getDavRatesWithHelpOfCatandPeriod(String newspaperName, String edition, String language, String periodicity, String category);

    @Query(value = "SELECT distinct(periodicity) FROM newspaper  where newspaper_name=?1 order by periodicity asc;",nativeQuery = true)
    List<String> getPeriodicityList(String newspaperName);

    @Query(value = "SELECT distinct(category) FROM newspaper  where newspaper_name=?1 order by category asc;",nativeQuery = true)
    List<String> getCategoryList(String newspaperName);

    @Query(value = "SELECT distinct(category) FROM newspaper  where newspaper_name=?1 AND periodicity=?2  order by category asc;",nativeQuery = true)
    List<String> getCategoryListByPeriodicity(String newspaperName, String periodicity);

    @Query(value = "SELECT DISTINCT(client_name) FROM ro_data ORDER BY client_name ASC",nativeQuery = true)
    List<String> getAllClientList();


    @Query(value = "SELECT DISTINCT(client_name) FROM ro_data WHERE submission_date=?1 ORDER BY client_name ASC",nativeQuery = true)
    List<String> getAllClientListBySubmissionDate(String submissionDate);

    @Query(value = " SELECT DISTINCT(ro_date) FROM ro_data WHERE submission_date=?1 AND client_name=?2 ORDER BY ro_date ASC ;",nativeQuery = true)
    List<String> getAllRoDateByClientNameAndSubmissionDate(String submissionDate, String clientName);

    @Query(value = " SELECT DISTINCT(newspaper_name) FROM ro_data WHERE submission_date=?1 AND client_name=?2 AND ro_date=?3 ORDER BY newspaper_name ASC ;",nativeQuery = true)
    List<String> getNewspaperListBySubmitdateRoDateAndClientName(String submissionDate, String clientName, String roDates);

    @Query(value = " SELECT * FROM ro_data WHERE submission_date=?1 AND client_name=?2 AND ro_date=?3 AND newspaper_name=?4 AND date_of_publication=?5 ORDER BY state ASC  ;",nativeQuery = true)
    List<Map<String,Object>> getDataForReleaseOrder(String submissionDate, String clientName, String roDates, String newspaper, String publishcationDate);

    @Query(value = " SELECT DISTINCT(date_of_publication) FROM ro_data WHERE submission_date=?1 AND client_name=?2 AND ro_date=?3 AND newspaper_name=?4 ORDER BY date_of_publication ASC  ;",nativeQuery = true)
    List<String> getPublishcationDate(String submissionDate, String clientName, String roDates, String newspaperName);
}

