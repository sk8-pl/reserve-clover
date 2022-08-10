import React from 'react';
import { Route, Routes } from 'react-router';
import { Empty } from 'antd';
import FlyMission from '../../components/fly-mission-directory/fly-mission';
import DirectoryCNTRAgents from '../../components/directory/directory-contragents';
import DirectoryURP1 from '../../components/directory/directory-urp1';
import DirectoryMBLA1 from '../../components/directory/directory-mbla1';
import DirectoryEquipment from '../../components/directory/directory-equipment';
import OpenFlyMission from '../../components/fly-mission-directory/open-fly-mission';
import HomePage from '../../components/home-page';

function RoutesContent() {
  return (
    <Routes>
      <Route path="*" element={<HomePage />} />
      <Route path="/_prj/mbla3" element={<HomePage />} />
      <Route path="/1" element={<FlyMission />} />
      <Route path="/2" element={<Empty />} />
      <Route path="/3" element={<OpenFlyMission />} />
      <Route path="/4" element={<Empty />} />
      <Route path="/5" element={<Empty />} />
      <Route path="/6" element={<OpenFlyMission />} />
      <Route path="/7" element={<Empty />} />
      <Route path="/8" element={<Empty />} />
      <Route path="/9" element={<DirectoryCNTRAgents />} />
      <Route path="/10" element={<DirectoryURP1 />} />
      <Route path="/11" element={<DirectoryMBLA1 />} />
      <Route path="/12" element={<DirectoryEquipment />} />
      <Route path="/13" element={<Empty />} />
      <Route path="/14" element={<Empty />} />
      <Route path="/15" element={<Empty />} />
      <Route path="/16" element={<Empty />} />
      <Route path="/17" element={<Empty />} />
      <Route path="/18" element={<Empty />} />
      <Route path="/19" element={<Empty />} />
      <Route path="/20" element={<Empty />} />

    </Routes>
  );
}

export default RoutesContent;
