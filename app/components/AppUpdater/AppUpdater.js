// @flow
import { observer, inject } from 'mobx-react'
import React from 'react'
import { ipcRenderer } from 'electron'

import AutoUpdateStore from '../../stores/autoUpdateStore'
import {
  APP_UPDATE_AVAILABLE, APP_UPDATE_DOWNLOADED,
  APP_UPDATE_NOT_AVAILABLE,
  APP_IDLE, APP_UPDATE_ERROR,
} from '../../constants/autoUpdate'

import appUpdateDownloadModal from './AppUpdateDownloadModal'
import appUpdateInstallModal from './AppUpdateInstallModal'

type Props = {
  autoUpdateStore: AutoUpdateStore
};

type UpdateInfo = {
  version: string,
  files: Array<*>,
  releaseName: string,
  releaseNotes: string,
  releaseDate: string,
  stagingPercentage: number
};

@inject('autoUpdateStore')
@observer
class AppUpdater extends React.Component<Props> {
  componentDidMount() {
    const { autoUpdateStore } = this.props
    ipcRenderer.on(APP_UPDATE_AVAILABLE, (event: *, info: UpdateInfo) => {
      if (autoUpdateStore.autoUpdateSkipVersion !== info.version) {
        appUpdateDownloadModal(info.version, info.releaseNotes, autoUpdateStore)
      }
      autoUpdateStore.autoUpdateStatus = APP_IDLE
    })

    ipcRenderer.on(APP_UPDATE_DOWNLOADED, (event, info) => {
      appUpdateInstallModal(info.version)
      autoUpdateStore.autoUpdateStatus = APP_IDLE
    })

    ipcRenderer.on(APP_UPDATE_NOT_AVAILABLE, () => {
      autoUpdateStore.autoUpdateStatus = APP_IDLE
    })

    ipcRenderer.on(APP_UPDATE_ERROR, () => {
      autoUpdateStore.autoUpdateStatus = APP_IDLE
    })
  }

  render() {
    return null
  }
}

export default AppUpdater
