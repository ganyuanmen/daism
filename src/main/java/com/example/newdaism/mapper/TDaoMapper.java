package com.example.newdaism.mapper;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.newdaism.entity.SimpleDao;
import com.example.newdaism.entity.TDao;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.ResultType;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author gym
 * @since 2021-09-29
 */
public interface TDaoMapper extends BaseMapper<TDao> {
    @Select({"${sql}"})
    @ResultType(Long.class)
    Long getMaxBlock(@Param("sql") String sql);

    @Select({"${sql}"})
    @ResultType(List.class)
    List<SimpleDao> getDaoList(@Param("sql") String sql);
}
