package nnu.edu.back.service;

import javax.servlet.http.HttpServletResponse;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/07/29/14:17
 * @Description:
 */
public interface ProjectService {
    void getAvatar(String pictureName, HttpServletResponse response);
}
