package com.gccloud.ncservice.repository;

import com.gccloud.ncservice.entity.NewsPaperMasterRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NewsPaperMasterRateRepository extends JpaRepository<NewsPaperMasterRate, Long> {
}