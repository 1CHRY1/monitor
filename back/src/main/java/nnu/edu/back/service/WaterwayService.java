package nnu.edu.back.service;

import nnu.edu.back.pojo.Anchor;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/08/16/23:01
 * @Description:
 */
public interface WaterwayService {
    List<Anchor> getAnchorInfoByBox(double top, double right, double bottom, double left);
}
