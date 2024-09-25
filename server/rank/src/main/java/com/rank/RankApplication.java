package com.rank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class RankApplication {

    public static void main(String[] args) {
        SpringApplication.run(RankApplication.class, args);
    }

}
