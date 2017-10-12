package com.seckill.dao;

import org.apache.ibatis.annotations.Param;

import com.seckill.entity.SuccessKilled;

/**
 * 成功秒杀表DAO接口
 * 
 * @author Administrator
 */
public interface SuccessKilledDao {

	/**
	 * 插入购买明细，可过滤重复
	 * 
	 * @param seckillId 秒杀商品ID
	 * @param userPhone 用户手机号
	 * @return 插入的行数
	 */
	int insertSuccessKilled(@Param("seckillId") long seckillId, @Param("userPhone") long userPhone);

	/**
	 * 根据id查询SuccessKilled并携带秒杀产品对象实体
	 * 
	 * @param seckillId 秒杀商品ID
	 * @param userPhone 用户手机号
	 * @return 秒杀商品列表
	 */
	SuccessKilled queryByIdWithSeckill(@Param("seckillId") long seckillId, @Param("userPhone") long userPhone);
}
