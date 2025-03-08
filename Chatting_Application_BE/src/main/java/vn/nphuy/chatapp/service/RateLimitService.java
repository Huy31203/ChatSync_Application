package vn.nphuy.chatapp.service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;

@Service
public class RateLimitService {

  private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

  private Bucket createNewBucket(int capacity, int refillTokens, int refillMinutes) {
    Bandwidth limit = Bandwidth.classic(capacity,
        Refill.greedy(refillTokens, Duration.ofMinutes(refillMinutes)));
    return Bucket.builder().addLimit(limit).build();
  }

  public Bucket resolveBucket(String key) {
    return buckets.computeIfAbsent(key,
        k -> createNewBucket(5, 5, 10)); // 5 attempts per 10 minutes
  }

  public Bucket resolveRefreshBucket(String key) {
    return buckets.computeIfAbsent("refresh_" + key,
        k -> createNewBucket(2, 2, 10)); // 2 attempts per 10 minutes
  }

  public void clearBucket(String key) {
    buckets.remove(key);
    buckets.remove("refresh_" + key);
  }
}
