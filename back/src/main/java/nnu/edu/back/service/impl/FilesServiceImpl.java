package nnu.edu.back.service.impl;

import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import lombok.extern.slf4j.Slf4j;
import nnu.edu.back.common.exception.MyException;
import nnu.edu.back.common.result.ResultEnum;
import nnu.edu.back.common.utils.FileUtil;
import nnu.edu.back.common.utils.ProcessUtil;
import nnu.edu.back.dao.main.DataRelationalMapper;
import nnu.edu.back.dao.main.FilesMapper;
import nnu.edu.back.dao.main.VisualFileMapper;
import nnu.edu.back.pojo.Files;
import nnu.edu.back.pojo.VisualFile;
import nnu.edu.back.service.FilesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/08/15/21:36
 * @Description:
 */
@Slf4j
@Service
public class FilesServiceImpl implements FilesService {
    @Autowired
    FilesMapper filesMapper;

    @Autowired
    DataRelationalMapper dataRelationalMapper;

    @Autowired
    VisualFileMapper visualFileMapper;

    @Value("${tempDir}")
    String tempDir;

    @Value("${visualDir}")
    String visualDir;

    @Value("${pgPath}")
    String pgPath;

    @Value("${baseDir}")
    String baseDir;

    @Override
    public String addFiles(Files file) {
        String uuid = UUID.randomUUID().toString();
        file.setId(uuid);
        filesMapper.addFile(file);
        return uuid;
    }

    @Override
    public void downloadFile(String id, HttpServletResponse response) {
        Files files = filesMapper.findInfoById(id);
        String address = baseDir + files.getAddress();
        File file = new File(address);
        if (!file.exists()) {
            throw new MyException(ResultEnum.NO_OBJECT);
        }
        InputStream in = null;
        ServletOutputStream sos = null;
        try {
            response.setContentType("application/octet-stream");
            response.addHeader("Content-Disposition", "attachment;filename=" + URLEncoder.encode(files.getFileName(), "UTF-8"));
            response.addHeader("Content-Length", "" + file.length());
            in = new FileInputStream(file);
            sos = response.getOutputStream();
            byte[] b = new byte[1024];
            int len;
            while((len = in.read(b)) > 0) {
                sos.write(b, 0, len);
            }
            sos.flush();
            sos.close();
            in.close();
        } catch (Exception e) {
            log.error(e.getMessage());
            try {
                if (in != null) in.close();
                if (sos != null) sos.close();
            } catch (Exception exception) {
                log.error(exception.getMessage());
                throw new MyException(ResultEnum.DEFAULT_EXCEPTION);
            }
            throw new MyException(ResultEnum.DEFAULT_EXCEPTION);
        }
    }

    @Override
    public String bindVisualData(JSONObject jsonObject) {
        String fileId = jsonObject.getString("id");
        String fileName = jsonObject.getString("fileName");
        String type = jsonObject.getString("type");
        JSONArray jsonArray = jsonObject.getJSONArray("coordinates");
        String srid = jsonObject.getString("srid");
        JSONObject view = jsonObject.getJSONObject("view");
        String viewStr = "";
        if (view != null) {
            viewStr = JSONObject.toJSONString(view);
        }
        String content = "";
        List<String> list = dataRelationalMapper.findDataListIdsByFileId(fileId);
//        Files files = filesMapper.findInfoById(fileId);
//        boolean flag;
//        if (list.size() > 0) {
//            flag = true;
//        } else {
//            flag = false;
//        }
        if (type.equals("png") || type.equals("movePng")) {
            JSONObject json = new JSONObject();
            json.put("address", "png/" + fileName);
            json.put("coordinates", jsonArray);
            content = JSONObject.toJSONString(json);
        } else if (type.equals("rateDirection") || type.equals("sandContent") || type.equals("salinity") || type.equals("suspension") || type.equals("flowSand_Z") || type.equals("tide")) {
            if (type.equals("flowSand_Z")) {
                content = "flowSand/" + fileName;
            } else {
                content = type + "/" + fileName;
            }
        } else if (type.equals("rasterTile")) {
            String folderName = fileName.substring(0, fileName.lastIndexOf("."));
            content = "rasterTile/" + folderName + "/tiles";
            FileUtil.unpack(tempDir + fileName, visualDir + "rasterTile/" + folderName + "/tiles");
            fileName = folderName;
        } else if (type.equals("pointVectorTile") || type.equals("pointVectorTile3D") || type.equals("lineVectorTile") || type.equals("lineVectorTile3D") || type.equals("polygonVectorTile") || type.equals("polygonVectorTile3D")) {
            content = fileName.substring(0, fileName.lastIndexOf("."));
            FileUtil.unpack(tempDir + content + ".zip", tempDir + content);
            String shpName = "";
            java.io.File folder = new java.io.File(tempDir + content);
            String fileList[] = folder.list();
            for (String name : fileList) {
                String suffix = name.substring(name.lastIndexOf("."));
                if (suffix.equals(".shp")) {
                    shpName = name;
                    break;
                }
            }
            if (shpName.equals("")) {
                throw new MyException(-99, "文件内容错误");
            }
            List<String> commands = new ArrayList<>();
            String command = "D: & cd " + pgPath + " & shp2pgsql -s " + srid + " -d " + tempDir + content + "/" + shpName + " " + content + " | psql -h localhost -U postgres -d shp_dataset";
            commands.add("cmd");
            commands.add("/c");
            commands.add(command);
            try {
                Process process = ProcessUtil.cmdShp2Pgsql(commands);
                ProcessUtil.readProcessOutput(process.getInputStream(), System.out);
                int state = process.exitValue();
                FileUtil.deleteFolder(tempDir + content + ".zip");
                if (state != 0) {
                    throw new MyException(ResultEnum.DEFAULT_EXCEPTION);
                }
            } catch (Exception e) {
                e.printStackTrace();
                throw new MyException(ResultEnum.DEFAULT_EXCEPTION);
            }
        } else if (type.equals("photo") || type.equals("video")) {
//            if (flag) {
//                throw new MyException(ResultEnum.QUERY_TYPE_ERROR);
//            }
            filesMapper.updateVisualIdAndType(fileId, "", type);
            return "";
        } else {
            // excel表格形式的数据上传
            throw new MyException(ResultEnum.QUERY_TYPE_ERROR);
        }
        String id = UUID.randomUUID().toString();
        VisualFile visualFile = new VisualFile(id, fileName, type, content, viewStr);
        visualFileMapper.addVisualFile(visualFile);
//        if (flag) {
//            throw new MyException(ResultEnum.DEFAULT_EXCEPTION);
//        } else {
//            filesMapper.updateVisualIdAndType(fileId, id, type);
//        }
        filesMapper.updateVisualIdAndType(fileId, id, type);
        return id;
    }

    @Override
    public void cancelVisualBind(String id) {
        filesMapper.updateVisualIdAndType(id, "", "");
    }

    @Override
    public List<JSONObject> findByFolder(String path, String role) {
        if (role.equals("admin")) {
            List<JSONObject> res = new ArrayList<>();
            Path address = Paths.get(baseDir, path);
            File file = new File(address.toString());
            if (!file.exists() && file.isFile()) throw new MyException(ResultEnum.NO_OBJECT);
            File[] files = file.listFiles();
            for (File f : files) {
                JSONObject jsonObject = new JSONObject();
                if (f.isDirectory()) {
                    jsonObject.put("folder", true);
                    jsonObject.put("name", f.getName());
                } else {
                    jsonObject.put("folder", false);
                    jsonObject.put("name", f.getName());
                    jsonObject.put("size", FileUtil.formatFileSize(f.length()));
                }
                res.add(jsonObject);
            }
            return res;
        } else throw new MyException(ResultEnum.NO_ACCESS);
    }
}
