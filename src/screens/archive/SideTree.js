import React, { useState } from "react";
import { Tree } from "antd";
import { DownCircleFilled } from "@ant-design/icons";

const { DirectoryTree } = Tree;
const treeData = [
  {
    title: "وكالة التعمير والمشاريع بأمانة المنطقة الشرقية",
    key: "1",
    children: [
      {
        title: "الإدارة العامة لنظم المعلومات الجغرافية",
        key: "2",
        isLeaf: false,
        children: [
          {
            title: "الدمام",
            key: "3",
            isLeaf: false,
            children: [
              {
                title: "الملك فهد",
                key: "4",
                isLeaf: false,
                children: [
                  {
                    title: "مشروع حصر وتوثيق حاضرة الدمام والبلديات التابعة",
                    key: "5",
                    isLeaf: false,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
const SideTree = (props) => {
  const onExpand = (keys, info) => {
    // console.log("Trigger Expand", keys, info);
  };
  return (
    <DirectoryTree
      multiple
      defaultExpandAll
      onSelect={props.onSelectNode}
      onExpand={onExpand}
      treeData={treeData}
      switcherIcon={<DownCircleFilled />}
    />
  );
};
export default SideTree;
