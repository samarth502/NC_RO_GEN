package com.gccloud.ncservice.repository;

import com.gccloud.ncservice.entity.RoGenerationData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoGenerationDataRepository extends JpaRepository<RoGenerationData,Long> {

    @Query(value = "SELECT * FROM ro_data ORDER BY submission_date,newspaper_name,client_name,ro_date,date_of_publication,ro_number ;",nativeQuery = true)
    List<RoGenerationData> findAllByOrder();


}
