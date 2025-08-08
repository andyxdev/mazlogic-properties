package com.mazlogic.properties.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/system")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:8081"})
public class SystemController {

    @Value("${application.storage.image-directory}")
    private String uploadDirectory;

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getSystemInfo() {
        Map<String, Object> info = new HashMap<>();
        
        // Get image directory info
        Path uploadDir = Paths.get(uploadDirectory).toAbsolutePath().normalize();
        File uploadDirFile = uploadDir.toFile();
        
        info.put("imageDirectory", uploadDir.toString());
        info.put("directoryExists", uploadDirFile.exists());
        info.put("directoryCanRead", uploadDirFile.canRead());
        info.put("directoryCanWrite", uploadDirFile.canWrite());
        
        // Get file listing if directory exists
        if (uploadDirFile.exists() && uploadDirFile.isDirectory()) {
            String[] files = uploadDirFile.list();
            info.put("files", files != null ? Arrays.asList(files) : "No files found");
        }
        
        return ResponseEntity.ok(info);
    }
}
