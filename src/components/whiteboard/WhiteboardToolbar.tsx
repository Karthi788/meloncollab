import React, { useState } from 'react';
import { 
  PenTool, 
  Eraser, 
  Type,
  Trash2,
  ArrowLeft,
  Camera,
  Minus,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useWhiteboardStore from './whiteboardStore';
import ColorPicker from './ColorPicker';
import SizeSlider from './SizeSlider';

const WhiteboardToolbar: React.FC = () => {
  const navigate = useNavigate();
  const { 
    canvas, 
    setCurrentTool, 
    currentTool, 
    currentColor, 
    setCurrentColor,
    brushSize,
    setBrushSize,
    textSize,
    setTextSize,
    eraserSize,
    setEraserSize
  } = useWhiteboardStore();

  const handleToolChange = (tool: string) => {
    setCurrentTool(tool);
    if (canvas) {
      canvas.isDrawingMode = tool === 'pen';
      if (tool === 'pen') {
        canvas.freeDrawingBrush.color = currentColor;
        canvas.freeDrawingBrush.width = brushSize;
      } else if (tool === 'eraser') {
        canvas.freeDrawingBrush.color = '#ffffff';
        canvas.freeDrawingBrush.width = eraserSize;
      }
    }
  };

  const handleAddText = () => {
    if (canvas) {
      const text = new fabric.IText('Double click to edit', {
        left: 100,
        top: 100,
        fontFamily: 'Arial',
        fontSize: textSize,
        fill: currentColor
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
    }
  };

  const handleScreenshot = () => {
    if (canvas) {
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1
      });
      const link = document.createElement('a');
      link.download = `whiteboard-${new Date().toISOString()}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getCurrentSize = () => {
    switch (currentTool) {
      case 'pen':
        return brushSize;
      case 'eraser':
        return eraserSize;
      case 'text':
        return textSize;
      default:
        return brushSize;
    }
  };

  const handleSizeChange = (size: number) => {
    switch (currentTool) {
      case 'pen':
        setBrushSize(size);
        if (canvas && canvas.isDrawingMode) {
          canvas.freeDrawingBrush.width = size;
        }
        break;
      case 'eraser':
        setEraserSize(size);
        if (canvas && canvas.isDrawingMode) {
          canvas.freeDrawingBrush.width = size;
        }
        break;
      case 'text':
        setTextSize(size);
        break;
    }
  };

  return (
    <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4 space-y-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="p-2 rounded-md hover:bg-gray-100 w-full flex items-center gap-2"
        title="Back"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="space-y-4">
        {/* Tools */}
        <div className="flex gap-2">
          <button
            onClick={() => handleToolChange('pen')}
            className={`p-2 rounded-md ${currentTool === 'pen' ? 'bg-indigo-100' : 'hover:bg-gray-100'}`}
            title="Pen Tool"
          >
            <PenTool className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleToolChange('eraser')}
            className={`p-2 rounded-md ${currentTool === 'eraser' ? 'bg-indigo-100' : 'hover:bg-gray-100'}`}
            title="Eraser"
          >
            <Eraser className="w-6 h-6" />
          </button>
          <button
            onClick={() => {
              handleToolChange('text');
              handleAddText();
            }}
            className={`p-2 rounded-md ${currentTool === 'text' ? 'bg-indigo-100' : 'hover:bg-gray-100'}`}
            title="Add Text"
          >
            <Type className="w-6 h-6" />
          </button>
        </div>

        {/* Color Picker */}
        <ColorPicker
          currentColor={currentColor}
          onChange={setCurrentColor}
        />

        {/* Size Slider */}
        <SizeSlider
          value={getCurrentSize()}
          onChange={handleSizeChange}
          min={1}
          max={currentTool === 'eraser' ? 50 : 72}
          label={`${currentTool === 'text' ? 'Font' : currentTool === 'eraser' ? 'Eraser' : 'Brush'} Size`}
        />

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleScreenshot}
            className="p-2 rounded-md hover:bg-gray-100"
            title="Take Screenshot"
          >
            <Camera className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhiteboardToolbar;