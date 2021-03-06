import React from 'react'
import {Card, Icon, Modal} from 'antd'

export default class Device extends React.Component {

  constructor() {
    super()
    this.state = {visible: false}
    this.showModal = this.showModal.bind(this)
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  showModal() {
    this.setState({
      visible: true,
    });
  }
  handleOk() {
    this.setState({
      visible: false,
    });
  }
  handleCancel(e) {
    this.setState({
      visible: false,
    });
  }

  render() {
    const {device, onDoubleClick} = this.props
    return (
      <Card title={device.deviceModel}
        extra={
          <div style={{fontSize: '15px'}}>
            <Icon type="exclamation-circle"
              style={device.connected ? {color: 'green'} : {}} />
            <a href="#" style={{marginLeft: '5px'}} onClick={this.showModal}>详情</a>
            <Modal title="详细信息"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}>
              <span style={{whiteSpace: 'pre-wrap'}}>
                {JSON.stringify(device, null, 4)}
              </span>
            </Modal>
          </div>
        }
        style={{
          width: 300,
          margin: 10,
          float: 'left',
          backgroundColor: device.connected ? 'rgba(139, 195, 74, 0.5)' : 'white'
        }}
        onDoubleClick={onDoubleClick}>
        <p>{`${device.os} ${device.osVersion}`}</p>
        <p>{`Build: ${device.buildNumber}`}</p>
        <p>{`App Ver: ${device.appVersion}`}</p>
        <p>{`Protocol Ver: ${device.protocolVersion}`}</p>
        <p>{device.resolution}</p>
      </Card>
    )
  }
}
