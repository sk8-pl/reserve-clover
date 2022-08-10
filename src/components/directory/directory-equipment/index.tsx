import React, { useEffect, useState } from 'react';
import './style.css';
import { Table } from 'antd';

const columns = [
  {
    title: 'id1',
    dataIndex: 'id1',
  },
  {
    title: 'name1',
    dataIndex: 'name1',
  },
  {
    title: 'type1',
    dataIndex: 'type1',
  },
  {
    title: 'massa1',
    dataIndex: 'massa1',
  },
  {
    title: 'param1',
    dataIndex: 'param1',
  },
];

interface JournalMBLA1Interface {
  id1: number,
  name1: string,
  type1: number,
  massa1: number,
  param1: string,
}

function DirectoryEquipment() {
  const [result, setResult] = useState<Array<JournalMBLA1Interface>>([
    {
      id1: 0,
      name1: 'loading',
      type1: 0,
      massa1: 0,
      param1: 'loading',
    },
  ]);

  useEffect(() => {
    fetch('https://prj.int-sys.net/_prj/mbla3/?route=Reference/dop1')
      .then((response) => response.json())
      .then((response) => setResult(response))
      .catch((error) => setResult(error));
  }, []);

  return <Table dataSource={result} columns={columns} style={{ padding: '0 24px' }} />;
}

export default DirectoryEquipment;
