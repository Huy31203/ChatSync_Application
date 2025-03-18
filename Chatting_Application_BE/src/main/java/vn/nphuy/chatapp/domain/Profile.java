package vn.nphuy.chatapp.domain;

import java.util.List;

import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.SQLDelete;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@SQLDelete(sql = "UPDATE profiles SET deleted = true WHERE id=?")
@FilterDef(name = "deletedProfilesFilter")
@Filter(name = "deletedProfilesFilter", condition = "deleted = false")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Profile extends AbstractEntity {

    @Column(unique = true)
    @NotBlank(message = "Email is required")
    @Email(regexp = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}", flags = Pattern.Flag.CASE_INSENSITIVE, message = "Email is invalid")
    private String email;

    private String password;

    @NotBlank(message = "Name is required")
    private String name;

    private String avatarUrl;

    @OneToMany(mappedBy = "profile", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Refresh> refreshTokens;

    @OneToMany(mappedBy = "profile", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Member> members;

    @OneToOne(mappedBy = "profile", fetch = FetchType.LAZY)
    private ProfileConnectedAccount connectedAccount;

    public List<Member> getMembers() {
        return members != null
                ? members.stream().filter(member -> !member.isDeleted()).toList()
                : List.of();
    }
}
