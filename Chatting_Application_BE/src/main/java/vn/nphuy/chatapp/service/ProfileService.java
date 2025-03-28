package vn.nphuy.chatapp.service;

import org.hibernate.Session;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import vn.nphuy.chatapp.domain.Profile;
import vn.nphuy.chatapp.domain.response.Meta;
import vn.nphuy.chatapp.domain.response.ResultPaginationDTO;
import vn.nphuy.chatapp.repository.ProfileRepository;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final EntityManager entityManager;

    public ResultPaginationDTO getAllProfile(Specification<Profile> spec, Pageable pageable) {
        Session session = entityManager.unwrap(Session.class);
        session.enableFilter("deletedProfilesFilter");

        Page<Profile> profiles = profileRepository.findAll(spec, pageable);

        session.disableFilter("deletedProfilesFilter");

        ResultPaginationDTO result = new ResultPaginationDTO();
        Meta meta = new Meta();

        meta.setPage(profiles.getNumber() + 1);
        meta.setPageSize(profiles.getSize());

        meta.setTotalPages(profiles.getTotalPages());
        meta.setTotalElements(profiles.getTotalElements());

        result.setMeta(meta);
        result.setData(profiles.getContent());

        return result;
    }

    public Profile getProfileById(String id) {
        Session session = entityManager.unwrap(Session.class);
        session.enableFilter("deletedProfilesFilter");

        Profile profile = profileRepository.findOneById(id).orElse(null);

        session.disableFilter("deletedProfilesFilter");

        return profile;
    }

    public Profile getProfileByEmail(String email) {
        return profileRepository.findOneByEmailAndDeletedFalse(email).orElse(null);
    }

    public Profile createProfile(Profile profile) {
        return profileRepository.save(profile);
    }

    public boolean isEmailExist(String email) {
        return profileRepository.existsByEmail(email);
    }

    // public Profile getProfileByResetTokenAndEmail(String resetToken, String
    // email) {
    // return profileRepository.findByPasswordResetTokenAndEmail(resetToken,
    // email).orElse(null);
    // }

    public Profile updateProfile(Profile profile) {
        Profile existingProfile = this.getProfileById(profile.getId());
        if (existingProfile != null) {

            existingProfile.setName(
                    null != profile.getName() ? profile.getName() : existingProfile.getName());

            existingProfile.setAvatarUrl(
                    null != profile.getAvatarUrl() ? profile.getAvatarUrl()
                            : existingProfile.getAvatarUrl());

            return profileRepository.save(existingProfile);
        } else {
            return null;
        }
    }

    // public void updateProfileResetToken(String email, String refreshToken) {
    // Profile profile = profileRepository.findByEmail(email);
    // if (profile != null) {
    // profile.setPasswordResetToken(refreshToken);
    // profileRepository.save(profile);
    // }
    // }

    public void updateProfilePassword(String email, String password) {
        Profile profile = profileRepository.findOneByEmailAndDeletedFalse(email).orElse(null);
        if (profile != null) {
            profile.setPassword(password);
            profileRepository.save(profile);
        }
    }

    public boolean deleteProfile(String id) {
        if (profileRepository.existsById(id)) {
            profileRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
}
