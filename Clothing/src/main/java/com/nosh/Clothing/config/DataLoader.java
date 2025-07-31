package com.nosh.Clothing.config;

import com.nosh.Clothing.model.User;
import com.nosh.Clothing.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Create admin user if not exists
        if (!userRepository.existsByEmail("admin@localwear.com")) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@localwear.com");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);
            admin.setAddress("Admin Address");
            userRepository.save(admin);
        }

        // Create sample products if not exists
        if (getProductCount() == 0) {
            createSampleProducts();
        }
    }

    private Long getProductCount() {
        return entityManager.createQuery("SELECT COUNT(p) FROM Product p", Long.class)
                .getSingleResult();
    }

    private void createSampleProducts() {
        // Insert products using native queries to handle JSONB properly
        String insertProduct1 = """
            INSERT INTO products (name, description, price, category, image_url, sizes, quantity_in_stock, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?::jsonb, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        """;

        entityManager.createNativeQuery(insertProduct1)
                .setParameter(1, "Classic T-Shirt")
                .setParameter(2, "Comfortable cotton t-shirt perfect for everyday wear")
                .setParameter(3, new BigDecimal("29.99"))
                .setParameter(4, "T-Shirts")
                .setParameter(5, "https://example.com/tshirt.jpg")
                .setParameter(6, "[\"S\", \"M\", \"L\", \"XL\"]")
                .setParameter(7, 100)
                .executeUpdate();

        entityManager.createNativeQuery(insertProduct1)
                .setParameter(1, "Denim Jeans")
                .setParameter(2, "High-quality denim jeans with perfect fit")
                .setParameter(3, new BigDecimal("79.99"))
                .setParameter(4, "Jeans")
                .setParameter(5, "https://example.com/jeans.jpg")
                .setParameter(6, "[\"28\", \"30\", \"32\", \"34\", \"36\"]")
                .setParameter(7, 50)
                .executeUpdate();

        entityManager.createNativeQuery(insertProduct1)
                .setParameter(1, "Summer Dress")
                .setParameter(2, "Elegant summer dress for special occasions")
                .setParameter(3, new BigDecimal("59.99"))
                .setParameter(4, "Dresses")
                .setParameter(5, "https://example.com/dress.jpg")
                .setParameter(6, "[\"XS\", \"S\", \"M\", \"L\", \"XL\"]")
                .setParameter(7, 30)
                .executeUpdate();
    }
}
