package org.ai.server.Repository;

import org.ai.server.model.ProductEntity;
import org.ai.server.model.ProductRatingEntity;
import org.ai.server.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<ProductRatingEntity,Long> {
    Optional<ProductRatingEntity> findByUserAndProduct(UserEntity user, ProductEntity product);
}
