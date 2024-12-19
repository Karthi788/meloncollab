import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import WhiteboardToolbar from './WhiteboardToolbar';
import useWhiteboardStore from './whiteboardStore';

const Whiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const { setCanvas, currentTool, currentColor, brushSize } = useWhiteboardStore();

  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: true,
        width: window.innerWidth - 100,
        height: window.innerHeight - 200,
        backgroundColor: '#ffffff',
      });

      fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
      fabricCanvas.freeDrawingBrush.color = currentColor;
      fabricCanvas.freeDrawingBrush.width = brushSize;

      fabricCanvasRef.current = fabricCanvas;
      setCanvas(fabricCanvas);

      // Handle window resize
      const handleResize = () => {
        fabricCanvas.setDimensions({
          width: window.innerWidth - 100,
          height: window.innerHeight - 200,
        });
      };
      window.addEventListener('resize', handleResize);

      // Handle keyboard shortcuts
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          const activeObjects = fabricCanvas.getActiveObjects();
          if (activeObjects.length > 0) {
            activeObjects.forEach((obj) => fabricCanvas.remove(obj));
            fabricCanvas.discardActiveObject();
            fabricCanvas.requestRenderAll();
          }
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('keydown', handleKeyDown);
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.dispose();
          fabricCanvasRef.current = null;
        }
      };
    }
  }, [setCanvas, currentColor, brushSize]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      canvas.isDrawingMode = currentTool === 'pen' || currentTool === 'eraser';
      canvas.selection = currentTool === 'select';
      
      if (currentTool === 'rectangle') {
        canvas.on('mouse:down', (options) => {
          const pointer = canvas.getPointer(options.e);
          const rect = new fabric.Rect({
            left: pointer.x,
            top: pointer.y,
            width: 0,
            height: 0,
            fill: 'transparent',
            stroke: currentColor,
            strokeWidth: brushSize,
          });
          canvas.add(rect);
          canvas.setActiveObject(rect);
        });
      }
      
      if (currentTool === 'circle') {
        canvas.on('mouse:down', (options) => {
          const pointer = canvas.getPointer(options.e);
          const circle = new fabric.Circle({
            left: pointer.x,
            top: pointer.y,
            radius: 0,
            fill: 'transparent',
            stroke: currentColor,
            strokeWidth: brushSize,
          });
          canvas.add(circle);
          canvas.setActiveObject(circle);
        });
      }
    }
  }, [currentTool, currentColor, brushSize]);

  return (
    <div className="relative h-full w-full bg-white">
      <WhiteboardToolbar />
      <div className="absolute inset-0 flex items-center justify-center">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default Whiteboard;