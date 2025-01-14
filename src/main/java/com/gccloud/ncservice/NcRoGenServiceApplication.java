package com.gccloud.ncservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@SpringBootApplication
public class NcRoGenServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(NcRoGenServiceApplication.class, args);
    }

}
