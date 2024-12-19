import { create } from 'zustand';
import {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
} from 'reactflow';

interface FlowchartState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  addNode: (type: string, color: string) => void;
  addEdge: (connection: Connection | Edge) => void;
  setSelectedNode: (node: Node | null) => void;
  deleteSelectedNode: () => void;
  duplicateSelectedNode: () => void;
  saveFlowchart: () => void;
  loadFlowchart: () => void;
  updateNodeLabel: (nodeId: string, label: string) => void;
}

export const useFlowchartStore = create<FlowchartState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  addNode: (type, color) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type: 'custom',
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: { 
        label: type.charAt(0).toUpperCase() + type.slice(1), 
        color,
        onChange: (newLabel: string) => {
          get().updateNodeLabel(newNode.id, newLabel);
        },
      },
    };

    set({
      nodes: [...get().nodes, newNode],
    });
  },

  updateNodeLabel: (nodeId, label) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, label } }
          : node
      ),
    });
  },

  addEdge: (connection) => {
    const newEdge = {
      ...connection,
      id: `edge-${Date.now()}`,
      animated: connection.sourceHandle === 'decision',
    };

    set({
      edges: [...get().edges, newEdge as Edge],
    });
  },

  setSelectedNode: (node) => {
    set({ selectedNode: node });
  },

  deleteSelectedNode: () => {
    const { selectedNode, nodes, edges } = get();
    if (!selectedNode) return;

    const newEdges = edges.filter(
      (edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id
    );
    const newNodes = nodes.filter((node) => node.id !== selectedNode.id);

    set({
      nodes: newNodes,
      edges: newEdges,
      selectedNode: null,
    });
  },

  duplicateSelectedNode: () => {
    const { selectedNode, nodes } = get();
    if (!selectedNode) return;

    const newNode = {
      ...selectedNode,
      id: `${selectedNode.id}-copy-${Date.now()}`,
      position: {
        x: selectedNode.position.x + 50,
        y: selectedNode.position.y + 50,
      },
      data: {
        ...selectedNode.data,
        onChange: (newLabel: string) => {
          get().updateNodeLabel(newNode.id, newLabel);
        },
      },
    };

    set({
      nodes: [...nodes, newNode],
    });
  },

  saveFlowchart: () => {
    const { nodes, edges } = get();
    const data = { nodes, edges };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flowchart.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  loadFlowchart: () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          const { nodes, edges } = JSON.parse(content);
          // Restore onChange handlers for nodes
          const nodesWithHandlers = nodes.map((node: Node) => ({
            ...node,
            data: {
              ...node.data,
              onChange: (newLabel: string) => {
                get().updateNodeLabel(node.id, newLabel);
              },
            },
          }));
          set({ nodes: nodesWithHandlers, edges });
        };
        reader.readAsText(file);
      }
    };
    input.click();
  },
}));