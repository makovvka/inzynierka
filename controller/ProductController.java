package com.example.inzynierka.controller;

import com.example.inzynierka.model.Product;
import com.example.inzynierka.service.ImageUploadService;
import com.example.inzynierka.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductService productService;
    private final ImageUploadService imageUploadService;

    @GetMapping
    public List<Product> getAll() {
        return productService.getAll();
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return productService.getById(id);
    }

    @PostMapping
    public Product create(@RequestBody Product p) {
        return productService.create(p);
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return productService.updateProduct(id, product);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }


    @PostMapping("/{id}/images")
    public Product uploadImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {

        String imageUrl = imageUploadService.uploadImage(file);
        return productService.addImageToProduct(id, imageUrl);
    }
    @DeleteMapping("/{id}/images")
    public Product deleteImage(
            @PathVariable Long id,
            @RequestBody String imageUrl
    ) {
        return productService.removeImageFromProduct(id, imageUrl);
    }

}
