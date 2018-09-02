// @flow
import { action, observable } from 'mobx'
import { ipcRenderer } from 'electron'

import db from '../services/db'
import { APP_CHECK_FOR_UPDATES, APP_CHECKING_FOR_UPDATES } from '../constants/autoUpdate'

const AUTO_UPDATE_ENABLED = 'config.autoUpdateEnabled'
const AUTO_UPDATE_CHECK_INTERVAL = 'config.autoUpdateCheckInterval'
const AUTO_UPDATE_SKIP_VERSION = 'config.autoUpdateSkipVersion'

const MINUTE = 1000 * 60
const FIVE_MINUTES = 5 * MINUTE
const TWENTY_FOUR_HOURS = 24 * 60 * MINUTE
let autoUpdateTimerId

class AutoUpdateStore {
  @observable autoUpdateEnabled = true
  @observable autoUpdateCheckInterval = FIVE_MINUTES
  @observable autoUpdateSkipVersion = ''
  @observable autoUpdateStatus = ''

  constructor() {
    const autoUpdateEnabled = db.get(AUTO_UPDATE_ENABLED).value()
    const autoUpdateCheckInterval = db.get(AUTO_UPDATE_CHECK_INTERVAL).value()
    const autoUpdateSkipVersion = db.get(AUTO_UPDATE_SKIP_VERSION).value()

    this.autoUpdateEnabled = autoUpdateEnabled !== undefined ? autoUpdateEnabled : true
    this.autoUpdateCheckInterval = autoUpdateCheckInterval !== undefined ?
      autoUpdateCheckInterval : FIVE_MINUTES
    this.autoUpdateSkipVersion = autoUpdateSkipVersion
  }

  @action
  skipVersion(version: string) {
    this.autoUpdateSkipVersion = version
    db.set(AUTO_UPDATE_SKIP_VERSION, version).write()
  }

  @action
  setAutoUpdateCheckInterval(value: number) {
    this.autoUpdateCheckInterval = value
    db.set(AUTO_UPDATE_CHECK_INTERVAL, value).write()
    this.resetAutoUpdateTimer()
  }

  setAutoUpdateCheckIntervalToDaily() {
    this.setAutoUpdateCheckInterval(TWENTY_FOUR_HOURS)
  }

  setAutoUpdateCheckIntervalToFiveMinutes() {
    this.setAutoUpdateCheckInterval(FIVE_MINUTES)
  }

  @action
  setAutoUpdateEnabled(value: boolean) {
    this.autoUpdateEnabled = value
    db.set(AUTO_UPDATE_ENABLED, value).write()
    this.resetAutoUpdateTimer()
  }

  checkForUpdates() {
    ipcRenderer.send(APP_CHECK_FOR_UPDATES)
    this.autoUpdateStatus = APP_CHECKING_FOR_UPDATES
  }

  resetAutoUpdateTimer() {
    clearInterval(autoUpdateTimerId)
    if (this.autoUpdateEnabled) {
      autoUpdateTimerId = setInterval(() => {
        this.checkForUpdates()
      }, this.autoUpdateCheckInterval)
    }
  }
}

export default AutoUpdateStore
