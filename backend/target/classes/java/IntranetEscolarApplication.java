package com.colegio.intranet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class IntranetEscolarApplication {

    public static void main(String[] args) {

        System.out.println(
            new BCryptPasswordEncoder().encode("123456")
        );

        SpringApplication.run(IntranetEscolarApplication.class, args);
    }
}