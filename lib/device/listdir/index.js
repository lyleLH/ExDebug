import React from 'react'
import FileColumn from './file-column'
import FileInfo from './file-info'
import IPC from '../../ipc-request'
import {message, Spin} from 'antd'

class File {
  constructor(fileInfo) {
    Object.assign(this, fileInfo)
  }

  addChildrenInfos(fileInfos) {
    this.children = []
    for (let fileInfo of fileInfos) {
      let file = new File(fileInfo)
      file.superDirectory = this
      this.children.push(file)
    }
  }

  getFullPath() {
    let dir = this.superDirectory.getFullPath() || ''
    dir = `${dir}/${this.name}`
    return dir
  }

  loadChildren() {
    return IPC.request({path:`listdir${this.getFullPath()}`}).then(fileInfos => {
      this.addChildrenInfos(fileInfos)
    })
  }
}

class RootFile extends File {
  constructor(p) {
    super(p)
    this.isDirectory = true
  }

  getFullPath() {
    return ''
  }
}

class Content extends React.Component {

  constructor() {
    super()
    this.onSelectFile = this.onSelectFile.bind(this)
    let rootDir = new RootFile()
    this.state = {
      loading: false,
      rootDir,
      selectedFile: rootDir
    }
    this.columnStyle = {
      width: 200,
      height: '100%',
      flexShrink: 0,
      float: 'left',
      overflowY: 'auto',
      overflowX: 'hidden'
    }
  }

  componentDidMount() {
    this.state.loading = true
    this.setSta
    this.state.rootDir.loadChildren().then(()=>{
      this.setState(this.state)
    }).catch(err=>message.error(err))
  }

  onSelectFile(file) {
    if (file.isDirectory) {
      file.loadChildren().then(()=>{
        this.state.selectedFile = file
        this.setState(this.state)
      }).catch(e=>message.error(e.message))
    }
    else {
      this.state.selectedFile = file
      this.setState(this.state)

      // IPC.file(file.getFullPath()).then(data => {
      //     console.log('data====> ', data.toString());
      // })
    }
  }

  componentDidUpdate() {
    this.refs.scrollContent.scrollLeft = this.refs.scrollContent.scrollWidth
  }

  generateFileColumn(file) {
    if (file) {
      let cmps = this.generateFileColumn(file.superDirectory)
      if (file.isDirectory) {
        cmps.push(
          <FileColumn files={file.children}
            onSelectFile={this.onSelectFile}
            style={this.columnStyle}
            key={file.name}/>
        )
      }
      else {
        cmps.push(
          <FileInfo style={this.columnStyle} key={file.name} file={file}/>
        )
      }
      return cmps
    }
    else {
      return []
    }
  }

  render() {
    return (
      <div ref='scrollContent' style={{
        width: '100%',
        height: '100%',
        overflowX: 'auto',
        overflowY: 'hidden'
      }}>
      <div
        style={{
          display: 'flex',
          flexFlow: 'row nowrap',
          flexShrink: 0,
          alignItems: 'stretch',
          height: '100%'
        }}>
        {this.generateFileColumn(this.state.selectedFile)}
      </div>
      </div>
    )
  }
}

export default Content
