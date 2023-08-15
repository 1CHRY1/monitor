package nnu.edu.back.controller;

import nnu.edu.back.common.auth.AuthCheck;
import nnu.edu.back.common.resolver.JwtTokenParser;
import nnu.edu.back.common.result.JsonResult;
import nnu.edu.back.common.result.ResultUtils;
import nnu.edu.back.pojo.BrowseHistory;
import nnu.edu.back.service.BrowseHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.UUID;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/08/15/19:38
 * @Description:
 */
@RestController
@RequestMapping("/browseHistory")
public class BrowseHistoryController {
    @Autowired
    BrowseHistoryService browseHistoryService;

    @AuthCheck
    @RequestMapping(value = "/addHistory/{dataId}", method = RequestMethod.POST)
    public JsonResult addHistory(@JwtTokenParser("email") String userId, @PathVariable String dataId) {
        BrowseHistory browseHistory = new BrowseHistory();
        browseHistory.setUserId(userId);
        browseHistory.setDataId(dataId);
        browseHistory.setId(UUID.randomUUID().toString());
        browseHistoryService.addHistory(browseHistory);
        return ResultUtils.success();
    }

    @AuthCheck
    @RequestMapping(value = "/getDataGroup/{dataId}/{number}", method = RequestMethod.GET)
    public JsonResult getDataGroup(@PathVariable String dataId, @PathVariable int number) {
        return ResultUtils.success(browseHistoryService.getDataGroupByDate(dataId, number));
    }
}
