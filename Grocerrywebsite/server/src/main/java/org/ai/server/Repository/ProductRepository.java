package org.ai.server.Repository;

import org.ai.server.model.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity,Long> {
    List<ProductEntity> findByInStock(boolean stock);
    List<ProductEntity> findByCategory(String category);
}
