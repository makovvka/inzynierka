package com.example.inzynierka.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dchnzs11g",
                "api_key", "891932777292638",
                "api_secret", "taVTnnJ6q8aC8fKEz6-TvJqybTM"
        ));
    }
}
