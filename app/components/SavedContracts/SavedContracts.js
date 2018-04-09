import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import autobind from 'class-autobind'
import { Link } from 'react-router-dom'
import Flexbox from 'flexbox-react'
import swal from 'sweetalert'

const { clipboard } = require('electron')

import Layout from '../UI/Layout/Layout'
import CopyableTableCell from '../UI/CopyableTableCell'

import db from '../../services/store'
import { truncateString } from '../../../utils/helpers'

const contractList = db.get('savedContracts')

class SavedContracts extends Component {
  constructor(props) {
    super(props)
    autobind(this)
  }

  onRemoveContractClicked() {
    const { contractMessage } = this.props
    contractMessage.sendContractMessage(contractMessage)
  }

  onDeleteClicked = (hash) => {
    swal({
      title: 'Are you sure?',
      text: 'Are you sure that you want to delete this contract?',
      icon: 'warning',
      dangerMode: true,
    })
      .then(willDelete => {
        if (willDelete) {
          db.get('savedContracts').remove({ hash }).write()
          swal('Deleted!', 'Your contract has been deleted!', 'success')
          this.forceUpdate()
        }
      })
  }

  render() {
    const listOfContracts = contractList.value()
    const savedContracts = listOfContracts.map((contract, index) => {
      const address = truncateString(contract.address)
      const hash = truncateString(contract.hash)

      return (
        [
          <tr key={contract.hash}>
            <td className="text">{contract.name}</td>
            <CopyableTableCell string={contract.hash} />
            <CopyableTableCell string={contract.address} />
            <td className="align-right">
              <Link className="button small margin-right" to={`/run-contract/${contract.address}`} >Run</Link>
              <a className="button small alert" onClick={() => { this.onDeleteClicked(contract.hash) }}>Delete</a>
            </td>
          </tr>,
          <tr className="separator" />
        ]
      )
    })

    return (
      <Layout className="saved-contracts">
        <Flexbox flexDirection="column" className="saved-contracts-container">

          <Flexbox flexDirection="column" className="page-title">
            <h1>Saved Contracts</h1>
            <h3>
              Saved contracts, are like your contract address book.
              <br />
              They get saved on your local machine, so you can re-activate them even after they have left the Active Contract Set.
            </h3>
          </Flexbox>


          <Flexbox className="contracts-list" flexGrow={1}>
            <table>
              <thead>
                <tr>
                  <th>Contract Name</th>
                  <th>Hash</th>
                  <th>Address</th>
                  <th className="align-right">Actions</th>
                </tr>
                <tr className="separator" />
              </thead>
              <tbody>
                {savedContracts}
              </tbody>
            </table>
          </Flexbox>

        </Flexbox>
      </Layout>
    )
  }
}

export default SavedContracts