package com.shopdemo.product;

import static org.assertj.core.api.Assertions.assertThat;

import com.shopdemo.AbstractIntegrationTest;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ProductRepositoryTest extends AbstractIntegrationTest {

  @Autowired private ProductRepository productRepository;

  @Test
  void savesAndFindsProductById() {
    Product saved =
        productRepository.save(new Product("Widget", "A widget", new BigDecimal("9.99"), 10));

    Optional<Product> found = productRepository.findById(saved.getId());

    assertThat(found).isPresent();
    assertThat(found.get().getName()).isEqualTo("Widget");
    assertThat(found.get().getCreatedAt()).isNotNull();
    assertThat(found.get().getUpdatedAt()).isNotNull();
  }

  @Test
  void findAllReturnsAllSavedProducts() {
    productRepository.save(new Product("Widget", "A widget", new BigDecimal("9.99"), 10));
    productRepository.save(new Product("Gadget", "A gadget", new BigDecimal("19.99"), 5));

    List<Product> products = productRepository.findAll();

    assertThat(products).hasSize(2);
  }

  @Test
  void deleteRemovesProduct() {
    Product saved =
        productRepository.save(new Product("Widget", "A widget", new BigDecimal("9.99"), 10));

    productRepository.deleteById(saved.getId());

    assertThat(productRepository.findById(saved.getId())).isEmpty();
  }
}
