package com.halla.hanmaru;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.halla.hanmaru.util.BrowserCheck;

@Controller
public class MainController {
	private static final Logger logger = LoggerFactory.getLogger(MainController.class);
	private String path = "/";
	
	@RequestMapping(value={"", "/"})
	public String index(
		HttpServletRequest request,
		HttpServletResponse response,
		ModelMap model) throws Exception {
		
		model.addAttribute("isAndroid", BrowserCheck.isAndroid(request));
		model.addAttribute("isIPhone", BrowserCheck.isIphone(request));
		
		return path+"/main";
	}
}