package com.stockflow.service;

import com.stockflow.dto.PageResponseDto;
import com.stockflow.dto.ProductResponseDto;
import com.stockflow.entity.Product;
import com.stockflow.exception.ProductNotFoundException;
import com.stockflow.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public PageResponseDto<ProductResponseDto> findAll(int page, int size, String category) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Product> productPage;

        if (category != null && !category.isBlank()) {
            productPage = productRepository.findByCategory(category, pageable);
        } else {
            productPage = productRepository.findAll(pageable);
        }

        List<ProductResponseDto> content = productPage.getContent().stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        return new PageResponseDto<>(
                content,
                productPage.getTotalElements(),
                productPage.getTotalPages(),
                productPage.getNumber(),
                productPage.getSize()
        );
    }

    public ProductResponseDto findById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        return toDto(product);
    }

    public List<String> findAllCategories() {
        return productRepository.findAllCategories();
    }

    private ProductResponseDto toDto(Product product) {
        return new ProductResponseDto(
                product.getId(),
                product.getSku(),
                product.getName(),
                product.getCategory(),
                product.getCurrentStock(),
                product.getMinStock(),
                product.getUnitPrice()
        );
    }
}