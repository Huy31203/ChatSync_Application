package vn.nphuy.chatapp.domain.response;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResConversationDTO {
  private String id;

  @JsonIgnoreProperties("conversationSended")
  private ResMemberDTO sender;

  @JsonIgnoreProperties("conversationReceived")
  private ResMemberDTO receiver;

  private List<ResDirectMessageDTO> directMessages;

  private Instant createdAt;

  private Instant updatedAt;
}
