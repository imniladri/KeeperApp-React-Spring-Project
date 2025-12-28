package com.niladrimondal.keeperapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.niladrimondal.keeperapp.entity.Entry;
import com.niladrimondal.keeperapp.entity.User;
import com.niladrimondal.keeperapp.service.EntryService;
import com.niladrimondal.keeperapp.service.UserService;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class EntryController {

	@Autowired
	private EntryService entryService;

	@Autowired
	private UserService userService;

	@PostMapping("/newentry")
	public Entry saveEntry(@RequestBody Entry entry) {
		entry.setEntryId(0);
		return entryService.saveEntry(entry);
	}

	@GetMapping("/entries/{username}")
	public List<Entry> getEntryByUserId(@PathVariable("username") String username) {

		User user = userService.getUser(username);

		List<Entry> userEntriesList = entryService.getAllEntryByUser(user.getUserid());

		return userEntriesList;
	}

}
