import { create } from 'zustand';
import { fabric } from 'fabric';

interface WhiteboardStore {
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas) => void;
  currentTool: string;
  setCurrentTool: (tool: string) => void;
  currentColor: string;
  setCurrentColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  eraserSize: number;
  setEraserSize: (size: number) => void;
  textSize: number;
  setTextSize: (size: number) => void;
}

const useWhiteboardStore = create<WhiteboardStore>((set) => ({
  canvas: null,
  setCanvas: (canvas) => set({ canvas }),
  currentTool: 'pen',
  setCurrentTool: (tool) => set({ currentTool: tool }),
  currentColor: '#000000',
  setCurrentColor: (color) => set({ currentColor: color }),
  brushSize: 2,
  setBrushSize: (size) => set({ brushSize: size }),
  eraserSize: 20,
  setEraserSize: (size) => set({ eraserSize: size }),
  textSize: 20,
  setTextSize: (size) => set({ textSize: size }),
}));

export default useWhiteboardStore;