package com.seckill.dao;

import javax.annotation.Resource;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.seckill.entity.SuccessKilled;

/**
 * 配置Spring和Junit整合，junit启动时加载spring IOC容器
 * 
 * @author Administrator
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:spring/spring-dao.xml")
public class SuccessKilledDaoTest {

	@Resource
	private SuccessKilledDao successKilledDao;

	@Test
	public void testInsertSuccessKilled() {
		int insertCnt = successKilledDao.insertSuccessKilled(1001L, 13911115555L);
		System.out.println("insertCnt = " + insertCnt);
	}

	@Test
	public void testQueryByIdWithSeckill() {
		SuccessKilled successKilled = successKilledDao.queryByIdWithSeckill(1001L, 13911115555L);
		System.out.println(successKilled);
		System.out.println(successKilled.getSeckill());
	}
}
