package vn.nphuy.chatapp.service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UploadService {
  @Value("${nghuy.upload-file.base-uri}")
  private String uploadUri;

  public void createUploadFolder(String folder) throws URISyntaxException {
    URI uri = new URI(folder);
    Path path = Paths.get(uri);
    File tmpDir = new File(path.toString());
    if (!tmpDir.isDirectory()) {
      try {
        Files.createDirectory(tmpDir.toPath());
        log.info(">>> CREATE NEW DIRECTORY SUCCESSFUL, PATH = " + folder);
      } catch (IOException e) {
        e.printStackTrace();
      }
    } else {
      log.info(">>> SKIP MAKING DIRECTORY, ALREADY EXISTS");
    }
  }

  public String store(MultipartFile file, String folder) throws URISyntaxException,
      IOException {

    // get file extension
    String[] fileName = file.getOriginalFilename().split("\\.");
    String extension = fileName[fileName.length - 1];

    // create unique filename
    String finalName = UUID.randomUUID().toString() + "." + extension;

    URI uri = new URI(uploadUri + folder + "/" + finalName);
    Path path = Paths.get(uri);
    try (InputStream inputStream = file.getInputStream()) {
      Files.copy(inputStream, path,
          StandardCopyOption.REPLACE_EXISTING);
    }

    return finalName;
  }

  public long getFileSize(String fileName, String folder) throws URISyntaxException {
    URI uri = new URI(uploadUri + folder + "/" + fileName);
    Path path = Paths.get(uri);

    File tmpFile = new File(path.toString());

    // file not exist or a directory
    if (!Files.exists(path) || Files.isDirectory(path)) {
      return 0;
    }

    return tmpFile.length();
  }

  public InputStreamResource getResouce(String fileName, String folder) throws URISyntaxException,
      IOException {
    URI uri = new URI(uploadUri + folder + "/" + fileName);
    Path path = Paths.get(uri);

    InputStream inputStream = Files.newInputStream(path);
    return new InputStreamResource(inputStream);
  }
}
