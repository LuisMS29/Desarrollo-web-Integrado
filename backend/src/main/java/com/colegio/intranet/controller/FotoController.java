package com.colegio.intranet.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
public class FotoController {

    @Value("${app.upload.dir:uploads/fotos}")
    private String uploadDir;

    @GetMapping("/api/uploads/{dir}/{filename:.+}")
    public ResponseEntity<Resource> servirFoto(@PathVariable String dir, @PathVariable String filename) {
        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Path filePath = uploadPath.resolve(filename).normalize();

            // Security: ensure the resolved path is still inside the upload directory
            if (!filePath.startsWith(uploadPath)) {
                return ResponseEntity.badRequest().build();
            }

            Resource resource = new FileSystemResource(filePath.toFile());
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            // Infer media type from file extension
            MediaType mediaType = MediaType.IMAGE_PNG;
            String name = filename.toLowerCase();
            if (name.endsWith(".jpg") || name.endsWith(".jpeg")) {
                mediaType = MediaType.IMAGE_JPEG;
            } else if (name.endsWith(".gif")) {
                mediaType = MediaType.IMAGE_GIF;
            } else if (name.endsWith(".webp")) {
                mediaType = MediaType.valueOf("image/webp");
            } else if (name.endsWith(".svg")) {
                mediaType = MediaType.valueOf("image/svg+xml");
            }

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
