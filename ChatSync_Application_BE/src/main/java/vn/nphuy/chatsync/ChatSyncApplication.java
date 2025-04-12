package vn.nphuy.chatsync;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class ChatSyncApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChatSyncApplication.class, args);
    }
}
