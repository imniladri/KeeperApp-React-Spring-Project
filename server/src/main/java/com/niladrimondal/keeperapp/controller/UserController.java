package com.niladrimondal.keeperapp.controller;

import com.niladrimondal.keeperapp.entity.User;
import com.niladrimondal.keeperapp.exception.UserNotFoundException;
import com.niladrimondal.keeperapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class UserController {
	
	@Autowired
	private UserService userService;

	@GetMapping("/login")
	public String getLogin() {
		return "Login";
	}

	@PostMapping("/user/login")
	public User getUserLogin(@RequestBody Map<String, Object> payLoadData) {
		String loginUsername = (String) payLoadData.get("username");
		String loginPassword = (String) payLoadData.get("password");

		boolean validUserName = userService.validateUsername(loginUsername);
		boolean validUserPass = userService.validateLogin(loginUsername,loginPassword);

		if(validUserPass) {
			return userService.getUser(loginUsername);
		} else if (!validUserName) {
			throw new UserNotFoundException(404, "User Not Found");
		} else {
			throw new UserNotFoundException(401, "Incorrect Password");
		}
	}

	@GetMapping("/user")
	public List<User> allUsers() {
		return userService.getAllUsers();
	}

	@GetMapping("/user/validate/username/{username}")
	public boolean getUserByUserName(@PathVariable("username") String username) {
		return userService.validateUsername(username);
	}
	
	@GetMapping("/user/validate/email/{email}")
	public boolean getUserByEmail(@PathVariable("email") String email) {
		return userService.validateEmail(email);
	}

	@PostMapping("/user/register")
	public User registerUser(@RequestBody User user) {
		user.setUserid(0);
		return userService.saveUser(user);
	}

}
