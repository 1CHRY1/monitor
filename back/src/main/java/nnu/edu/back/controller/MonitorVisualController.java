package nnu.edu.back.controller;

import nnu.edu.back.common.result.JsonResult;
import nnu.edu.back.common.result.ResultUtils;
import nnu.edu.back.service.MonitorVisualService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/08/23/11:01
 * @Description:
 */
@RestController
@RequestMapping("/monitorVisual")
public class MonitorVisualController {
    @Autowired
    MonitorVisualService monitorVisualService;

    @RequestMapping(value = "/getAllSection/{projectId}", method = RequestMethod.GET)
    public JsonResult getAllSection(@PathVariable String projectId) {
        return ResultUtils.success(monitorVisualService.getAllSection(projectId));
    }

    @RequestMapping(value = "/getSectionElevation/{projectId}", method = RequestMethod.GET)
    public JsonResult getSectionElevation(@PathVariable String projectId) {
        return ResultUtils.success(monitorVisualService.getSectionElevation(projectId));
    }

    @RequestMapping(value = "/getFlux/{projectId}", method = RequestMethod.GET)
    public JsonResult getFlux(@PathVariable String projectId) {
        return ResultUtils.success(monitorVisualService.getFlux(projectId));
    }

    @RequestMapping(value = "/getSubstrate/{projectId}", method = RequestMethod.GET)
    public JsonResult getSubstrate(@PathVariable String projectId) {
        return ResultUtils.success(monitorVisualService.getSubstrate(projectId));
    }

    @RequestMapping(value = "/getSandTransportNameAndType/{projectId}", method = RequestMethod.GET)
    public JsonResult getSandTransportNameAndType(@PathVariable String projectId) {
        return ResultUtils.success(monitorVisualService.getSandTransportNameAndType(projectId));
    }

    @RequestMapping(value = "/getSandTransportByNameAndType/{projectId}/{name}/{type}", method = RequestMethod.GET)
    public JsonResult getSandTransportByNameAndType(@PathVariable String projectId, @PathVariable String name, @PathVariable String type) {
        return ResultUtils.success(monitorVisualService.getSandTransportByNameAndType(projectId, name, type));
    }

    @RequestMapping(value = "/getSpeedOrientationNameAndType/{projectId}", method = RequestMethod.GET)
    public JsonResult getSpeedOrientationNameAndType(@PathVariable String projectId) {
        return ResultUtils.success(monitorVisualService.getSpeedOrientationNameAndType(projectId));
    }

    @RequestMapping(value = "/getSpeed/{projectId}/{name}/{type}", method = RequestMethod.GET)
    public JsonResult getSpeed(@PathVariable String projectId, @PathVariable String name, @PathVariable String type) {
        return ResultUtils.success(monitorVisualService.getSpeed(projectId, name, type));
    }

    @RequestMapping(value = "/getOrientation/{projectId}/{name}/{type}", method = RequestMethod.GET)
    public JsonResult getOrientation(@PathVariable String projectId, @PathVariable String name, @PathVariable String type) {
        return ResultUtils.success(monitorVisualService.getOrientation(projectId, name, type));
    }

    @RequestMapping(value = "/getSandContentClass/{projectId}", method = RequestMethod.GET)
    public JsonResult getSandContentClass(@PathVariable String projectId) {
        return ResultUtils.success(monitorVisualService.getSandContentClass(projectId));
    }

    @RequestMapping(value = "/getSandContentValue/{projectId}/{name}", method = RequestMethod.GET)
    public JsonResult getSandContentValue(@PathVariable String projectId, @PathVariable String name) {
        return ResultUtils.success(monitorVisualService.getSandContentValue(projectId, name));
    }


    @RequestMapping("/test")
    public JsonResult test() {
        return ResultUtils.success(monitorVisualService.test());
    }
}
