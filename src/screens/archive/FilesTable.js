import React from "react";
import { Button, Space, Table } from "antd";
import { useState } from "react";
import TableModal from "./TableModal";

export default function FilesTable(props) {
  const [modalShow, setModalShow] = useState(null);
  const openModal = (id) => {
    setModalShow(id);
  };
  const closeModal = () => {
    setModalShow(null);
  };
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  const columns = [
    {
      title: "اسم الملف",
      dataIndex: "name",
      sorter: {
        compare: (a, b) => a.name - b.name,
        // multiple: 3,
      },
    },
    {
      title: "التاريخ",
      dataIndex: "date",
      sorter: {
        compare: (a, b) => a.date - b.date,
        multiple: 3,
      },
    },
    {
      title: "نوع الملف",
      dataIndex: "type",
      sorter: {
        compare: (a, b) => a.type - b.type,
        multiple: 2,
      },
    },
    {
      title: "الحجم",
      dataIndex: "size",
      sorter: {
        compare: (a, b) => a.size - b.size,
        multiple: 1,
      },
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {console.log(record)} <Button className="tableBtn">تحميل</Button>
          <Button
            onClick={() => openModal(record.key)}
            id={record.key}
            className="tableBtn">
            فتح
          </Button>
          <TableModal
            modalShow={modalShow}
            rowID={record.key}
            openModal={openModal}
            closeModal={closeModal}
          />
        </Space>
      ),
    },
  ];
  const data = [
    {
      key: "1",
      name: "ملف رقم 412/42",
      size: "50 MB",
      type: "png",
      date: "1438/05/8",
    },
    {
      key: "2",
      name: "ملف رقم 412/43",
      size: "98 KBS",
      type: "png",
      date: "1438/07/10",
    },
  ];
  return (
    <div>
      {console.log(props.selectedNode)}
      <Table columns={columns} dataSource={data} onChange={onChange} />
    </div>
  );
}
