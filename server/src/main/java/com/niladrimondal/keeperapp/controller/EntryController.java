package com.niladrimondal.keeperapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.niladrimondal.keeperapp.entity.Entry;
import com.niladrimondal.keeperapp.entity.EntryDetails;
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

	@PostMapping("/entry/new")
	public Entry saveEntry(@RequestBody Entry entry) {
		entry.setEntryId(0);
		return entryService.saveEntry(entry);
	}

	@PostMapping("/entry/new/detail")
	public EntryDetails saveEntryDetails(@RequestBody EntryDetails entryDetails) {
		entryDetails.setEntryDetailId(0);
		return entryService.saveEntryDetails(entryDetails);
	}

	@PutMapping("/entry/edit/detail/{entryDetailId}")
	public EntryDetails editEntryDetails(@PathVariable("entryDetailId") Integer entryDetailId,
			@RequestBody EntryDetails updatedEntryDetails) {
		return entryService.updateEntryDetails(entryDetailId, updatedEntryDetails);
	}
	
	@DeleteMapping("/entry/delete/{entryId}")
	public boolean deleteEntry(@PathVariable("entryId") Integer entryId) {
		return entryService.deleteEntry(entryId);
	}
	
	@DeleteMapping("/entry/delete/detail/{entryDetailId}")
	public boolean deleteEntryDetails(@PathVariable("entryDetailId") Integer entryDetailId) {
		return entryService.deleteEntryDetails(entryDetailId);
	}

	@GetMapping("/entry/id/{entryId}")
	public Entry getEntryById(@PathVariable("entryId") Integer entryId) {
		return entryService.getEntryById(entryId);
	}

	@GetMapping("/entry/detail/id/{entryDetailId}")
	public EntryDetails getEntryDetailsById(@PathVariable("entryDetailId") Integer entryDetailId) {
		return entryService.getEntryDetailsById(entryDetailId);
	}

	@GetMapping("/entry/user/{username}")
	public List<Entry> getEntryByUserId(@PathVariable("username") String username) {
		User user = userService.getUser(username);
		List<Entry> userEntriesList = entryService.getAllEntryByUser(user.getUserid());
		return userEntriesList;
	}

	@GetMapping("/entry/details/{entryId}")
	public List<EntryDetails> getEntryDetailsByEntryId(@PathVariable("entryId") Integer entryId) {
		return entryService.getAllEntryDetailsByEntryId(entryId);
	}

}
