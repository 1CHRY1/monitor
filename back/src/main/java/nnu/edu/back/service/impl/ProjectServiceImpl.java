package nnu.edu.back.service.impl;

import nnu.edu.back.common.exception.MyException;
import nnu.edu.back.common.result.ResultEnum;
import nnu.edu.back.service.ProjectService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/07/29/14:17
 * @Description:
 */
@Service
public class ProjectServiceImpl implements ProjectService {
    @Value("${avatarDir}")
    String avatarDir;

    @Override
    public void getAvatar(String pictureName, HttpServletResponse response) {
        String pictureAddress = avatarDir + pictureName;
        File file = new File(pictureAddress);
        if (!file.exists()) {
            throw new MyException(ResultEnum.NO_OBJECT);
        }
        try {
            FileInputStream fileInputStream = new FileInputStream(file);
            ServletOutputStream outputStream = response.getOutputStream();
            byte[] bytes = new byte[1024];
            int len;
            while ((len = fileInputStream.read(bytes)) != -1) {
                outputStream.write(bytes, 0, len);
            }
            outputStream.flush();
            outputStream.close();
            fileInputStream.close();
        } catch (Exception e) {
            throw new MyException(ResultEnum.DEFAULT_EXCEPTION);
        }
    }
}
