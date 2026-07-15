package com.email.writer.ratelimit;

import com.email.writer.exception.RateLimitExceededException;
import java.time.Clock;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RateLimitService {

	private final RateLimitProperties properties;
	private final Clock clock;
	private final ConcurrentMap<String, WindowCounter> counters = new ConcurrentHashMap<>();

	@Autowired
	public RateLimitService(RateLimitProperties properties) {
		this(properties, Clock.systemUTC());
	}

	RateLimitService(RateLimitProperties properties, Clock clock) {
		this.properties = properties;
		this.clock = clock;
	}

	public void check(String clientKey) {
		if (!properties.enabled()) {
			return;
		}
		long now = clock.millis();
		long windowMillis = properties.window().toMillis();
		WindowCounter counter = counters.compute(clientKey, (key, current) -> {
			if (current == null || now >= current.windowStartedAt + windowMillis) {
				return new WindowCounter(now, 1);
			}
			return new WindowCounter(current.windowStartedAt, current.count + 1);
		});
		if (counter.count > properties.requestsPerWindow()) {
			throw new RateLimitExceededException("Too many requests. Please try again later.");
		}
	}

	private record WindowCounter(long windowStartedAt, int count) {
	}
}
