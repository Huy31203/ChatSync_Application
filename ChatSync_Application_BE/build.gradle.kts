plugins {
	java
	id("org.springframework.boot") version "3.4.4"
	id("io.spring.dependency-management") version "1.1.7"
	id("io.freefair.lombok") version "8.6"
}

group = "vn.nphuy"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(17)
	}
}

repositories {
	mavenCentral()
}

dependencies {
    implementation("net.logstash.logback:logstash-logback-encoder:8.0")
    implementation("org.springframework:spring-messaging:6.2.5")
    implementation("org.springframework:spring-websocket:6.2.5")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-thymeleaf")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.thymeleaf.extras:thymeleaf-extras-springsecurity6")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-client")
    implementation("javax.servlet:javax.servlet-api:4.0.1")
    implementation("com.turkraft.springfilter:jpa:3.1.7")
    implementation("net.kaczmarzyk:specification-arg-resolver:3.1.0")
    implementation("com.cloudinary:cloudinary-http44:1.33.0")
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.7.0")
    implementation("org.modelmapper:modelmapper:3.2.2")
    implementation("org.springframework.boot:spring-boot-starter-mail")
    implementation("com.github.vladimir-bukhtoyarov:bucket4j-core:7.6.0")
    implementation("org.springframework.boot:spring-boot-starter-cache:3.4.3")
    implementation("com.github.ben-manes.caffeine:caffeine:3.2.0")
    developmentOnly("org.springframework.boot:spring-boot-devtools")
    runtimeOnly("com.mysql:mysql-connector-j")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")
}

tasks.withType<Test> {
	useJUnitPlatform()
}

