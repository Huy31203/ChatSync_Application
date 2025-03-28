package vn.nphuy.chatapp.domain.response;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.nphuy.chatapp.util.constant.MemberRoleEnum;

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

  private Instant createdAt;

  private Instant updatedAt;
}
