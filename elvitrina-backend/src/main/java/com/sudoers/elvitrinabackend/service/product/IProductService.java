package com.sudoers.elvitrinabackend.service.product;

import com.sudoers.elvitrinabackend.model.entity.Product;

import java.util.List;

public interface IProductService {
    Product createProduct(Product product);
    Product getProductById(Long id);
    List<Product> getAllProducts();
    Product updateProduct(Long id, Product productDetails);
    void deleteProduct(Long id);
}
