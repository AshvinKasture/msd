import React from 'react';
import NodeItem from './NodeItem';

const Tree = ({ tree, rootTree = false }) => {
  return (
    <ul className={`border-l-2 ${rootTree ? 'border-t-2' : 'ml-5 mb-4'}`}>
      {tree.map((node) => {
        return <NodeItem key={node.text}>{node}</NodeItem>;
      })}
    </ul>
  );
};

export default Tree;
