package CodingTechnology.SistemaDeGestao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

import CodingTechnology.SistemaDeGestao.user.model.entities.User;
import CodingTechnology.SistemaDeGestao.user.repository.UserRepository;

@SpringBootApplication
public class GestaoApplication implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(GestaoApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        // Verifica se o usuário master já existe
        if (userRepository.findByUsername("UserAdmin").isEmpty()) {
            User masterUser = new User();
            masterUser.setUsername("UserAdmin");
            masterUser.setPassword(passwordEncoder.encode("Master@123")); // Defina uma senha forte aqui
            masterUser.setRole("ADMIN"); // Define o papel de administrador
            userRepository.save(masterUser);
            System.out.println("Usuário master criado com sucesso!");
        }
    }
}