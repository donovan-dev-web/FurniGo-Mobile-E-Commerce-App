package com.furnigo.common.config;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    private final Path uploadsDirectory;

    public StaticResourceConfig(@Value("${app.uploads.dir:uploads}") String uploadsDirectory) throws IOException {
        Path path = Paths.get(uploadsDirectory);
        if (!path.isAbsolute()) {
            path = Paths.get("").toAbsolutePath().resolve(path);
        }

        this.uploadsDirectory = path.normalize();

        Files.createDirectories(this.uploadsDirectory);
        Files.createDirectories(this.uploadsDirectory.resolve("products"));
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(this.uploadsDirectory.toUri().toString());
    }
}
