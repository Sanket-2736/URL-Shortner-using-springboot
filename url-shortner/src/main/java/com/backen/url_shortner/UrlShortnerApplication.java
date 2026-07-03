package com.backen.url_shortner;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class UrlShortnerApplication {

	public static void main(String[] args) {
		// Load .env file FIRST before Spring initializes
		Dotenv dotenv = Dotenv.configure()
				.ignoreIfMissing()
				.load();
		
		// Set all environment variables as system properties
		dotenv.entries().forEach(entry -> {
			System.setProperty(entry.getKey(), entry.getValue());
		});
		
		SpringApplication.run(UrlShortnerApplication.class, args);
	}

}

