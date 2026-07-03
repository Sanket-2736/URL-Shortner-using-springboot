package com.backen.url_shortner.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DotEnvConfig {
    
    static {
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();
        
        // Load environment variables from .env file into System properties
        dotenv.entries().forEach(entry -> {
            // Always set system property to ensure Spring can access it
            System.setProperty(entry.getKey(), entry.getValue());
        });
    }
}
