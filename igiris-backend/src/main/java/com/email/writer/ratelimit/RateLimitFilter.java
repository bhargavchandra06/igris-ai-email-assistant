package com.email.writer.ratelimit;

import com.email.writer.exception.RateLimitExceededException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

	private final RateLimitService rateLimitService;
	private final ClientIpResolver clientIpResolver;
	private final HandlerExceptionResolver exceptionResolver;

	public RateLimitFilter(
			RateLimitService rateLimitService,
			ClientIpResolver clientIpResolver,
			@Qualifier("handlerExceptionResolver") HandlerExceptionResolver exceptionResolver
	) {
		this.rateLimitService = rateLimitService;
		this.clientIpResolver = clientIpResolver;
		this.exceptionResolver = exceptionResolver;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		try {
			if (request.getRequestURI().startsWith("/api/v1/email")) {
				rateLimitService.check(clientIpResolver.resolve(request));
			}
			filterChain.doFilter(request, response);
		}
		catch (RateLimitExceededException ex) {
			exceptionResolver.resolveException(request, response, null, ex);
		}
	}
}
