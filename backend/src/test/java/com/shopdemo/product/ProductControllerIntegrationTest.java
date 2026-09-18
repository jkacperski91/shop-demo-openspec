package com.shopdemo.product;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.shopdemo.AbstractIntegrationTest;
import java.math.BigDecimal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerIntegrationTest extends AbstractIntegrationTest {

  @Autowired private MockMvc mockMvc;
  @Autowired private ObjectMapper objectMapper;
  @Autowired private ProductRepository productRepository;

  @BeforeEach
  void cleanDatabase() {
    productRepository.deleteAll();
  }

  @Test
  void createsProductAndReturnsIt() throws Exception {
    String body = requestJson("Widget", "A widget", "9.99", 10);

    mockMvc
        .perform(post("/api/products").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").exists())
        .andExpect(jsonPath("$.name").value("Widget"));

    assertThat(productRepository.findAll()).hasSize(1);
  }

  @Test
  void rejectsCreateWithMissingName() throws Exception {
    String body = requestJson(null, "desc", "9.99", 10);

    mockMvc
        .perform(post("/api/products").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isBadRequest());

    assertThat(productRepository.findAll()).isEmpty();
  }

  @Test
  void rejectsCreateWithNegativePrice() throws Exception {
    String body = requestJson("Widget", "desc", "-1", 10);

    mockMvc
        .perform(post("/api/products").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isBadRequest());

    assertThat(productRepository.findAll()).isEmpty();
  }

  @Test
  void rejectsCreateWithNegativeStock() throws Exception {
    String body = requestJson("Widget", "desc", "9.99", -1);

    mockMvc
        .perform(post("/api/products").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isBadRequest());

    assertThat(productRepository.findAll()).isEmpty();
  }

  @Test
  void listsAllProducts() throws Exception {
    productRepository.save(new Product("Widget", "d", new BigDecimal("9.99"), 10));
    productRepository.save(new Product("Gadget", "d", new BigDecimal("19.99"), 5));

    mockMvc
        .perform(get("/api/products"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(2));
  }

  @Test
  void listsEmptyWhenNoProducts() throws Exception {
    mockMvc
        .perform(get("/api/products"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(0));
  }

  @Test
  void getsExistingProductById() throws Exception {
    Product saved = productRepository.save(new Product("Widget", "d", new BigDecimal("9.99"), 10));

    mockMvc
        .perform(get("/api/products/{id}", saved.getId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("Widget"));
  }

  @Test
  void getUnknownProductReturnsNotFound() throws Exception {
    mockMvc.perform(get("/api/products/{id}", 999_999)).andExpect(status().isNotFound());
  }

  @Test
  void updatesExistingProduct() throws Exception {
    Product saved = productRepository.save(new Product("Widget", "d", new BigDecimal("9.99"), 10));
    String body = requestJson("Widget Pro", "upgraded", "14.99", 3);

    mockMvc
        .perform(
            put("/api/products/{id}", saved.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("Widget Pro"))
        .andExpect(jsonPath("$.stockQuantity").value(3));
  }

  @Test
  void updateUnknownProductReturnsNotFoundAndDoesNotCreate() throws Exception {
    String body = requestJson("X", "d", "1", 1);

    mockMvc
        .perform(
            put("/api/products/{id}", 999_999)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
        .andExpect(status().isNotFound());

    assertThat(productRepository.findAll()).isEmpty();
  }

  @Test
  void rejectsUpdateWithInvalidDataAndLeavesProductUnchanged() throws Exception {
    Product saved = productRepository.save(new Product("Widget", "d", new BigDecimal("9.99"), 10));
    String body = requestJson("", "d", "9.99", 10);

    mockMvc
        .perform(
            put("/api/products/{id}", saved.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
        .andExpect(status().isBadRequest());

    Product unchanged = productRepository.findById(saved.getId()).orElseThrow();
    assertThat(unchanged.getName()).isEqualTo("Widget");
  }

  @Test
  void deletesExistingProduct() throws Exception {
    Product saved = productRepository.save(new Product("Widget", "d", new BigDecimal("9.99"), 10));

    mockMvc.perform(delete("/api/products/{id}", saved.getId())).andExpect(status().isNoContent());

    mockMvc.perform(get("/api/products/{id}", saved.getId())).andExpect(status().isNotFound());
  }

  @Test
  void deleteUnknownProductReturnsNotFound() throws Exception {
    mockMvc.perform(delete("/api/products/{id}", 999_999)).andExpect(status().isNotFound());
  }

  @Test
  void openApiDocumentationListsProductEndpoints() throws Exception {
    mockMvc
        .perform(get("/v3/api-docs"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.paths['/api/products']").exists())
        .andExpect(jsonPath("$.paths['/api/products/{id}']").exists());
  }

  private String requestJson(String name, String description, String price, int stockQuantity)
      throws Exception {
    return objectMapper.writeValueAsString(
        new ProductRequest(name, description, new BigDecimal(price), stockQuantity));
  }
}
