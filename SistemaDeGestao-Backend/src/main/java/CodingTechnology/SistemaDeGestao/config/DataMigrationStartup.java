package CodingTechnology.SistemaDeGestao.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

@Configuration
public class DataMigrationStartup {

    @Bean
    public CommandLineRunner dataMigration(JdbcTemplate jdbcTemplate) {
        return args -> {
            System.out.println("EXECUTING DATA MIGRATION: Sanitizing Enum Values...");

            try {
                // 1. Convert to Uppercase (Handling case sensitivity mismatch)
                jdbcTemplate.update("UPDATE products SET unidade_medida = UPPER(unidade_medida)");
                jdbcTemplate.update("UPDATE ingredientes_da_receita SET unidade_medida = UPPER(unidade_medida)");

                // 2. Fix common variations (Ex: 'Unidade' -> 'UN', 'Litro' -> 'L', 'Kilograma'
                // -> 'KG')
                // Note: Using broad updates to catch likely legacy data
                jdbcTemplate.update("UPDATE products SET unidade_medida = 'UN' WHERE unidade_medida LIKE 'UNI%'");
                jdbcTemplate.update("UPDATE products SET unidade_medida = 'L' WHERE unidade_medida LIKE 'LIT%'");
                jdbcTemplate.update(
                        "UPDATE products SET unidade_medida = 'KG' WHERE unidade_medida LIKE 'KILO%' OR unidade_medida LIKE 'QILO%'");

                jdbcTemplate.update(
                        "UPDATE ingredientes_da_receita SET unidade_medida = 'UN' WHERE unidade_medida LIKE 'UNI%'");
                jdbcTemplate.update(
                        "UPDATE ingredientes_da_receita SET unidade_medida = 'L' WHERE unidade_medida LIKE 'LIT%'");
                jdbcTemplate.update(
                        "UPDATE ingredientes_da_receita SET unidade_medida = 'KG' WHERE unidade_medida LIKE 'KILO%' OR unidade_medida LIKE 'QILO%'");

                // 3. Default any remaining invalid values to 'UN' to prevent 500 Errors
                // The Valid values are: KG, G, MG, L, ML, UN
                String validUnits = "'KG', 'G', 'MG', 'L', 'ML', 'UN'";

                int productsFixed = jdbcTemplate.update(
                        "UPDATE products SET unidade_medida = 'UN' WHERE unidade_medida NOT IN (" + validUnits + ")");
                int ingredientsFixed = jdbcTemplate
                        .update("UPDATE ingredientes_da_receita SET unidade_medida = 'UN' WHERE unidade_medida NOT IN ("
                                + validUnits + ")");

                System.out.println("DATA MIGRATION COMPLETED.");
                System.out.println("Products Fixed: " + productsFixed);
                System.out.println("Ingredients Fixed: " + ingredientsFixed);

            } catch (Exception e) {
                System.err.println("DATA MIGRATION FAILED: " + e.getMessage());
                // Non-blocking failure, just log it
            }
        };
    }
}
