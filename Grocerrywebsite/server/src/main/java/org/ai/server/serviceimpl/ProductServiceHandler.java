
package org.ai.server.serviceimpl;

import lombok.AllArgsConstructor;
import org.ai.server.Repository.ProductRepository;
import org.ai.server.dto.Response;
import org.ai.server.mapper.DtoConverter;
import org.ai.server.model.ProductEntity;
import org.ai.server.service.CloudinaryService;
import org.ai.server.service.ProductService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@AllArgsConstructor
public class ProductServiceHandler implements ProductService {
    private final ProductRepository productRepository;
    private final CloudinaryService cloudinaryService;

    @Override
    public Response AddProduct(ProductEntity productEntity, List<MultipartFile> images) {
        try {
            // Check if any required fields are missing
            if (productEntity.getName() == null || productEntity.getDescription() == null ||
                    productEntity.getPrice() == null || productEntity.getOfferPrice() == null ||
                    productEntity.getCategory() == null || images == null || images.isEmpty()) {
                return Response.error("Please provide all required product details and images.", 400);
            }

            // Initialize the image list if it's null
            if (productEntity.getImage() == null) {
                productEntity.setImage(new ArrayList<>());
            }

            // Upload each image and add its URL to the product's image list
            for (MultipartFile image : images) {
                try {
                    String imageUrl = cloudinaryService.uploadFile(image);
                    productEntity.getImage().add(imageUrl);
                } catch (Exception ex) {
                    return Response.error("Error while uploading image: " + ex.getMessage(), 500);
                }
            }

            // Save the product to the database
            ProductEntity savedProduct = productRepository.save(productEntity);

            // Convert the saved product entity to a DTO and include it in the response
            return Response.success("Product added successfully")
                    .withProduct(DtoConverter.convertProducttoProductDto(savedProduct));

        } catch (Exception e) {
            // Catch any unexpected errors and return a server error response
            return Response.error("Something went wrong while adding the product: " + e.getMessage(), 500);
        }
    }



    @Override
    public Response productList() {
       try{
           List<ProductEntity> products = productRepository.findAll();
           if (products.isEmpty()) {
               return Response.success("No products found").withProducts(Collections.emptyList());
           }
           return  Response.success("Products can be fetched successfully").withProducts(DtoConverter.convertProductListToProductDto(products));


       } catch (Exception e) {
           return Response.error("Products are not fetched successfully", 400);

       }
    }

    @Override
    public Response productById(Long id) {
        try{
           ProductEntity productEntity = productRepository.findById(id).orElseThrow(()-> new RuntimeException("Product not found"));
            if (productEntity == null) {
                return Response.error("Product cannot be found with this id", 400);
            }
            return  Response.success("Products can be fetched successfully").withProduct(DtoConverter.convertProducttoProductDto(productEntity));


        } catch (Exception e) {
            return Response.error("Product cannot be found with this id", 400);

        }
    }

    @Override
    public Response changeStock(Long id, boolean stock) {
        try{

            ProductEntity productEntity = productRepository.findById(id).orElseThrow(()-> new RuntimeException("Product not found"));
            productEntity.setInStock(stock);
           productEntity= productRepository.save(productEntity);
            return  Response.success("Products can be updated successfully").withProduct(DtoConverter.convertProducttoProductDto(productEntity));


        } catch (RuntimeException e) {
            return Response.error(e.getMessage(), 500);
        }

        catch (Exception e) {
            return Response.error("We can't get this product", 400);

        }
    }

    @Override
    public int totalProducts() {
        return productRepository.findAll().size();
    }

    @Override
    public int totalProductsByStock(boolean stock) {
        return productRepository.findByInStock(true).size();
    }

    @Override
    public int totalProductsByCategory(String category) {
        return productRepository.findByCategory(category).size();
    }
}
