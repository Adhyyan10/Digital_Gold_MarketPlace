package com.example.goldmarket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GoldMarketApplication {

	public static void main(String[] args) {
		SpringApplication.run(GoldMarketApplication.class, args);
	}

}
