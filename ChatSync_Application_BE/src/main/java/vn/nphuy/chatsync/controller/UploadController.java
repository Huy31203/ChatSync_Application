package vn.nphuy.chatsync.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URISyntaxException;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.nphuy.chatsync.domain.response.ResUploadDTO;
import vn.nphuy.chatsync.service.UploadService;
import vn.nphuy.chatsync.util.annotation.ApiMessage;
import vn.nphuy.chatsync.util.error.UploadException;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("storage")
public class UploadController {
  private final UploadService uploadService;

  @Value("${nghuy.upload-file.base-uri}")
  private String uploadUri;

  @Value("${nphuy.server.url}")
  private String serverUrl;

  @Value("${server.servlet.context-path}")
  private String contextPath;

  @GetMapping("image")
  @ApiMessage(message = "Serve image file")
  public ResponseEntity<Resource> serveImage(
      @RequestParam("fileName") String fileName,
      @RequestParam("folder") String folder) throws URISyntaxException, IOException {

    log.info(">> Serving image file: {}", fileName);

    if (fileName == null || fileName.isEmpty() || folder == null || folder.isEmpty()) {
      throw new FileNotFoundException("Missing file name or folder");
    }

    // check if the file exists and not a directory
    long fileSize = uploadService.getFileSize(fileName, folder);
    if (fileSize == 0) {
      throw new FileNotFoundException("File with name " + fileName + " not found");
    }

    // Get the file
    InputStreamResource resource = uploadService.getResouce(fileName, folder);

    // Determine content type based on file extension
    MediaType mediaType = MediaType.IMAGE_JPEG;
    if (fileName.toLowerCase().endsWith(".png")) {
      mediaType = MediaType.IMAGE_PNG;
    } else if (fileName.toLowerCase().endsWith(".gif")) {
      mediaType = MediaType.IMAGE_GIF;
    } else if (fileName.toLowerCase().endsWith(".webp")) {
      mediaType = new MediaType("image", "webp");
    }

    log.info(">> Serving image file: {} with size: {} bytes", fileName, fileSize);

    return ResponseEntity.ok()
        .contentLength(fileSize)
        .contentType(mediaType)
        .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
        .body(resource);
  }

  @PostMapping("image/upload")
  @ApiMessage(message = "Upload image")
  public ResponseEntity<Object> uploadImage(
      @RequestParam("file") MultipartFile file,
      @RequestParam("folder") String folder) throws URISyntaxException, IOException {

    log.info(">> Uploading image file: {}", file.getOriginalFilename());

    // Check if file is empty
    if (file == null || file.isEmpty()) {
      throw new UploadException("File is empty, please select a file to upload");
    }

    // check file size > 5MB
    if (file.getSize() > 5 * 1024 * 1024) {
      throw new UploadException("File size is too large, please select a file smaller than 5MB");
    }

    String originalName = file.getOriginalFilename();
    List<String> allowedExtensions = Arrays.asList("jpg", "jpeg", "png", "gif", "bmp", "webp");
    boolean isAllowed = allowedExtensions.stream()
        .anyMatch(originalName.toLowerCase()::endsWith);

    if (!isAllowed) {
      throw new UploadException(
          "File type is not allowed, please select an image file");
    }

    // Create folder if not exist
    uploadService.createUploadFolder(uploadUri + folder);

    // Store file
    String fileName = uploadService.store(file, folder);
    String fileUrl = serverUrl + contextPath + "/storage/image?fileName=" + fileName + "&folder=" + folder;

    ResUploadDTO res = new ResUploadDTO();

    res.setFileUrl(fileUrl);
    res.setUploadedAt(Instant.now());

    log.info(">> Uploaded image file: {} with size: {} bytes", fileName, file.getSize());

    // Return path to file
    return ResponseEntity.status(201).body(res);
  }

  @PostMapping("file/upload")
  @ApiMessage(message = "Upload file")
  public ResponseEntity<Object> uploadFile(
      @RequestParam("file") MultipartFile file,
      @RequestParam("folder") String folder) throws URISyntaxException, IOException {

    log.info(">> Uploading file: {}", file.getOriginalFilename());

    // Check if file is empty
    if (file == null || file.isEmpty()) {
      throw new UploadException("File is empty, please select a file to upload");
    }

    // check file size > 5MB
    if (file.getSize() > 5 * 1024 * 1024) {
      throw new UploadException("File size is too large, please select a file smaller than 5MB");
    }

    // Create folder if not exist
    uploadService.createUploadFolder(uploadUri + folder);

    // Store file
    String fileName = uploadService.store(file, folder);
    String fileUrl = serverUrl + contextPath + "/storage/file/download?fileName=" + fileName + "&folder=" + folder;

    ResUploadDTO res = new ResUploadDTO();

    res.setFileUrl(fileUrl);
    res.setUploadedAt(Instant.now());

    log.info(">> Uploaded file: {} with size: {} bytes", fileName, file.getSize());

    // Return path to file
    return ResponseEntity.status(201).body(res);
  }

  @GetMapping("file/download")
  @ApiMessage(message = "Download file")
  public ResponseEntity<Resource> downloadFile(
      @RequestParam("fileName") String fileName,
      @RequestParam("folder") String folder) throws URISyntaxException, IOException {

    log.info(">> Downloading file: {}", fileName);

    if (fileName == null || fileName.isEmpty() || folder == null || folder.isEmpty()) {
      throw new FileNotFoundException("Missing file name or folder");
    }

    // check if the file exists and not a directory
    long fileSize = uploadService.getFileSize(fileName, folder);
    if (fileSize == 0) {
      throw new FileNotFoundException("File with name " + fileName + " not found");
    }

    // download file
    InputStreamResource resource = uploadService.getResouce(fileName, folder);

    log.info(">> Downloading file: {} with size: {} bytes", fileName, fileSize);

    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
        .contentLength(fileSize)
        .contentType(MediaType.APPLICATION_OCTET_STREAM)
        .body(resource);
  }
}
