package vn.nphuy.chatapp.domain;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.SQLDelete;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@SQLDelete(sql = "UPDATE servers SET deleted = true WHERE id=?")
@FilterDef(name = "deletedServersFilter")
@Filter(name = "deletedServersFilter", condition = "deleted = false")
@Getter
@Setter
public class Server extends AbstractEntity {
  @NotBlank(message = "Name is required")
  private String name;

  private String imageUrl;

  @Column(unique = true)
  private String inviteCode;

  @OneToMany(mappedBy = "server")
  @JsonProperty(access = JsonProperty.Access.READ_ONLY)
  private List<Member> members;

  public List<Member> getMembers() {
    return members != null ? members.stream().filter(member -> !member.isDeleted()).toList() : List.of();
  }
}
