package org.ai.server.service;

import org.ai.server.dto.Response;
import org.ai.server.model.ProductEntity;
import org.ai.server.request.ProductRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {
    Response AddProduct(ProductEntity productEntity, List<MultipartFile>image);
    Response productList();
    Response productById(Long id);
    Response updateProduct(Long id,ProductRequest productRequest);
    int totalProducts();
    int totalProductsByStock(boolean stock);
    int totalProductsByCategory(String category);


}
