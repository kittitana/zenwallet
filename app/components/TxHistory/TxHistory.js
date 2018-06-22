// @flow
import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import Flexbox from 'flexbox-react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import Layout from '../UI/Layout/Layout'
import OnScrollBottom from '../UI/OnScrollBottom'
import CopyableTableCell from '../UI/CopyableTableCell'
import TransactionHistoryState, { type ObservableTransactionResponse } from '../../states/tx-history-state'

import SingleTxDelta from './SingleTxDelta'

type Props = {
  txhistory: TransactionHistoryState
};

@inject('txhistory')
@observer
class TxHistory extends Component<Props> {
  componentDidMount() {
    this.props.txhistory.initPolling()
  }

  componentWillUnmount() {
    this.props.txhistory.reset()
  }

  renderTransactionsCell(tx: ObservableTransactionResponse) {
    // $FlowFixMe
    if (tx.deltas.length === 1) {
      return (
        <SingleTxDelta tx={tx.deltas[0]} />
      )
    }

    if (tx.deltas.length > 1) {
      const deltasRows = tx.deltas.reverse().map(t => (
        <tr key={t.asset}>
          <SingleTxDelta tx={t} />
        </tr>
      ))

      return (
        <td colSpan="3" className="multiple-inner-tx-deltas">
          <table>
            <tbody>
              {deltasRows}
            </tbody>
          </table>
        </td>
      )
    }
  }

  renderRows() {
    const { txhistory } = this.props
    return txhistory.transactions.map(tx => (
      <Fragment key={tx.txHash}>
        <tr>
          <CopyableTableCell string={tx.txHash} />
          <SingleTxDelta tx={tx} />
        </tr>
        <tr className="separator" />
      </Fragment>
    ))
  }

  renderLoadingTransactions() {
		return (
      <tr className="loading-transactions">
        <td colSpan={5}>
          <Flexbox>
            <Flexbox flexGrow={1} >Loading transactions ...</Flexbox>
            <FontAwesomeIcon icon={['far', 'spinner-third']} spin />
          </Flexbox>
        </td>
      </tr>
    )
  }
  render() {
    const { txhistory } = this.props
    return (
      <Layout className="balances">

        <Flexbox className="page-title">
          <h1>Transactions</h1>
        </Flexbox>

        <Flexbox className="balance-list">
          <table>
            <thead>
              <tr>
                <th className="align-left">Transaction Hash</th>
                <th className="align-left">Asset Hash</th>
                <th className="align-left">Asset Name</th>
                <th className="align-left">Confirmations</th>
                <th className="align-right">Amount</th>
              </tr>
              <tr className="separator" />
            </thead>
            <tbody>
              { this.renderRows() }
              { txhistory.isFetching && (txhistory.transactions.length > 20) && this.renderLoadingTransactions() }
            </tbody>
          </table>
        </Flexbox>
        <OnScrollBottom onScrollBottom={txhistory.fetch} />
      </Layout>
    )
  }
}

export default TxHistory
