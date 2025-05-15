package org.ai.server.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.ai.server.dto.Response;
import org.ai.server.dto.UserDto;
import org.ai.server.enumPackage.Role;
import org.ai.server.model.ProductEntity;
import org.ai.server.model.UserEntity;
import org.ai.server.service.ProductService;
import org.ai.server.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/product")
@AllArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final UserService userService;

    @PostMapping(value = "/addProduct", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<Response> addProduct(
            @RequestPart("product") String productString,
            @RequestPart("images") List<MultipartFile> images,@RequestHeader("Authorization") String token) throws JsonProcessingException {

        ObjectMapper objectMapper=new ObjectMapper();
        ProductEntity product=objectMapper.readValue(productString,ProductEntity.class);
        Response response =productService.AddProduct(product,images);
        return ResponseEntity.status(response.getStatusCode()).body(response);

    }
    @GetMapping("/productList")
    public ResponseEntity<Response> productList() {
        Response response =productService.productList();
        return ResponseEntity.status(response.getStatusCode()).body(response);

    }

    @GetMapping("/{productId}")
    public ResponseEntity<Response> productDetails(@PathVariable  Long productId) {

        Response response =productService.productById(productId);
        return ResponseEntity.status(response.getStatusCode()).body(response);

    }
   @PutMapping("/update/{productId}")
    public ResponseEntity<Response> updateProduct(@PathVariable  Long productId,@RequestParam  boolean stock) {
       System.out.println(productId);
        Response response =productService.changeStock(productId,stock);
        return ResponseEntity.status(response.getStatusCode()).body(response);

    }

}
