package com.gccloud.ncservice.repository;

import com.gccloud.ncservice.entity.RoGenerationData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface RoGenerationDataRepository extends JpaRepository<RoGenerationData,Long> {

    @Query(value = "SELECT * FROM ro_data ORDER BY submission_date,newspaper_name,client_name,ro_date,date_of_publication,ro_number ;",nativeQuery = true)
    List<RoGenerationData> findAllByOrder();


    @Query(value = "SELECT \n" +
            "    CASE\n" +
            "        -- If data exists for the provided newspaper_name and submission_date, get the last part of ro_number for that specific date\n" +
            "        WHEN EXISTS (\n" +
            "            SELECT 1\n" +
            "            FROM ro_data\n" +
            "            WHERE newspaper_name = ?1   -- Replace with your target newspaper_name\n" +
            "              AND submission_date = ?2    -- Replace with your target submission_date\n" +
            "        ) THEN (\n" +
            "            -- Fetch the ro_number for the given date and newspaper_name\n" +
            "            CAST(SUBSTRING_INDEX(\n" +
            "                (SELECT ro_number\n" +
            "                 FROM ro_data\n" +
            "                 WHERE newspaper_name = ?1   -- Replace with your target newspaper_name\n" +
            "                   AND submission_date = ?2    -- Replace with your target submission_date\n" +
            "                 LIMIT 1\n" +
            "                ), '/', -1) AS UNSIGNED)\n" +
            "        )\n" +
            "        \n" +
            "        -- If data does not exist for the provided date and newspaper_name, fetch the highest ro_number and increment the value\n" +
            "        ELSE (\n" +
            "            -- Find the highest ro_number in the database and increment the last part by 1\n" +
            "            CAST(SUBSTRING_INDEX(\n" +
            "                (SELECT ro_number\n" +
            "                 FROM ro_data\n" +
            "                 ORDER BY CAST(SUBSTRING_INDEX(ro_number, '/', -1) AS UNSIGNED) DESC\n" +
            "                 LIMIT 1\n" +
            "                ), '/', -1) AS UNSIGNED) + 1\n" +
            "        )\n" +
            "    END AS valueLast2\n" +
            "FROM \n" +
            "    ro_data\n" +
            "LIMIT 1;\n",nativeQuery = true)
    String getRoLastDigitNumber(String clientName, String submissionDate);

    @Query(value = "SELECT DISTINCT(client_name) FROM ro_data ORDER BY client_name ASC",nativeQuery = true)
    List<String> getAllClientList();


    @Query(value = "SELECT DISTINCT(client_name) FROM ro_data WHERE submission_date=?1 ORDER BY client_name ASC",nativeQuery = true)
    List<String> getAllClientListBySubmissionDate(String submissionDate);

    @Query(value = " SELECT DISTINCT(ro_date) FROM ro_data WHERE submission_date=?1 AND client_name=?2 ORDER BY ro_date ASC ;",nativeQuery = true)
    List<String> getAllRoDateByClientNameAndSubmissionDate(String submissionDate, String clientName);

    @Query(value = " SELECT DISTINCT(newspaper_name) FROM ro_data WHERE submission_date=?1 AND client_name=?2 AND ro_date=?3 ORDER BY newspaper_name ASC ;",nativeQuery = true)
    List<String> getNewspaperListBySubmitdateRoDateAndClientName(String submissionDate, String clientName, String roDates);

    @Query(value = " SELECT * FROM ro_data WHERE submission_date=?1 AND client_name=?2 AND ro_date=?3 AND newspaper_name=?4 AND date_of_publication=?5 AND ro_number=?6 ORDER BY state ASC  ;",nativeQuery = true)
    List<Map<String,Object>> getDataForReleaseOrder(String submissionDate, String clientName, String roDates, String newspaper, String publishcationDate, String generateRoNumber);

    @Query(value = " SELECT DISTINCT(date_of_publication) FROM ro_data WHERE submission_date=?1 AND client_name=?2 AND ro_date=?3 AND newspaper_name=?4 ORDER BY date_of_publication ASC  ;",nativeQuery = true)
    List<String> getPublishcationDate(String submissionDate, String clientName, String roDates, String newspaperName);


    @Query(value = " SELECT DISTINCT(ro_number) FROM ro_data WHERE submission_date=?1 AND client_name=?2 AND ro_date=?3 AND newspaper_name=?4 AND date_of_publication=?5 ORDER BY ro_number ASC ",nativeQuery = true)
    List<String> getRoList(String submissionDate, String clientName, String roDates, String newspaperName, String publishDate);
}
