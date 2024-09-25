package com.e102.shop.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.security.SecureRandom;

@Configuration
public class AppConfig {

    @Bean
    public SecureRandom secureRandom(){
        return new SecureRandom();
    }
}
