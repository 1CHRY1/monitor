package nnu.edu.back.common.aspect;

import lombok.extern.slf4j.Slf4j;
import nnu.edu.back.common.config.DataSourceContextHolder;
import nnu.edu.back.common.config.DynamicDataSource;
import nnu.edu.back.common.exception.MyException;
import nnu.edu.back.common.result.ResultEnum;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.sqlite.JDBC;

import javax.sql.DataSource;
import java.io.File;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/07/28/20:46
 * @Description:
 */
@Order(1)
@Aspect
@Component
@Slf4j
public class DynamicDataSourceAspect {

    @Value("${baseDir}")
    String baseDir;

    @Autowired
    @Qualifier("dynamicDataSource")
    private DynamicDataSource dynamicDataSource;

    /**
     * 切换数据源
     */
    @Before("execution(* nnu.edu.back.dao.dynamic.*.*(..))")
    public void switchDataSource(JoinPoint joinPoint) {
        System.out.println("切换数据源");
        Object[] args = joinPoint.getArgs();
        String datasourceId = (String) args[0];
        if (!DataSourceContextHolder.containDataSourceKey(datasourceId)) {
            String datasourceAddress = baseDir + datasourceId + "/dataset.db";
            File file = new File(datasourceAddress);
            if (!file.exists()) {
                throw new MyException(ResultEnum.DATASOURCE_ERROR);
            }
            DataSourceBuilder dataSourceBuilder = DataSourceBuilder.create();
            dataSourceBuilder.url(datasourceAddress);
            dataSourceBuilder.driverClassName(JDBC.class.getName());
            DataSource source = dataSourceBuilder.build();
            dynamicDataSource.addDataSource(datasourceId, source);
        }
        // 切换数据源
        DataSourceContextHolder.setDataSourceKey(datasourceId);
        log.info(DataSourceContextHolder.getDataSourceKey());
    }

    @Before("execution(* nnu.edu.back.dao.main.*.*(..))")
    public void restoreDataSource() {
        if (!DataSourceContextHolder.getDataSourceKey().equals("default")) {
            DataSourceContextHolder.clearDataSourceKey();
        }
    }

}
