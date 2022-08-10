import React, { useEffect, useState } from 'react';
import './style.css';
import { Table } from 'antd';

const columns = [
  {
    title: 'id1',
    dataIndex: 'id1',
  },
  {
    title: 'address1',
    dataIndex: 'address1',
  },
  {
    title: 'TypeURP1',
    dataIndex: 'TypeURP1',
  },
  {
    title: 'adr_admin1',
    dataIndex: 'adr_admin1',
  },
  {
    title: 'reg_time1',
    dataIndex: 'reg_time1',
  },
  {
    title: 'comment1',
    dataIndex: 'comment1',
  },
];

interface JournalMBLA1Interface {
  id1: string,
  address1: string,
  TypeURP1: string,
  adr_admin1: string,
  reg_time1: string,
  comment1: string
}

function DirectoryURP1() {
  const [result, setResult] = useState<Array<JournalMBLA1Interface>>([
    {
      id1: 'loading...',
      address1: 'loading...',
      TypeURP1: 'loading...',
      adr_admin1: 'loading...',
      reg_time1: 'loading...',
      comment1: 'loading...',
    },
  ]);

  useEffect(() => {
    fetch('https://prj.int-sys.net/_prj/mbla3/?route=Reference/Urp1')
      .then((response) => response.json())
      .then((response) => setResult(response))
      .catch((error) => setResult(error));
  }, []);

  return <Table dataSource={result} columns={columns} style={{ padding: '0 24px' }} />;
}

export default DirectoryURP1;
