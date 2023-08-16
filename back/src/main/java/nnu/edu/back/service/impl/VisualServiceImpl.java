package nnu.edu.back.service.impl;

import cn.hutool.core.util.StrUtil;
import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import lombok.extern.slf4j.Slf4j;
import nnu.edu.back.common.exception.MyException;
import nnu.edu.back.common.result.ResultEnum;
import nnu.edu.back.common.utils.FileUtil;
import nnu.edu.back.common.utils.TileUtil;
import nnu.edu.back.dao.main.FilesMapper;
import nnu.edu.back.dao.main.VisualFileMapper;
import nnu.edu.back.dao.shp.VectorTileMapper;
import nnu.edu.back.pojo.Files;
import nnu.edu.back.pojo.TileBox;
import nnu.edu.back.pojo.VisualFile;
import nnu.edu.back.service.VisualService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.sql.Timestamp;
import java.util.*;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/08/15/22:53
 * @Description:
 */
@Service
@Slf4j
public class VisualServiceImpl implements VisualService {
    @Value("${avatarDir}")
    String avatarDir;

    @Value("${visualDir}")
    String visualDir;

    @Value("${baseDir}")
    String baseDir;

    @Value("${mapDir}")
    String mapDir;

    @Value("${tempDir}")
    String tempDir;

    @Autowired
    VisualFileMapper visualFileMapper;

    @Autowired
    VectorTileMapper vectorTileMapper;

    @Autowired
    FilesMapper filesMapper;



    @Override
    public void getAvatar(String fileName, HttpServletResponse response) {
        String pictureAddress = avatarDir + fileName;
        File file = new File(pictureAddress);
        if (!file.exists()) {
            throw new MyException(ResultEnum.NO_OBJECT);
        }
        FileInputStream fileInputStream = null;
        ServletOutputStream outputStream = null;
        try {
            fileInputStream = new FileInputStream(file);
            outputStream = response.getOutputStream();
            byte[] bytes = new byte[1024];
            int len;
            while ((len = fileInputStream.read(bytes)) != -1) {
                outputStream.write(bytes, 0, len);
            }
            outputStream.flush();
            outputStream.close();
            fileInputStream.close();
        } catch (Exception e) {
            log.error(e.getMessage());
            try {
                if (fileInputStream != null) fileInputStream.close();
                if (outputStream != null) outputStream.close();;
            } catch (Exception exception) {
                log.error(e.getMessage());
                throw new MyException(ResultEnum.DEFAULT_EXCEPTION);
            }
            throw new MyException(ResultEnum.DEFAULT_EXCEPTION);
        }
    }

    @Override
    public void getRaster(String visualId, int x, int y, int z, HttpServletResponse response) {
        VisualFile visualFile = visualFileMapper.findById(visualId);
        y = (int) Math.pow(2, z) - y - 1;
        String path = visualDir + visualFile.getContent() + "/" + z + "/" + x + "/" + y + ".png";
        InputStream in = null;
        ServletOutputStream sos = null;
        try {
            response.setContentType("image/png");
            sos = response.getOutputStream();
            File file = new File(path);
            if (!file.exists()) {
                in = new FileInputStream(visualDir + "blank.png");
            } else {
                in = new FileInputStream(path);
            }
            byte[] bytes = new byte[1024];
            int len;
            while ((len = in.read(bytes)) > -1) {
                sos.write(bytes, 0, len);
            }
            sos.flush();
            sos.close();
            in.close();
        } catch (Exception e) {
            log.error(e.getMessage());
            try {
                if (in != null) {
                    in.close();
                }
                if (sos != null) {
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
    public void getVectorTiles(String visualId, int x, int y, int z, HttpServletResponse response) {
        VisualFile visualFile = visualFileMapper.findById(visualId);
        TileBox tileBox = TileUtil.tile2boundingBox(x, y, z, (String) visualFile.getContent());
        tileBox.setVisualId(visualId);
        byte[] bytes;
        if (visualFile.getType().equals("pointVectorTile") || visualFile.getType().equals("lineVectorTile") || visualFile.getType().equals("polygonVectorTile")) {
            bytes = (byte[]) vectorTileMapper.getVictorTile(tileBox);
        } else {
            bytes = (byte[]) vectorTileMapper.getVictorTile3D(tileBox);
        }
        ServletOutputStream sos = null;
        try {
            response.setContentType("application/octet-stream");
            sos = response.getOutputStream();
            sos.write(bytes);
            sos.flush();
            sos.close();
        } catch (Exception e) {
            log.error(e.getMessage());
            try {
                if (sos != null) {
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
    public void getPhoto(String fileId, HttpServletResponse response) {
        Files files = filesMapper.findInfoById(fileId);
        InputStream in = null;
        ServletOutputStream sos = null;
        try {
            in = new FileInputStream(baseDir + files.getAddress());
            sos = response.getOutputStream();
            byte[] bytes = new byte[1024];
            int len;
            while ((len = in.read(bytes)) != -1) {
                sos.write(bytes, 0, len);
            }
            sos.flush();
            sos.close();
            in.close();
        } catch (Exception e) {
            log.error(e.getMessage());
            try {
                if (in != null) {
                    in.close();
                }
                if (sos != null) {
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
    public JSONArray getCoordinates(String visualId) {
        VisualFile visualFile = visualFileMapper.findById(visualId);
        String content = visualFile.getContent();
        JSONObject jsonObject = JSONObject.parseObject(content);
        return jsonObject.getJSONArray("coordinates");
    }

    @Override
    public void getPngResource(String visualId, HttpServletResponse response) {
        VisualFile visualFile = visualFileMapper.findById(visualId);
        String content = visualFile.getContent();
        JSONObject jsonObject = JSONObject.parseObject(content);
        String address = visualDir + jsonObject.getString("address");
        InputStream in = null;
        ServletOutputStream sos = null;
        try {
            in = new FileInputStream(address);
            sos = response.getOutputStream();
            response.setContentType("image/png");
            byte[] bytes = new byte[1024];
            int len;
            while ((len = in.read(bytes)) > -1) {
                sos.write(bytes, 0, len);
            }
            sos.flush();
            sos.close();
            in.close();
        } catch (Exception e) {
            log.error(e.getMessage());
            try {
                if (in != null) {
                    in.close();
                }
                if (sos != null) {
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
    public JSONObject getContent(String visualId) {
        VisualFile visualFile = visualFileMapper.findById(visualId);
        return JSONObject.parseObject(visualFile.getContent());
    }

    @Override
    public JSONObject getTide(String visualId) {
        VisualFile visualFile = visualFileMapper.findById(visualId);
        String path = visualDir + visualFile.getContent();
        return FileUtil.readJson(path);
    }

    @Override
    public JSONObject getRateDirection(String visualId) {
        VisualFile visualFile = visualFileMapper.findById(visualId);
        String path = visualDir + visualFile.getContent();
        return FileUtil.readJson(path);
    }

    @Override
    public JSONObject getSandContent(String visualId) {
        VisualFile visualFile = visualFileMapper.findById(visualId);
        String path = visualDir + visualFile.getContent();
        return FileUtil.readJson(path);
    }

    @Override
    public JSONObject getFlowSand_Z(String visualId) {
        VisualFile visualFile = visualFileMapper.findById(visualId);
        String path = visualDir + visualFile.getContent();
        return FileUtil.readJson(path);
    }

    @Override
    public JSONObject getSalinity(String visualId) {
        VisualFile visualFile = visualFileMapper.findById(visualId);
        String path = visualDir + visualFile.getContent();
        return FileUtil.readJson(path);
    }

    @Override
    public JSONObject getSuspension(String visualId) {
        VisualFile visualFile = visualFileMapper.findById(visualId);
        String path = visualDir + visualFile.getContent();
        return FileUtil.readJson(path);
    }



    @Override
    public JSONObject getGeoJson(String fileId) {
        String path = visualDir + "geoJson/" + fileId + ".json";
        return FileUtil.readJson(path);
    }


    @Override
    public JSONObject getTianDiTu() {
//        String jsonString = "{\"version\":8,\"sources\":{\"tdtVec\":{\"type\":\"raster\",\"tiles\":[\"http://t0.tianditu.com/vec_w/wmts?tk=35a94ab5985969d0b93229c30db6abd6&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles\"],\"tileSize\":256},\"txt\":{\"type\":\"raster\",\"tiles\":[\"http://t0.tianditu.com/cva_w/wmts?tk=35a94ab5985969d0b93229c30db6abd6&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles\"],\"tileSize\":256}},\"layers\":[{\"id\":\"tdtVec\",\"type\":\"raster\",\"source\":\"tdtVec\"},{\"id\":\"txt\",\"type\":\"raster\",\"source\":\"txt\"}]}";
        String path = mapDir + "tianditu.json";
        return FileUtil.readJson(path);
    }

    @Override
    public JSONObject getTianDiTuImage() {
        String path = mapDir + "tianditu-image.json";
        return FileUtil.readJson(path);
    }




    @Override
    public void video(String id, HttpServletRequest request, HttpServletResponse response) {
        Files files = filesMapper.findInfoById(id);
        String path = baseDir + files.getAddress();
        File file = new File(path);
        if (!file.exists()) {
            throw new MyException(ResultEnum.NO_OBJECT);
        }
        long fileLength = file.length();
        try {
            RandomAccessFile randomAccessFile = new RandomAccessFile(file, "r");
            String rangeString = request.getHeader("Range");
            long range=0;
            if (StrUtil.isNotBlank(rangeString)) {
                range = Long.valueOf(rangeString.substring(rangeString.indexOf("=") + 1, rangeString.indexOf("-")));
            }
            OutputStream outputStream = response.getOutputStream();
            response.setHeader("Content-Type", "video/mp4");
            response.setStatus(HttpServletResponse.SC_PARTIAL_CONTENT);
            randomAccessFile.seek(range);
            byte[] bytes = new byte[1024 * 1024 * 2];
            int len = randomAccessFile.read(bytes);
            response.setContentLength(len);
            response.setHeader("Content-Range", "bytes "+range+"-"+(fileLength-1)+"/"+fileLength);
            outputStream.write(bytes, 0, len);
            outputStream.close();
            randomAccessFile.close();

        } catch (Exception e) {
            log.error(e.getMessage());
            throw new MyException(ResultEnum.DEFAULT_EXCEPTION);
        }
    }
}
