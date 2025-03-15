package vn.nphuy.chatapp.config;

import java.util.HashSet;
import java.util.Set;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import vn.nphuy.chatapp.util.SecurityUtil;

@Slf4j
public class PermissionInterceptor implements HandlerInterceptor {

    private final SecurityUtil securityUtil;
    private final Set<String> getOnlyPaths = new HashSet<>();

    public PermissionInterceptor(SecurityUtil securityUtil) {
        this.securityUtil = securityUtil;
    }

    public void addGetOnlyPath(String path) {
        getOnlyPaths.add(path);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean preHandle(
            HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        // String path = (String)
        // request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);
        // String requestURI = request.getRequestURI();
        // String httpMethod = request.getMethod();

        // // Allow GET methods for specific paths without authentication
        // if ("GET".equals(httpMethod) &&
        // getOnlyPaths.stream().anyMatch(path::startsWith)) {
        // return true;
        // }

        // log.info(">>> RUN preHandle");
        // log.info(">>> path= " + path);
        // log.info(">>> httpMethod= " + httpMethod);
        // log.info(">>> requestURI= " + requestURI);

        // // check permission
        // User currentUser = securityUtil.getCurrentUser();
        // if (currentUser == null) {
        // throw new NotAuthorizedException("You are not logged in");
        // }

        // // check if user has role
        // Role userRole = currentUser.getRole();
        // if (userRole == null) {
        // throw new NotAllowedException("User has no role");
        // }

        // // check if user has permission to access this path
        // List<Permission> permissions = userRole.getPermissions();
        // if (permissions == null || permissions.isEmpty()) {
        // throw new NotAllowedException("User has no permission");
        // }
        // boolean isAllow = permissions.stream()
        // .anyMatch(permission -> {
        // String permissionPath = permission.getApiPath();
        // String permissionMethod = permission.getMethod();
        // if (permissionPath == null || permissionPath.isEmpty()) {
        // return false;
        // }
        // if (permissionMethod == null || permissionMethod.isEmpty()) {
        // return false;
        // }
        // return permissionPath.equals(path) && permissionMethod.equals(httpMethod);
        // });

        // if (!isAllow) {
        // throw new NotAllowedException("User has no permission to access this path");
        // }

        // log.info("User has nessessary permission, continue...");
        return true;
    }
}
