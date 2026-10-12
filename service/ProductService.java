package com.example.inzynierka.service;

import com.example.inzynierka.model.Product;
import com.example.inzynierka.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public Product getById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product create(Product p) {
        return productRepository.save(p);
    }
    public Product updateProduct(Long id, Product productData) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        product.setTitle(productData.getTitle());
        product.setDescription(productData.getDescription());
        product.setPrice(productData.getPrice());

        return productRepository.save(product);
    }

    public Product getProduct(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
    }

    public Product addImageToProduct(Long id, String url) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produkt nie znaleziony"));

        product.getImages().add(url);
        return productRepository.save(product);
    }

    public Product removeImageFromProduct(Long id, String imageUrl) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produkt nie znaleziony"));

        product.getImages().remove(imageUrl.replace("\"", "")); // usuwa z listy

        return productRepository.save(product);
    }
}