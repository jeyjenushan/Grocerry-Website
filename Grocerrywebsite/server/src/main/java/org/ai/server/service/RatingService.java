package org.ai.server.service;

import org.ai.server.dto.Response;

public interface RatingService {
    Response addRating(String email, Long productId, Integer rating);
    Response getUserRating(String email, Long productId);
}
