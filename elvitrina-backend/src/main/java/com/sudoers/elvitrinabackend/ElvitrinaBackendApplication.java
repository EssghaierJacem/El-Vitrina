package com.sudoers.elvitrinabackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ElvitrinaBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(ElvitrinaBackendApplication.class, args);
    }

}
