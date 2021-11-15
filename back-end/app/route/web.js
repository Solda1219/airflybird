const router = require('express').Router();
//middleware
const requireSuper = require('../middlewares/requireSuper');
const requireAdmin = require('../middlewares/requireAdmin');
const requireAgent = require('../middlewares/requireAgent');
const requireAuth = require('../middlewares/requireAuth');
//setting cookie and tokens
const settingSystem = require('../controller/setting_system')
//controller
const userController = require('../controller/user')
const accountController = require('../controller/account')
const deviceController = require('../controller/device')
const videoController = require('../controller/video')
const detectController = require('../controller/detect')
const equipmentController = require('../controller/equipment')
const monitorController = require('../controller/monitor')
const fileController = require('../controller/file')
const gpsController = require('../controller/gps')
const alertController = require('../controller/alert')
const reportController = require('../controller/report')
const dashboarController = require('../controller/dashboard')
const heartbeatController = require('../controller/heartbeat')
const onlineController = require('../controller/online')
//user
router.post('/user/loginAsAdmin',userController.loginAdmin);
router.post('/user/loginAsAgent',userController.loginAgent);
router.post('/user/loginAsUser',userController.loginUser);
router.post('/user/getCustomerList',[requireAuth],userController.getCustomerList);
router.post('/user/resetPassword',[requireAuth],userController.resetPassword);

router.post('/account/admin/getAdmins',[requireAuth,requireSuper],accountController.getAdmins);
router.post('/account/admin/createAdmins',[requireAuth,requireSuper],accountController.createAdmins);
router.post('/account/admin/editAdmins',[requireAuth,requireSuper],accountController.editAdmins);
router.post('/account/admin/delAdmins',[requireAuth,requireSuper],accountController.delAdmins);
router.post('/account/admin/resetPasswordAdmin',[requireAuth,requireSuper],accountController.resetPasswordAdmin);


router.post('/account/agent/getAgents',[requireAuth],accountController.getAgents);
router.post('/account/agent/getAgentUserList',[requireAuth,requireAdmin],accountController.getAgentUserList);
router.post('/account/agent/createAgents',[requireAuth,requireAdmin],accountController.createAgents);
router.post('/account/agent/editAgents',[requireAuth,requireAdmin],accountController.editAgents);
router.post('/account/agent/delAgents',[requireAuth,requireAdmin],accountController.delAgents);
router.post('/account/agent/resetPasswordAgents',[requireAuth,requireAdmin],accountController.resetPasswordAgents);

router.post('/account/enduser/getEndusers',[requireAuth,requireAgent],accountController.getEndusers);
router.post('/account/enduser/getGPSInfo',[requireAuth,requireAgent],accountController.gpsInfo);
router.post('/account/enduser/createEndusers',[requireAuth,requireAgent],accountController.createEndusers);
router.post('/account/enduser/editEndusers',[requireAuth,requireAgent],accountController.editEndusers);
router.post('/account/enduser/delEndusers',[requireAuth,requireAgent],accountController.delEndusers);
router.post('/account/enduser/resetPasswordEndusers',[requireAuth,requireAgent],accountController.resetPasswordEndusers);


//device
router.post('/device/deviceAll',[requireAuth],deviceController.deviceAll);
router.post('/device/gpsInfo',[requireAuth],deviceController.gpsInfo);
router.post('/device/pushStream',[requireAuth],deviceController.pushStream);
router.post('/device/sendCommand',[requireAuth],deviceController.sendCommand);
//video
router.post('/video/getindex',[requireAuth],videoController.getindex); 
router.post('/video/live/getlive',[requireAuth],videoController.getlive);
router.post('/video/live/createlive',[requireAuth],videoController.createlive);
router.post('/video/live/deletelive',[requireAuth],videoController.deletelive);
router.post('/video/live/getliveRecords',[requireAuth],videoController.getliveRecords);

router.post('/video/vod/getvod',[requireAuth],videoController.getvod);
router.post('/video/vod/deletevod',[requireAuth],videoController.deletevod);

//detect
router.post('/detect/status/getstatus',[requireAuth],detectController.getstatus);
router.post('/detect/app/appstatus',[requireAuth],detectController.appstatus);

router.post('/detect/vod/getvod',[requireAuth],detectController.getvod);
router.post('/detect/vod/deletevod',[requireAuth],detectController.deletevod);
router.post('/detect/vod/getsnapInfo',[requireAuth],detectController.getsnapInfo);
router.post('/detect/vod/deletesnapInfo',[requireAuth],detectController.deletesnapInfo);
router.post('/detect/vod/updatesnapinfo',[requireAuth],detectController.updatesnapinfo);
router.post('/detect/vod/locksnapinfo',[requireAuth],detectController.locksnapInfo);
router.post('/detect/vod/unlocksnapinfo',[requireAuth],detectController.unlocksnapInfo);
router.post('/detect/vod/moveToGroup',[requireAuth],detectController.moveToGroup);
router.post('/detect/vod/deleteGroup',[requireAuth],detectController.deleteGroup);

router.post('/detect/vod/detect',[requireAuth],detectController.vodDetect);

//equipment
router.post('/equipment/camera/getCameras',[requireAuth,requireAdmin],equipmentController.getCameras);
router.post('/equipment/camera/createCameras',[requireAuth,requireAdmin],equipmentController.createCameras);
router.post('/equipment/camera/editCameras',[requireAuth,requireAdmin],equipmentController.editCameras);
router.post('/equipment/camera/delCameras',[requireAuth,requireAdmin],equipmentController.delCameras);
router.post('/equipment/camera/resetTermOfCameras',[requireAuth,requireAdmin],equipmentController.resetTermOfCameras);

router.post('/equipment/ftp/getFTP',[requireAuth,requireAdmin],equipmentController.getFTP);
router.post('/equipment/ftp/createFTP',[requireAuth,requireAdmin],equipmentController.createFTP);
router.post('/equipment/ftp/editFTP',[requireAuth,requireAdmin],equipmentController.editFTP);
router.post('/equipment/ftp/delFTP',[requireAuth,requireAdmin],equipmentController.delFTP);

router.post('/equipment/media/getMedia',[requireAuth,requireAdmin],equipmentController.getMedia);
router.post('/equipment/media/createMedia',[requireAuth,requireAdmin],equipmentController.createMedia);
router.post('/equipment/media/editMedia',[requireAuth,requireAdmin],equipmentController.editMedia);
router.post('/equipment/media/delMedia',[requireAuth,requireAdmin],equipmentController.delMedia);

router.post('/equipment/gpu/getGPU',[requireAuth,requireAdmin],equipmentController.getGPU);
router.post('/equipment/gpu/createGPU',[requireAuth,requireAdmin],equipmentController.createGPU);
router.post('/equipment/gpu/editGPU',[requireAuth,requireAdmin],equipmentController.editGPU);
router.post('/equipment/gpu/delGPU',[requireAuth,requireAdmin],equipmentController.delGPU);
router.post('/equipment/gpu/cameras',[requireAuth,requireAdmin],equipmentController.cameras);
//monitor
router.post('/monitor/playback/date',[requireAuth],monitorController.PlaybackDate);
router.post('/monitor/getVehicleInfo',[requireAuth],monitorController.getVehicleInfo);
router.post('/monitor/trips/getInfo',[requireAuth],monitorController.getTrips);
router.post('/monitor/trips/getlive',[requireAuth],videoController.getliveForMonitor);
router.post('/monitor/playback/getInfo',[requireAuth],monitorController.getPlayback);
router.post('/monitor/realtime/getInfo',[requireAuth],monitorController.getRealTimeGpsInfos);
//report
router.post('/report/trip/get',[requireAuth],reportController.tripreport);
router.post('/report/violation/get',[requireAuth],reportController.violationreport);
router.post('/report/violation/type',[requireAuth],reportController.getViolationType);
router.post('/report/violation/copydownloadurl',[requireAuth],reportController.copydownloadurl);
router.post('/report/violation/recorddownload',[requireAuth],reportController.recorddownload);
router.post('/report/violation/getrecorddownload',[requireAuth],reportController.getrecorddownload);
router.post('/report/overveiw/get',[requireAuth],reportController.OverViewReport);
router.post('/report/overspeed/get',[requireAuth],reportController.OverSpeedReport);
router.post('/report/parking/get',[requireAuth],reportController.ParkingReport);
router.post('/report/idling/get',[requireAuth],reportController.IdlingReport);
router.post('/report/ignition/get',[requireAuth],reportController.IgnitionReport);
router.post('/report/online/get',[requireAuth],reportController.OnlineReport);
router.post('/report/offline/get',[requireAuth],reportController.OfflineReport);

router.post('/report/alert/get',[requireAuth],alertController.getAlertReport);
router.post('/report/alertDetail/get',[requireAuth],alertController.getAlertDetailReport);
router.post('/report/alert/getType',[requireAuth],alertController.getTypeForAlertReport);

router.post('/report/deviceStatic/getDriveBehaviour',[requireAuth],alertController.getDrivingbehaviourReport);
router.post('/report/deviceStatic/getTypeOfDrive',[requireAuth],alertController.getTypeOfDrive);
//dashboard
router.post('/dashboard/overview',[requireAuth],dashboarController.getoverview);
//alarm
router.post('/alarm/get',[requireAuth],alertController.getAlert);
router.post('/alarm/read',[requireAuth],alertController.readAlert);
router.post('/alarm/remark',[requireAuth],alertController.remark);
router.post('/alarm/getBasicSetting',[requireAuth,requireAdmin],alertController.getBasicSetting);
router.post('/alarm/editBasicSetting',[requireAuth,requireAdmin],alertController.editBasicSetting);

//message
router.post('/message/get',[requireAuth],alertController.getMessage);
router.post('/message/read',[requireAuth],alertController.readMessage);
//file
router.post('/file/_detectImagefileToServer',fileController._detectImagefileToServer);
//api gps data push
router.post('/gps/pushgps',gpsController.pushgps);
router.post('/gps/pushalarm',alertController.push);
router.post('/gps/pushevent',onlineController.push);
router.post('/gps/pushhb',heartbeatController.push);
//api map
router.post('/map/addressinfo',monitorController.addressinfo);
module.exports = router
