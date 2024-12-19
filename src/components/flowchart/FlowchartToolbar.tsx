import React from 'react';
import {
  Square,
  Circle,
  Diamond,
  Hexagon,
  Triangle,
  Type,
  Database,
  ArrowRight,
  Trash2,
  Copy,
  Save,
  FileInput,
} from 'lucide-react';
import { useFlowchartStore } from '../../store/flowchartStore';

const FlowchartToolbar: React.FC = () => {
  const { addNode, deleteSelectedNode, duplicateSelectedNode, selectedNode } = useFlowchartStore();

  const shapes = [
    { icon: Square, type: 'process', label: 'Process', color: '#a5d8ff' },
    { icon: Diamond, type: 'decision', label: 'Decision', color: '#ffd8a8' },
    { icon: Circle, type: 'terminal', label: 'Terminal', color: '#b2f2bb' },
    { icon: Database, type: 'data', label: 'Data', color: '#fcc2d7' },
    { icon: Hexagon, type: 'preparation', label: 'Preparation', color: '#d8f5a2' },
    { icon: Type, type: 'display', label: 'Display', color: '#b197fc' },
    { icon: ArrowRight, type: 'connector', label: 'Connector', color: '#99e9f2' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {shapes.map(({ icon: Icon, type, label, color }) => (
          <button
            key={type}
            onClick={() => addNode(type, color)}
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md w-full"
            title={label}
          >
            <Icon className="w-5 h-5" style={{ color }} />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="grid grid-cols-2 gap-2">
          {selectedNode && (
            <>
              <button
                onClick={deleteSelectedNode}
                className="flex items-center space-x-2 p-2 hover:bg-red-50 text-red-600 rounded-md"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
                <span className="text-sm">Delete</span>
              </button>
              <button
                onClick={duplicateSelectedNode}
                className="flex items-center space-x-2 p-2 hover:bg-blue-50 text-blue-600 rounded-md"
                title="Duplicate"
              >
                <Copy className="w-5 h-5" />
                <span className="text-sm">Duplicate</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => useFlowchartStore.getState().saveFlowchart()}
            className="flex items-center space-x-2 p-2 hover:bg-green-50 text-green-600 rounded-md"
            title="Save"
          >
            <Save className="w-5 h-5" />
            <span className="text-sm">Save</span>
          </button>
          <button
            onClick={() => useFlowchartStore.getState().loadFlowchart()}
            className="flex items-center space-x-2 p-2 hover:bg-purple-50 text-purple-600 rounded-md"
            title="Load"
          >
            <FileInput className="w-5 h-5" />
            <span className="text-sm">Load</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlowchartToolbar;