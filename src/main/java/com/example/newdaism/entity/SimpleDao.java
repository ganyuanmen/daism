package com.example.newdaism.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

@Data
public class SimpleDao {

    private String daoName;
    private String daoSymbol;

    @TableId(value = "dao_id", type = IdType.ASSIGN_ID)
    private Integer daoId;

}
