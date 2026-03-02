package com.fooddeliverysystem.devliverymanagementservice;

import org.springframework.boot.SpringApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.fooddeliverysystem"})
public class DeliveryManagementServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(DeliveryManagementServiceApplication.class, args);
    }

}
