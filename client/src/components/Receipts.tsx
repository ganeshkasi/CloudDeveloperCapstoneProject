import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createReceipt, deleteReceipt, getReceipts, patchReceipt } from '../api/receipts-api'
import Auth from '../auth/Auth'
import { Receipt } from '../types/Receipt'

interface ReceiptsProps {
  auth: Auth
  history: History
}

interface ReceiptsState {
  receipts: Receipt[]
  newReceiptName: string
  newReceiptAmount: number
  loadingReceipts: boolean
}

export class Receipts extends React.PureComponent<ReceiptsProps, ReceiptsState> {
  state: ReceiptsState = {
    receipts: [],
    newReceiptName: '',
    newReceiptAmount: 0,
    loadingReceipts: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newReceiptName: event.target.value })
  }

  handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newReceiptAmount: parseInt(event.target.value) })
  }

  onEditButtonClick = (receiptId: string) => {
    this.props.history.push(`/receipts/${receiptId}/edit`)
  }

  onReceiptCreate = async () => {
    try {
      const newReceipt = await createReceipt(this.props.auth.getIdToken(), {
        name: this.state.newReceiptName,
        amount: this.state.newReceiptAmount
      })
      this.setState({
        receipts: [...this.state.receipts, newReceipt],
        newReceiptName: '',
        newReceiptAmount: 0
      })
    } catch {
      alert('Receipt creation failed')
    }
  }

  onReceiptDelete = async (receiptId: string) => {
    try {
      await deleteReceipt(this.props.auth.getIdToken(), receiptId)
      this.setState({
        receipts: this.state.receipts.filter(receipt => receipt.receiptId != receiptId)
      })
    } catch {
      alert('Receipt deletion failed')
    }
  }


  async componentDidMount() {
    try {
      const receipts = await getReceipts(this.props.auth.getIdToken())
      this.setState({
        receipts,
        loadingReceipts: false
      })
    } catch (e) {
      alert(`Failed to fetch receipts: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">RECEIPTS</Header>

        {this.renderCreateReceiptInput()}

        {this.renderReceipts()}
      </div>
    )
  }

  renderCreateReceiptInput() {
    return (
      <Grid.Row>
        {/* <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Receipt',
              onClick: this.onReceiptCreate
            }}
            fluid
            actionPosition="left"
            placeholder="add receipt name here..."
            onChange={this.handleNameChange}
          />
        </Grid.Column> */}
          <Grid.Column width={10} verticalAlign="middle">
            <input placeholder="add receipt name here..." onChange={this.handleNameChange} />
          </Grid.Column>
          <Grid.Column width={10} verticalAlign="middle">
            <input placeholder="add receipt amount here..." onChange={this.handleAmountChange} />
          </Grid.Column>

          <Grid.Column width={3} floated="right">
                <Button
                  icon
                  color="teal"
                  onClick={this.onReceiptCreate}
                >
                <Icon name="add" />
                New Receipt
                </Button>
              </Grid.Column>

        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderReceipts() {
    if (this.state.loadingReceipts) {
      return this.renderLoading()
    }

    return this.renderReceiptsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading RECEIPTS
        </Loader>
      </Grid.Row>
    )
  }

  renderReceiptsList() {
    return (
      <Grid padded>
        {this.state.receipts.map((receipt, pos) => {
          return (
            <Grid.Row key={receipt.receiptId}>
              <Grid.Column width={5} verticalAlign="middle" floated="left" >
                {receipt.name} 
              </Grid.Column>
              <Grid.Column width={5} verticalAlign="middle" floated="left">
                {receipt.amount}
              </Grid.Column>

              {receipt.attachmentUrl && (
                <Image src={receipt.attachmentUrl} size="small" wrapped />
              )}

              <Grid.Column width={1} verticalAlign="middle">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(receipt.receiptId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} verticalAlign="middle">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onReceiptDelete(receipt.receiptId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>

              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
