package org.ai.server.serviceimpl;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.ai.server.Repository.ProductRepository;
import org.ai.server.Repository.RatingRepository;
import org.ai.server.Repository.UserRepository;
import org.ai.server.dto.ProductRatingDto;
import org.ai.server.dto.Response;
import org.ai.server.mapper.DtoConverter;
import org.ai.server.model.ProductEntity;
import org.ai.server.model.ProductRatingEntity;
import org.ai.server.model.UserEntity;
import org.ai.server.service.RatingService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class RatingServiceHandler implements RatingService {

    private final UserRepository userRepository;
    private final RatingRepository ratingRepository;
    private final ProductRepository productRepository;

    @Override
    public Response addRating(String email, Long productId, Integer rating) {
        try {
            // 1. Validate inputs
            if (rating < 1 || rating > 5) {

                return Response.error("Rating must be between 1 and 5",400);

            }



            UserEntity user = userRepository.findByEmail(email);

            if (user == null) {
                return Response.error("User not found",404);

            }

            // 3. Find course
            ProductEntity product = productRepository.findById(productId)
                    .orElseThrow(() -> new EntityNotFoundException("product not found"));



            // 4. Find existing rating or create new one
            Optional<ProductRatingEntity> existingRating = ratingRepository.findByUserAndProduct(user, product);
            ProductRatingEntity productRating;

            if (existingRating.isPresent()) {
                // Update existing rating
                productRating = existingRating.get();
                productRating.setRating(rating);
            } else {
                // Create new rating
                productRating = new ProductRatingEntity(user, product);
                productRating.setRating(rating);
                product.getRatings().add(productRating);
            }

            productRating.setRating(rating);
            ProductRatingEntity productRatingEntity= ratingRepository.save(productRating);
            product.getRatings().add(productRatingEntity);
            product.updateRatingStats();

            product=productRepository.save(product);
            ProductRatingDto productRatingDto= DtoConverter.convertProductRatingEntityToProductRatingDto(productRatingEntity);
            return Response.success("Rating submitted successfully")
                    .withProductRatingDto(productRatingDto)
                    .withAverageRating(product.getAverageRating())
                    .withRatingCount(product.getRatingCount());


        } catch (EntityNotFoundException e) {

            return Response.error(e.getMessage(),404);

        } catch (Exception e) {
            return Response.error("Error adding rating: " + e.getMessage(),500);

        }
    }

    @Override
    public Response getUserRating(String email, Long productId) {

        UserEntity user = userRepository.findByEmail(email);

        if (user == null) {
            return Response.error("User not found",404);

        }
        // 3. Find product
        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("product not found"));

        Optional<ProductRatingEntity> existingRating = ratingRepository.findByUserAndProduct(user, product);
        ProductRatingEntity productRating;

        if (existingRating.isPresent()) {
            return Response.success("Rating fetched successfully").withRatingCount(existingRating.get().getRating());
        } else {
            return Response.success("Rating fetched successfully").withRatingCount(0);
        }


    }
}
