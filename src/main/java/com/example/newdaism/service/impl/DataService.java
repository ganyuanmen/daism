package com.example.newdaism.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.metadata.OrderItem;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.newdaism.entity.ADao;
import com.example.newdaism.entity.RequetDao;
import com.example.newdaism.mapper.ADaoMapper;
import com.example.newdaism.service.IDataservice;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DataService extends ServiceImpl<ADaoMapper, ADao> implements IDataservice {
    @Override
    public IPage<ADao> getData(RequetDao condition) {
        IPage<ADao> atodoIPage =this.page (gene_page(condition) , gene_condition(condition));
        return atodoIPage;
    }


    public static LambdaQueryWrapper<ADao> gene_condition(RequetDao condition)
    {
        LambdaQueryWrapper<ADao> atodoLambdaQueryWrapper = Wrappers.lambdaQuery();
        if(condition.getTitle()!=null) {
            atodoLambdaQueryWrapper.like(ADao::getTitle, condition.getTitle());
        }
     return  atodoLambdaQueryWrapper;

    }

    public static Page<ADao> gene_page(RequetDao condition)
    {
        Page<ADao> atodoPage = new Page<>(condition.getPageNum() , condition.getPageSize());
        List<OrderItem> olist=new ArrayList<>();
        if(condition.getOrder()!=null)
        {
            if(condition.getOrderType()==null) olist.add(OrderItem.asc(condition.getOrder()));
            else if(condition.getOrderType().equals("asc"))   olist.add(OrderItem.asc(condition.getOrder()));
            else  olist.add(OrderItem.desc(condition.getOrder()));
        } else
        {
            olist.add(OrderItem.asc("id"));
        }
        atodoPage.setOrders(olist);
        return atodoPage;
    }
}
