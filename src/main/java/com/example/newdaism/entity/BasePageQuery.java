package com.example.newdaism.entity;

import lombok.Data;

@Data
public class BasePageQuery {
    private Integer pageNum=1;
    private Integer pageSize=20;
}
