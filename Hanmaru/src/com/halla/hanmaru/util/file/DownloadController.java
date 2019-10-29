package com.halla.hanmaru.util.file;

import java.io.File;
import java.security.Principal;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class DownloadController {
	
	@SuppressWarnings("unused")
	private WebApplicationContext context = null;
	
	@Resource(name="downloadDirResource")
	protected FileSystemResource fsResource;
	
//	@RequestMapping("/admin/download")
//	public ModelAndView downloadAdmin(
//			Principal principal, 
//			@RequestParam("filename") String fileName, 
//			HttpServletRequest request, 
//			HttpServletResponse response) {
//		
//		File file = new File(fsResource.getPath() + "/" + fileName);
//		return new ModelAndView("download", "downloadFile", file);
//	}
//	
//	@RequestMapping("/notice/download")
//	public ModelAndView downloadNotice(
//			Principal principal, 
//			@RequestParam("file_name") String fileName, 
//			HttpServletRequest request, 
//			HttpServletResponse response) {
//		
//		File file = new File(fsResource.getPath() + "/" + fileName);
//		return new ModelAndView("download", "downloadFile", file);
//	}
	
	@RequestMapping(value={"/download", "/download/"})
	public ModelAndView downloadChallenge(
			@RequestParam("file_name") String path, 
			HttpServletRequest request, 
			HttpServletResponse response) {
		File file = new File(fsResource.getPath() + "/" + path);
		
		System.err.println("경로 : " + file.getAbsolutePath()); 
		
		return new ModelAndView("download", "downloadFile", file);
	}
	
	public void setApplicationContext(ApplicationContext arg0) throws BeansException {
        this.context = (WebApplicationContext)arg0;
    }

}
