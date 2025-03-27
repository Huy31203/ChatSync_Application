package vn.nphuy.chatapp.controller;

import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.nphuy.chatapp.service.MessageService;
import vn.nphuy.chatapp.util.SecurityUtil;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1")
@Slf4j
public class MessageController {
  private final MessageService messageService;
  private final ModelMapper modelMapper;
  private final SecurityUtil securityUtil;
  
}
