package com.seckill.dao;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.seckill.entity.Seckill;

/**
 * 秒杀库存表DAO接口
 * 
 * @author Administrator
 */
public interface SeckillDao {

	/**
	 * 减库存
	 * 
	 * @param seckillId 秒杀商品ID
	 * @param killTime 秒杀时间
	 * @return 如果影响行数>1，表示更新的记录行数
	 */
	int reduceNumber(@Param("seckillId") long seckillId, @Param("killTime") Date killTime);

	/**
	 * 根据id查询秒杀对象
	 * 
	 * @param seckillId 秒杀商品ID
	 * @return
	 */
	Seckill queryById(long seckillId);

	/**
	 * 根据偏移量查询秒杀商品列表
	 * 
	 * @param offset 偏移量
	 * @param limit
	 * @return 秒杀库存列表
	 */
	List<Seckill> queryAll(@Param("offset") int offset, @Param("limit") int limit);
	
	/**
	 * 使用存储过程进行秒杀
	 * 
	 * @param paramMap 
	 */
	void killByProcedure(Map<String, Object> paramMap);
}
