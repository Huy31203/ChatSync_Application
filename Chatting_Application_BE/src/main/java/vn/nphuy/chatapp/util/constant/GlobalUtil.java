package vn.nphuy.chatapp.util.constant;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class GlobalUtil {
    private GlobalUtil() {
        throw new IllegalStateException("Utility class");
    }

    public static boolean checkValidEmail(String email) {
        String emailRegex = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$";
        Pattern pattern = Pattern.compile(emailRegex, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(email);

        return matcher.matches();
    }

    @SafeVarargs
    public static <T> List<T> appendElements(List<T> immutableList, T... elements) {
        List<T> tmpList = new ArrayList<>(immutableList);
        tmpList.addAll(Arrays.asList(elements));
        return tmpList;
    }

    @SafeVarargs
    public static <T> List<T> removeElements(List<T> immutableList, T... elements) {
        List<T> tmpList = new ArrayList<>(immutableList);
        for (T element : elements) {
            tmpList.remove(element);
        }
        return tmpList;
    }

    public static final String[] AUTH_WHITELISTS = {
            "/v1/auth/login",
            "/v1/auth/register",
            "/v1/auth/forgot-password",
            "/v1/auth/refresh",
            "/v1/auth/logout",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html",
    };

    public static final String[] GET_WHITELISTS = {
            "/storage/**",
    };
}
