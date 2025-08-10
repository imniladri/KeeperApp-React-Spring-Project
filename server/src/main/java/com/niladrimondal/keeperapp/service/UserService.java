package com.niladrimondal.keeperapp.service;

import com.niladrimondal.keeperapp.entity.User;
import com.niladrimondal.keeperapp.repository.UserRepository;
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
			return userRepository.save(user);
		} else {
			return new User();
		}
	}

	public User getUser(String username) {
		return userRepository.findByUsername(username);
	}

	public boolean validateUser(String username) {
		User existsUser = userRepository.findByUsername(username);
		return existsUser == null;
	}

	public boolean validateEmail(String email) {
		User existsEmail = userRepository.findByEmail(email);
		return existsEmail == null;
	}

	public boolean validateLogin(String username, String password) {
		User user = userRepository.findByUsername(username);

		if (user != null) {
			return user.getPassword().equals(password);
		} else {
			return false;
		}
	}

}
