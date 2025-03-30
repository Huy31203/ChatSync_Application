package vn.nphuy.chatapp.domain.response;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

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

  @JsonManagedReference
  private ResMemberDTO sender;

  @JsonManagedReference
  private ResMemberDTO receiver;

  private List<ResDirectMessageDTO> directMessages;

  @JsonIgnoreProperties({ "relatedConversation", "inverseConversation" })
  private ResConversationDTO relatedConversation;

  @JsonIgnoreProperties({ "relatedConversation", "inverseConversation" })
  private ResConversationDTO inverseConversation;

  private Instant createdAt;

  private Instant updatedAt;
}
