package nnu.edu.back.controller;

import nnu.edu.back.pojo.Anchor;
import nnu.edu.back.service.WaterwayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/08/16/23:00
 * @Description:
 */
@RestController
@RequestMapping("/waterway")
public class WaterwayController {
    @Autowired
    WaterwayService waterwayService;

    @RequestMapping(value = "/getAnchorInfoByBox/{top}/{right}/{bottom}/{left}", method = RequestMethod.GET)
    public List<Anchor> getAnchorInfoByBox(@PathVariable double top, @PathVariable double right, @PathVariable double bottom, @PathVariable double left) {
        return waterwayService.getAnchorInfoByBox(top, right, bottom, left);
    }
}
