package com.example.newdaism.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebController {

    @RequestMapping("/")
    String getMain()
    {
        return "main";
    }

    @RequestMapping("/test")
    String test()
    {
        return "test";
    }



}
