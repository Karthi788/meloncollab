import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import FlowchartToolbar from './FlowchartToolbar';
import CustomNode from './CustomNode';
import { useFlowchartStore } from '../../store/flowchartStore';

const nodeTypes = {
  custom: CustomNode,
};

const FlowchartEditor: React.FC = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    setSelectedNode,
  } = useFlowchartStore();

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      useFlowchartStore.getState().addEdge(params);
    },
    []
  );

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-left">
          <FlowchartToolbar />
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default FlowchartEditor;