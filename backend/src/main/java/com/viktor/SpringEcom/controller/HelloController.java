package com.viktor.SpringEcom.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
public class HelloController {

    @GetMapping("hello")
    public String greet(){
        return "Hello Spring Ecom!";
    }
}
