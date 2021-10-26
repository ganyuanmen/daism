package com.example.newdaism.entity;

import com.baomidou.mybatisplus.annotation.IdType;
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
 * @since 2021-09-12
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class ADao  implements Serializable {

    private static final long serialVersionUID=1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    private String title;

    private String dafAddress;

    private String logoUrl;

    private String remark;

    private String createTime;

    private String price;

    private Integer ethIndex;

    private Integer maxIndex;


}
