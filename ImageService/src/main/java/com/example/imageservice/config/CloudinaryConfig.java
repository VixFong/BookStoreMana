package com.example.imageservice.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    protected final String CLOUD_NAME = "dmdddwb1j";
    protected final String API_KEY = "238688598964586";
    protected final String API_SECRET = "MZGbwydJG1aUh_w69J-SK4Bd4MM";

    @Bean
    public Cloudinary cloudinary() {
        Map<String,String> config = new HashMap<>();
        config.put("cloud_name",CLOUD_NAME);
        config.put("api_key",API_KEY);
        config.put("api_secret",API_SECRET);

        return new Cloudinary(config);
    }
}
