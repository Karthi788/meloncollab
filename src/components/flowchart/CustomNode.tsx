import React, { memo, useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const shapeStyles: Record<string, React.CSSProperties> = {
  process: {
    borderRadius: '4px',
  },
  decision: {
    transform: 'rotate(45deg)',
  },
  terminal: {
    borderRadius: '24px',
  },
  data: {
    transform: 'skew(-20deg)',
  },
  preparation: {
    clipPath: 'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)',
  },
  display: {
    borderRadius: '24px 24px 0 0',
  },
  connector: {
    borderRadius: '50%',
    width: '40px',
    height: '40px',
  },
};

const CustomNode = ({ data, isConnectable, selected }: NodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const inputRef = useRef<HTMLInputElement>(null);
  const nodeType = data.label.toLowerCase();
  
  const style = {
    ...shapeStyles[nodeType],
    backgroundColor: data.color || '#fff',
  };

  const labelStyle = nodeType === 'decision' ? { transform: 'rotate(-45deg)' } : {};

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      data.onChange?.(label);
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setLabel(data.label);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    data.onChange?.(label);
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div
        className={`px-4 py-2 shadow-md border-2 min-w-[100px] min-h-[50px] flex items-center justify-center
          ${selected ? 'border-blue-500' : 'border-gray-200'}`}
        style={style}
        onDoubleClick={handleDoubleClick}
      >
        <div style={labelStyle}>
          {isEditing ? (
            <input
              ref={inputRef}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              className="bg-transparent text-center outline-none w-full"
              style={{ ...labelStyle, transform: 'none' }}
            />
          ) : (
            <span className="select-none">{label}</span>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
      {nodeType === 'decision' && (
        <>
          <Handle
            type="source"
            position={Position.Left}
            id="decision"
            isConnectable={isConnectable}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="decision"
            isConnectable={isConnectable}
          />
        </>
      )}
    </>
  );
};

export default memo(CustomNode);