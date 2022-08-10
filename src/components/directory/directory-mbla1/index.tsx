import React, { useEffect, useState } from 'react';
import './style.css';
import { Table } from 'antd';

const columns = [
  {
    title: 'id1',
    dataIndex: 'id1',
  },
  {
    title: 'type_la1',
    dataIndex: 'type_la1',
  },
  {
    title: 'full_id1',
    dataIndex: 'full_id1',
  },
  {
    title: 'owner_id1',
    dataIndex: 'owner_id1',
  },
  {
    title: 'typenagr1',
    dataIndex: 'typenagr1',
  },
  {
    title: 'compub1',
    dataIndex: 'compub1',
  },
  {
    title: 'compriv',
    dataIndex: 'compriv',
  },
];

interface JournalMBLA1Interface {
  id1: string,
  type_la1: string,
  full_id1: string,
  owner_id1: string,
  typenagr1: string,
  compub1: string,
  compriv: string,
}

function DirectoryMBLA1() {
  const [result, setResult] = useState<Array<JournalMBLA1Interface>>([
    {
      id1: 'loading...',
      type_la1: 'loading...',
      full_id1: 'loading...',
      owner_id1: 'loading...',
      typenagr1: 'loading...',
      compub1: 'loading...',
      compriv: 'loading...',
    },
  ]);

  useEffect(() => {
    fetch('https://prj.int-sys.net/_prj/mbla3/?route=Reference/Mbla1')
      .then((response) => response.json())
      .then((response) => setResult(response))
      .catch((error) => setResult(error));
  }, []);

  return <Table dataSource={result} columns={columns} style={{ padding: '0 24px' }} />;
}

export default DirectoryMBLA1;
