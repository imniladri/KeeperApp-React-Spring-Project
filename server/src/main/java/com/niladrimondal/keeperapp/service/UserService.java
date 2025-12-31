package com.niladrimondal.keeperapp.service;

import com.niladrimondal.keeperapp.entity.User;
import com.niladrimondal.keeperapp.repository.UserRepository;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	public List<User> getAllUsers() {
		List<User> userList = userRepository.findAll();
		if (userList.isEmpty()) {
			return null;
		} else {
			return userList;
		}
	}

	public User saveUser(User user) {
		if (user != null) {
			// Password Hashing
			String hashedPassword = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());
			user.setPassword(hashedPassword);
			return userRepository.save(user);
		} else {
			return new User();
		}
	}

	public User getUser(String username) {
		return userRepository.findByUsername(username);
	}

	public boolean validateUsername(String username) {
		User existsUser = userRepository.findByUsername(username);
		return existsUser != null;
	}

	public boolean validateEmail(String email) {
		User existsEmail = userRepository.findByEmail(email);
		return existsEmail != null;
	}

	public boolean validateLogin(String username, String password) {
		User user = userRepository.findByUsername(username);

		if (user != null) {
			return BCrypt.checkpw(password, user.getPassword()); // Authenticate With Password Hashing
//			return user.getPassword().equals(password); // Authenticate Without Password Hashing
		} else {
			return false;
		}
	}

}
