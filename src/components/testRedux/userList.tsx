import { Button } from 'antd';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { pickPolygon } from '../../store/grab-polygon/grab-polygon';

function UserList() {
  const dispatch = useDispatch();
  const count = useSelector((state: RootState) => state.isGrab.value);

  return (
    <div>
      <h1>test redux v console</h1>
      <Button key="qwe" onClick={() => dispatch(pickPolygon(true))}>{`${count}`}</Button>
    </div>
  );
}

export default UserList;
