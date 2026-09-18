package com.shopdemo.product;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

  private final ProductRepository productRepository;

  public ProductService(ProductRepository productRepository) {
    this.productRepository = productRepository;
  }

  public ProductResponse create(ProductRequest request) {
    Product product =
        new Product(
            request.name(), request.description(), request.price(), request.stockQuantity());
    return ProductResponse.from(productRepository.save(product));
  }

  public List<ProductResponse> list() {
    return productRepository.findAll().stream().map(ProductResponse::from).toList();
  }

  public ProductResponse getById(Long id) {
    return ProductResponse.from(findProductOrThrow(id));
  }

  public ProductResponse update(Long id, ProductRequest request) {
    Product product = findProductOrThrow(id);
    product.setName(request.name());
    product.setDescription(request.description());
    product.setPrice(request.price());
    product.setStockQuantity(request.stockQuantity());
    return ProductResponse.from(productRepository.save(product));
  }

  public void delete(Long id) {
    if (!productRepository.existsById(id)) {
      throw new ProductNotFoundException(id);
    }
    productRepository.deleteById(id);
  }

  private Product findProductOrThrow(Long id) {
    return productRepository.findById(id).orElseThrow(() -> new ProductNotFoundException(id));
  }
}
