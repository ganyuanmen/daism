package com.example.newdaism.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import java.util.Date;
import com.baomidou.mybatisplus.annotation.TableId;
import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 
 * </p>
 *
 * @author gym
 * @since 2021-09-29
 */
@Data
@EqualsAndHashCode(callSuper = false)

public class TSetlogo implements Serializable {

    private static final long serialVersionUID=1L;


    private Long blockNum;
    @TableId(value = "dao_id", type = IdType.ASSIGN_ID)
    private Integer daoId;

    private Integer daoTime;

    private String daoLogo;

}
