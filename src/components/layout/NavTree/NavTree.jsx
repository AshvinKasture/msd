import React from 'react';
import Tree from './Tree';

const NavTree = ({ navTree }) => {
  return (
    <div>
      <Tree tree={navTree} rootTree={true} />
    </div>
  );
};

export default NavTree;
