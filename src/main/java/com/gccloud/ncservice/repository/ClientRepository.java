package com.gccloud.ncservice.repository;

import com.gccloud.ncservice.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface ClientRepository extends JpaRepository<Client,Long> {


    @Query(value = "SELECT DISTINCT(client_name) FROM client;",nativeQuery = true)
    List<String> fetchClientList();

    @Query(value = "SELECT * FROM client ORDER BY client_name ASC;",nativeQuery = true)
    List<Map<String, Object>> fetchClientData();

    @Query(value = "SELECT client_short_form FROM client WHERE client_name =?1 ORDER BY client_short_form ASC;",nativeQuery = true)
    List<Map<String, Object>> fetClientSpecialID(String clientName);
}
