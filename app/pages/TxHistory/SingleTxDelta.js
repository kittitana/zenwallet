// @flow

import React from 'react'
import { inject, observer } from 'mobx-react'
import cx from 'classnames'

import { getAssetName } from '../../utils/helpers'
import { normalizeTokens, isZenAsset } from '../../utils/zenUtils'
import CopyableTableCell from '../../components/CopyableTableCell'
import ExternalLink from '../../components/ExternalLink'
import NetworkStore from '../../stores/networkStore'

type Props = {
  networkStore: NetworkStore,
  tx: {
    confirmations: number,
    amount: number,
    asset: string
  }
};

@inject('networkStore')
@observer
class SingleTxDelta extends React.Component<Props> {
  get displayAmount() {
    const { asset, amount } = this.props.tx
    return normalizeTokens(amount, isZenAsset(asset))
  }
  get assetName() {
    const { asset } = this.props.tx
    return getAssetName(asset)
  }
  get blockNumber() {
    const { networkStore, tx } = this.props
    return (networkStore.headers - tx.confirmations) + 1
  }
  render() {
    const { asset, amount, confirmations } = this.props.tx
    return (
      <React.Fragment>
        <CopyableTableCell string={asset} />
        <td>{this.assetName}</td>
        <td>
          <ExternalLink link={`https://zp.io/blocks/${this.blockNumber}`}>
            {this.blockNumber}
          </ExternalLink>
        </td>
        <td>{confirmations}</td>
        <td
          className={cx('amount align-right', amount > 0 ? 'green' : 'red')}
        >{this.displayAmount}
        </td>
      </React.Fragment>

    )
  }
}

export default SingleTxDelta
