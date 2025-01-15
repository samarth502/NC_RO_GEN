package com.gccloud.ncservice.repository;

import com.gccloud.ncservice.entity.NewsPaperMasterRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

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
}

