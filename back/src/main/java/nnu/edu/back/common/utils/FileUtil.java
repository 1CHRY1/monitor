package nnu.edu.back.common.utils;

import lombok.extern.slf4j.Slf4j;
import net.lingala.zip4j.ZipFile;
import nnu.edu.back.common.exception.MyException;
import nnu.edu.back.common.result.ResultEnum;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.nio.channels.FileChannel;
import java.nio.charset.Charset;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/08/14/11:04
 * @Description:
 */
@Slf4j
public class FileUtil {
    public static int uploadFile(MultipartFile multipartFile, String fileName, String address) {
        File file = new File(address);
        if (!file.exists()) {
            file.mkdirs();
        }
        InputStream inputStream = null;
        FileOutputStream fileOutputStream = null;
        try {
            inputStream = multipartFile.getInputStream();
            fileOutputStream = new FileOutputStream(address + "/" + fileName);
            int len;
            byte[] bytes = new byte[1024];
            while ((len = inputStream.read(bytes)) != -1) {
                fileOutputStream.write(bytes, 0, len);
            }
            fileOutputStream.flush();
            fileOutputStream.close();
            inputStream.close();
            return 0;
        } catch (Exception e) {
            log.error(e.getMessage());
            try {
                if (inputStream != null) inputStream.close();
                if (fileOutputStream != null) fileOutputStream.close();
            } catch (Exception exception) {
               log.error(exception.getMessage());
            }
            return -1;
        }
    }

    public static int mergeFile(String from, String to, int total) {
        File ft = new File(to);
        FileInputStream in = null;
        FileChannel inChannel = null;
        FileOutputStream out = null;
        FileChannel outChannel = null;
        try {
            out = new FileOutputStream(ft, true);
            outChannel = out.getChannel();
            long start = 0;
            for (int i = 0; i < total; i++) {
                File file = new File(from + "/" + i);
                in = new FileInputStream(file);
                inChannel = in.getChannel();

                // 从inChannel中读取file.length()长度的数据，写入outChannel的start处
                outChannel.transferFrom(inChannel, start, file.length());
                start += file.length();
                in.close();
                inChannel.close();
            }
            out.flush();
            out.close();
            outChannel.close();
            return 0;
        } catch (Exception e) {
            log.error(e.getMessage());
            try {
                if (in != null) in.close();
                if (inChannel != null) inChannel.close();
                if (out != null) out.close();
                if (outChannel != null) outChannel.close();
            } catch (Exception exception) {
                log.error(exception.getMessage());
            }
            return -1;
        }
    }

    public static int unpack(String destination, String to) {
        File file = new File(destination);
        if (!file.exists()) {
            return -1;
        }
        ZipFile zipFile = new ZipFile(destination);
        zipFile.setCharset(Charset.forName("GBK"));
        try {
            zipFile.extractAll(to);
        } catch (Exception e) {
            log.error(e.getMessage());
            return -1;
        }
        return 0;
    }
}
