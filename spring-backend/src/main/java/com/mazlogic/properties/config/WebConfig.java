package com.mazlogic.properties.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${application.storage.image-directory}")
    private String uploadDirectory;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Create a path resolver for property images - use absolute path
        Path uploadDir = Paths.get(uploadDirectory).toAbsolutePath().normalize();
        String uploadPath = uploadDir.toString();
        
        if (!uploadPath.endsWith("/")) {
            uploadPath = uploadPath + "/";
        }
        
        // Enable directory listing for debugging
        System.out.println("Serving images from: " + uploadPath);
        
        // Make sure file: URL ends with slash for directory access
        String fileUrl = "file:" + uploadPath;
        if (!fileUrl.endsWith("/")) {
            fileUrl += "/";
        }
        
        // Configure resource handler with proper caching settings
        registry.addResourceHandler("/images/**")
                .addResourceLocations(fileUrl)
                .setCachePeriod(3600) // Cache for one hour
                .resourceChain(true);
        
        // Print some debug info
        System.out.println("Resource handler configured:");
        System.out.println(" - Pattern: /images/**");
        System.out.println(" - Location: " + fileUrl);
    }
}
