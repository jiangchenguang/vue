/**
 * 根据位置信息判断
 */
function calcPosition(posInfo, timeInfo){
  // 在指定的时间出现
  if (isPrecent(posInfo, timeInfo)) {
    return 5;
  }
  // 时间太长
  if (tooLong(timeInfo)) {
    return 1;
  }
  return 0;
}

/**
 * 根据汽车情况判断 车型库平台
 */
function calcCarInfo(carInfo){
  // 车辆发生损坏
  if (ifBroken(carInfo)) {
    return 5;
  }

  // 车辆外表变化
  if (carChanged(carInfo)) {
    return 5;
  }

  // 驾驶员变化
  if (driverChanged(carInfo)) {
    return 5;
  }

  return 0;
}

/**
 * 根据汽车情况判断 车辆配件监管平台
 */
function calcAccessoriesInfo(accessorInfo, carInfo){
  // 车辆使用配件
  if (use(accessorInfo, carInfo)) {
    return 1;
  }

  return 0;
}

/**
 * 根据汽车情况判断 车辆维修平台
 */
function calcServiceInfo(serviceInfo, carInfo){
  // 维修部位相同
  if (same(serviceInfo, carInfo)) {
    return 1;
  }

  return 0;
}

/**
 * 根据电话信息判断 手机gps平台
 */
function calcGps(phoneCallInfo, posInfo, timeInfo) {
  if (
    tooManyTimes(phoneCallInfo) || // 次数过多
    makeCallsAfterTimes(phoneCallInfo, posInfo, timeInfo) || // 事后在现场打电话的
    isClosed(phoneCallInfo) // 事后关机
  ) {
    return 5;
  }

  // 现场打电话的
  if (makeCall(phoneCallInfo, posInfo)) {
    return 1;
  }

  return 0;
}

/**
 * 根据驾驶员信息判断 警务平台
 */
function calcDriver(driverInfo, dnaInfo) {
  if (
    hasCrimanalRecord(phoneCallInfo) || // 有犯罪记录的
    invalidDriver(driverInfo) // 没有、或被吊销驾驶证的
  ) {
    return 1;
  }

  // 现场打电话的
  if (sameDna(driverInfo, dnaInfo)) {
    return 1;
  }

  return 0;
}

/**
 * 根据dna信息判断 医院平台
 */
function calcDNA(driverInfo, dnaInfo){
  if (sameTrauma(driverInfo)) { // 外伤类似
    return 1;
  }

  if (sameDna(driverInfo, dnaInfo)) {
    return 10;
  }

  return 0;
}

/**
 * 判断
 */
function judge(){
  int r = calcPosition() + calcCarInfo() + calcAccessoriesInfo() + calcServiceInfo() + calcGps() + calcDriver() + calcDNA();
  if (r > 10) {
    // 重度可疑
  } else if (r > 5 && r <= 10) {
    // 中度可疑
  } else {
    // 轻度可疑
  }
}




