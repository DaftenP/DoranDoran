package com.e102.jwt;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootTest
@EnableJpaAuditing
@EnableScheduling
class JwtApplicationTests {

	@Test
	void contextLoads() {
	}

}
