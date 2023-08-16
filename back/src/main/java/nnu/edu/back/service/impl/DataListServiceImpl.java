package nnu.edu.back.service.impl;

import com.alibaba.fastjson2.JSONObject;
import lombok.extern.slf4j.Slf4j;
import nnu.edu.back.common.exception.MyException;
import nnu.edu.back.common.result.ResultEnum;
import nnu.edu.back.common.utils.FileUtil;
import nnu.edu.back.dao.main.DataListMapper;
import nnu.edu.back.dao.main.DataRelationalMapper;
import nnu.edu.back.dao.main.DownloadHistoryMapper;
import nnu.edu.back.dao.main.VisualFileMapper;
import nnu.edu.back.pojo.DataList;
import nnu.edu.back.pojo.DownloadHistory;
import nnu.edu.back.service.DataListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.FileInputStream;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/08/16/0:21
 * @Description:
 */
@Service
@Slf4j
public class DataListServiceImpl implements DataListService {
    @Autowired
    DataListMapper dataListMapper;

    @Value("${avatarDir}")
    String avatarDir;


    @Autowired
    DataRelationalMapper dataRelationalMapper;

    @Value("${tempDir}")
    String tempDir;

    @Value("${baseDir}")
    String baseDir;

    @Autowired
    DownloadHistoryMapper downloadHistoryMapper;

    @Autowired
    VisualFileMapper visualFileMapper;

    @Override
    public void addDataList(DataList dataList) {
        dataListMapper.addDataList(dataList);
    }

    @Override
    public void updateList(DataList dataList) {
        dataListMapper.updateDataList(dataList);
    }

    @Override
    public DataList getFileInfo(String id) {
        return dataListMapper.getFileInfo(id);
    }

    @Override
    public void addWatchCount(String id) {
        dataListMapper.addWatchCount(id);
    }

    @Override
    public Map<String, Object> fuzzyQuery(int page, int size, String keyword, String property, Boolean flag, String type) {
        if(!keyword.equals("")) {
            keyword = "%" + keyword + "%";
        }
        int total = dataListMapper.countFuzzyQuery(keyword, type);

        List<DataList> list = dataListMapper.fuzzyQuery(size * page, size, keyword, property, flag, type);
        Map<String, Object> result = new HashMap<>();
        result.put("total", total);
        result.put("list", list);
        return result;
    }



    @Override
    public List<Map<String, Object>> getHot(int size) {
        return dataListMapper.getHot(size);
    }


    @Override
    public void downloadAll(String email, String id, HttpServletRequest request, HttpServletResponse response) {
        List<Map<String, Object>> list = dataRelationalMapper.findFilesByDataListId(id);
        for (Map<String, Object> map : list) {
            String oldString = (String) map.get("address");
            map.replace("address", oldString, baseDir + oldString);
        }
        String destination = tempDir + id + ".zip";
        int code = FileUtil.compressFile(destination, list);
        if (code == -1) throw new MyException(ResultEnum.DEFAULT_EXCEPTION);
        InputStream in = null;
        ServletOutputStream sos = null;
        try {
            response.setContentType("application/octet-stream");
            response.addHeader("Content-Disposition", "attachment;filename=" + URLEncoder.encode(id + ".zip", "UTF-8"));
            in = new FileInputStream(destination);
            sos = response.getOutputStream();
            byte[] bytes = new byte[1024];
            int len;
            while((len = in.read(bytes)) > -1) {
                sos.write(bytes, 0, len);
            }
            sos.flush();
            sos.close();
            in.close();
            downloadHistoryMapper.addHistory(new DownloadHistory(UUID.randomUUID().toString(), email, null, id, "all"));
            dataListMapper.addDownloadCount(id);
        } catch (Exception e) {
            log.error(e.getMessage());
            try {
                if(in != null) {
                    in.close();
                }
                if(sos != null) {
                    sos.close();
                }
            } catch (Exception exception) {
                log.error(exception.getMessage());
                throw new MyException(ResultEnum.DEFAULT_EXCEPTION);
            }
            throw new MyException(ResultEnum.DEFAULT_EXCEPTION);
        }
    }

    @Override
    public List<Map<String, Object>> findFiles(String dataListId) {
        List<Map<String, Object>> list = dataRelationalMapper.findFilesByDataListId(dataListId);
        for (Map<String, Object> map : list) {
            if (!map.get("visualType").equals("")) {
                map.put("view", visualFileMapper.getView(map.get("visualId").toString()));
            }
        }
        return list;
    }


    @Override
    public Map<String, Object> getSimilarData(String type, String id, int size, int page) {
        Map<String, Object> map = new HashMap<>();
        List<Map<String, Object>> list = dataListMapper.getSimilarData(type, id, size, size * page);
        int total = dataListMapper.getSimilarCount(type);
        map.put("list", list);
        map.put("total", total);
        return map;

    }
}
