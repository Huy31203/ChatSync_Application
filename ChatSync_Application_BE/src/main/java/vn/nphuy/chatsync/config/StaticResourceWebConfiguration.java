package vn.nphuy.chatsync.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceWebConfiguration implements WebMvcConfigurer {
    @Value("${nghuy.upload-file.base-uri}")
    private String uploadUri;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/storage/**").addResourceLocations(uploadUri);
    }
}
