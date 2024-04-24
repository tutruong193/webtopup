import { Divider, Radio, Table } from 'antd';
import React, { useState } from 'react'

const TableComponent = (props) => {
  const { selectionType = 'checkbox', data: dataSource = [], columns = [], size = 5, onSelectChange } = props
  const [ids, setIds] = useState([])
  const handleSelectChange = (newSelectedRowKeys) => {
    setIds(newSelectedRowKeys);
    onSelectChange(newSelectedRowKeys); // Gọi prop callback để truyền danh sách ID đã chọn lên component cha
  };
  const rowSelection = {
    ids,
    onChange: handleSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_NONE,
    ]
  }
  return (
    <div>
      <Table
        rowSelection={{
          ...rowSelection,
        }}
        pagination={{ pageSize: size }}
        columns={columns}
        dataSource={dataSource}
        {...props}
      />
    </div>
  )
}

export default TableComponent
