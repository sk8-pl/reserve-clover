import React, { useEffect, useState } from 'react';
import './style.css';
import { Table } from 'antd';

const columns = [
  {
    title: 'id1',
    dataIndex: 'id1',
  },
  {
    title: 'inn1',
    dataIndex: 'inn1',
  },
  {
    title: 'name1',
    dataIndex: 'name1',
  },
  {
    title: 'address1',
    dataIndex: 'address1',
  },
  {
    title: 'ruk1',
    dataIndex: 'ruk1',
  },
  {
    title: 'disp1',
    dataIndex: 'disp1',
  },
  {
    title: 'schet1',
    dataIndex: 'schet1',
  },
  {
    title: 'komm1',
    dataIndex: 'komm1',
  },
  {
    title: 'komm_sys1',
    dataIndex: 'komm_sys1',
  },
];

interface JournalMBLA1Interface {
    id1: string,
    inn1: string,
    name1: string,
    address1: string,
    ruk1: string,
    disp1: string,
    schet1: string,
    komm1: string,
    komm_sys1: string,
}

function DirectoryCNTRAgents() {
  const [result, setResult] = useState<Array<JournalMBLA1Interface>>([
    {
      id1: 'loading',
      inn1: 'loading',
      name1: 'loading',
      address1: 'loading',
      ruk1: 'loading',
      disp1: 'loading',
      schet1: 'loading',
      komm1: 'loading',
      komm_sys1: 'loading',
    },
  ]);

  useEffect(() => {
    fetch('https://prj.int-sys.net/_prj/mbla3/?route=Reference/Kontr1')
      .then((response) => response.json())
      .then((response) => setResult(response))
      .catch((error) => setResult(error));
  }, []);

  return <Table dataSource={result} columns={columns} style={{ padding: '0 24px' }} />;
}

export default DirectoryCNTRAgents;
