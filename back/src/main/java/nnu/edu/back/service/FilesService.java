package nnu.edu.back.service;

import com.alibaba.fastjson2.JSONObject;
import nnu.edu.back.pojo.Files;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/08/15/21:36
 * @Description:
 */
public interface FilesService {
    String addFiles(Files file);

    void downloadFile(String id, HttpServletResponse response);

    String bindVisualData(JSONObject jsonObject);

    void cancelVisualBind(String id);

    List<Object> findByFolderId(String parentId, String role);

    String addFolder(String folderName, String parentId, String role);
}
