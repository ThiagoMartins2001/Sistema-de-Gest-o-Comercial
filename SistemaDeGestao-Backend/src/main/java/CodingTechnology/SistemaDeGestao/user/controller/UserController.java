package CodingTechnology.SistemaDeGestao.user.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import CodingTechnology.SistemaDeGestao.user.model.entities.User;
import CodingTechnology.SistemaDeGestao.user.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Lista todos os usuários cadastrados
    @GetMapping("/listAll")
    public ResponseEntity<List<User>> listAllUsers() {
        List<User> users = userService.findAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    // Cria um novo usuário (apenas ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<String> createUser(@RequestBody User user) {
        if (userService.findByUsername(user.getUsername()).isPresent()) {
            return new ResponseEntity<>("Name already in use:", HttpStatus.CONFLICT);
        }
        userService.saveUser(user);
        return new ResponseEntity<>("User created successfully:", HttpStatus.CREATED);
    }

    // Exclui um usuário por username (apenas ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{username}")
    public ResponseEntity<String> deleteUser(@PathVariable String username) {
        if (userService.findByUsername(username).isEmpty()) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
        userService.deleteByUsername(username);
        return new ResponseEntity<>("User deleted successfully!", HttpStatus.OK);
    }
}
