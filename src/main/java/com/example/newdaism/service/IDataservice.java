package com.example.newdaism.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.newdaism.entity.ADao;
import com.example.newdaism.entity.RequetDao;

public interface IDataservice  extends IService<ADao> {
    IPage<ADao> getData(RequetDao requetDao);


}
