package com.gccloud.ncservice.repository;

import com.gccloud.ncservice.entity.RoGenerationData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoGenerationDataRepository extends JpaRepository<RoGenerationData,Long> {
}
