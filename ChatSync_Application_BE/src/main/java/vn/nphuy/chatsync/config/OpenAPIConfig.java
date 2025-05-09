package vn.nphuy.chatsync.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

    @Value("${server.servlet.context-path}")
    private String contextPath;

    private SecurityScheme createAPIKeyScheme() {
        return new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .bearerFormat("JWT")
                .scheme("bearer");
    }

    private Server createServer(String url, String description) {
        Server server = new Server();
        server.setUrl(url);
        server.setDescription(description);
        return server;
    }

    private Contact createContact() {
        return new Contact().email("nghuy31203@gmail.com").name("Nguyễn Phúc Huy");
    }

    private License createLicense() {
        return new License().name("MIT License").url("https://choosealicense.com/licenses/mit/");
    }

    private Info createApiInfo() {
        return new Info()
                .title("Job Hunter API")
                .version("1.0")
                .contact(createContact())
                .description("This API exposes all endpoints (job hunter)")
                .license(createLicense());
    }

    @Bean
    public OpenAPI myOpenAPI() {
        return new OpenAPI()
                .info(createApiInfo())
                .servers(
                        List.of(
                                createServer(
                                        "https://chatsync-application.onrender.com" + contextPath,
                                        "Server URL in Development environment")))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(
                        new Components()
                                .addSecuritySchemes("Bearer Authentication", createAPIKeyScheme()));
    }
}
