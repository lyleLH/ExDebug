import CircleGraphComponent from './circle-graph'

class DataSizeComponent extends CircleGraphComponent {

  componentDidMount() {
    super.componentDidMount()
    this.setTitle('数据量分布 Mb')
    const {requests} = this.props
    if (requests) {
      let map = {}
      let sizeRange = [0.010, 0.100, 0.200, 0.500, 1.000, 2.000]
      for (var i = 0; i < requests.length; i++) {
        let req = requests[i]
        let size = (req.downloadByteCount + req.uploadByteCount)/1024/1024
        this.mapSizeInRange(map, size, sizeRange)
      }
      let data = this.dataFromMap(map)
      this.updateData(data)
    }
  }

}

export default DataSizeComponent
