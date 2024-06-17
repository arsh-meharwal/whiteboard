// src/components/Whiteboard.tsx
import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import {
  Brush,
  Circle,
  Eraser,
  FileImage,
  Images,
  Minus,
  Square,
  Trash2,
  Triangle,
  Type,
} from "lucide-react";

const Whiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [color, setColor] = useState("black");
  const [imgModal, setImgModal] = useState(false);
  const [brushWidth, setBrushWidth] = useState(5);
  const [isDrawingMode, setIsDrawingMode] = useState(true);
  const [isEraserMode, setIsEraserMode] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current);
    setFabricCanvas(canvas);

    const resizeCanvas = () => {
      if (canvasRef.current) {
        const { innerWidth, innerHeight } = window;
        canvasRef.current.width = innerWidth;
        canvasRef.current.height = innerHeight;
        canvas.setWidth(innerWidth);
        canvas.setHeight(innerHeight);
        canvas.renderAll();
      }
    };

    canvas.setBackgroundColor("white", canvas.renderAll.bind(canvas));
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.color = color;
    canvas.freeDrawingBrush.width = brushWidth;

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Zoom functionality with mouse wheel
    canvas.on("mouse:wheel", function (opt) {
      var delta = opt.e.deltaY;
      var zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    // Clean up on component unmount
    return () => {
      window.removeEventListener("resize", resizeCanvas);

      canvas.dispose();
    };
  }, []);

  const showImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    setImgModal(!imgModal);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
    if (fabricCanvas) {
      fabricCanvas.freeDrawingBrush.color = e.target.value;
    }
  };

  const handleBrushWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(e.target.value, 10);
    setBrushWidth(width);
    if (fabricCanvas) {
      fabricCanvas.freeDrawingBrush.width = width;
    }
  };

  const addText = () => {
    if (fabricCanvas) {
      fabricCanvas.isDrawingMode = false;
      const text = new fabric.IText("Type something", {
        left: 100,
        top: 400,
        fill: color,
        fontSize: 20,
        editable: true,
      });
      fabricCanvas.add(text);
      fabricCanvas.setActiveObject(text);
    }
  };

  const addRectangle = () => {
    if (fabricCanvas) {
      fabricCanvas.isDrawingMode = false;
      const rect = new fabric.Rect({
        left: 50,
        top: 50,
        fill: color,
        width: 100,
        height: 100,
        selectable: true,
      });
      fabricCanvas.add(rect);
      fabricCanvas.setActiveObject(rect);
    }
  };

  const addCircle = () => {
    if (fabricCanvas) {
      fabricCanvas.isDrawingMode = false;
      const circle = new fabric.Circle({
        left: 50,
        top: 50,
        fill: color,
        radius: 50,
        selectable: true,
      });
      fabricCanvas.add(circle);
      fabricCanvas.setActiveObject(circle);
    }
  };

  const addTriangle = () => {
    if (fabricCanvas) {
      fabricCanvas.isDrawingMode = false;
      const triangle = new fabric.Triangle({
        left: 50,
        top: 50,
        fill: color,
        width: 100,
        height: 100,
        selectable: true,
      });
      fabricCanvas.add(triangle);
      fabricCanvas.setActiveObject(triangle);
    }
  };

  const addLine = () => {
    if (fabricCanvas) {
      fabricCanvas.isDrawingMode = false;
      const line = new fabric.Line([50, 50, 200, 200], {
        left: 50,
        top: 50,
        stroke: color,
        strokeWidth: brushWidth,
        selectable: true,
      });
      fabricCanvas.add(line);
      fabricCanvas.setActiveObject(line);
    }
  };

  const addPolygon = () => {
    if (fabricCanvas) {
      fabricCanvas.isDrawingMode = false;
      const points = [
        { x: 50, y: 0 },
        { x: 100, y: 50 },
        { x: 50, y: 100 },
        { x: 0, y: 50 },
      ];
      const polygon = new fabric.Polygon(points, {
        left: 50,
        top: 50,
        fill: color,
        selectable: true,
      });
      fabricCanvas.add(polygon);
      fabricCanvas.setActiveObject(polygon);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (fabricCanvas && e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgElement = new Image();
        imgElement.src = event.target?.result as string;
        imgElement.onload = () => {
          const imgInstance = new fabric.Image(imgElement, {
            left: 50,
            top: 50,
            scaleX: 0.5,
            scaleY: 0.5,
            selectable: true,
          });
          fabricCanvas.add(imgInstance);
          fabricCanvas.setActiveObject(imgInstance);
        };
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const toggleDrawingMode = () => {
    if (fabricCanvas) {
      const newDrawingMode = !isDrawingMode;
      setIsDrawingMode(newDrawingMode);
      setIsEraserMode(false);
      fabricCanvas.isDrawingMode = newDrawingMode;
      fabricCanvas.freeDrawingBrush.color = color;
    }
  };

  const deleteSelected = () => {
    if (fabricCanvas) {
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject) {
        fabricCanvas.remove(activeObject);
      }
    }
  };

  const toggleEraserMode = () => {
    if (fabricCanvas) {
      const newEraserMode = !isEraserMode;
      setIsEraserMode(newEraserMode);
      setIsDrawingMode(newEraserMode);
      fabricCanvas.isDrawingMode = newEraserMode;
      if (newEraserMode) {
        fabricCanvas.freeDrawingBrush.color = "white"; // Simulate eraser with white color
      } else {
        fabricCanvas.freeDrawingBrush.color = color;
      }
    }
  };

  return (
    <div>
      <div className=" absolute flex flex-row">
        <div className=" flex flex-col px-4 z-50 border-2 w-28 max-sm:h-1/4">
          <label className="block mb-2 ">
            Color :
            <input
              type="color"
              value={color}
              onChange={handleColorChange}
              className="ml-2 rounded-lg"
            />
          </label>
          <label className="block mb-2">
            Width :
            <div className="flex flex-col items-start">
              <input
                type="range"
                min="1"
                max="10"
                value={brushWidth}
                onChange={handleBrushWidthChange}
                className="mt-2 w-full"
              />
            </div>
          </label>

          <button
            onClick={toggleDrawingMode}
            className="px-4 py-2 bg-blue-500 text-white mb-2 rounded-lg"
          >
            {isDrawingMode && !isEraserMode ? (
              <Brush color="black" />
            ) : (
              <Brush size={30} />
            )}
          </button>
          <button
            onClick={addText}
            className="px-4 py-2 bg-blue-500 text-white rounded mb-2"
          >
            <Type color="#ffffff" />
          </button>
          <button
            onClick={addRectangle}
            className="px-4 py-2 bg-blue-500 text-white rounded mb-2"
          >
            <Square color="#ffffff" />
          </button>
          <button
            onClick={addCircle}
            className="px-4 py-2 bg-blue-500 text-white rounded mb-2"
          >
            <Circle color="#ffffff" />
          </button>
          <button
            onClick={addTriangle}
            className="px-4 py-2 bg-blue-500 text-white rounded mb-2"
          >
            <Triangle color="#ffffff" />
          </button>
          <button
            onClick={addLine}
            className="px-4 py-2 bg-blue-500 text-white rounded mb-2"
          >
            <Minus color="#ffffff" />
          </button>
          <button
            onClick={showImage}
            className="px-4 py-2 bg-blue-500 text-white rounded mb-2"
          >
            {imgModal ? (
              <>
                <Images color="black" />
              </>
            ) : (
              <>
                <Images color="#ffffff" />
              </>
            )}
          </button>
          {imgModal && (
            <div className="my-4">
              <input
                type="file"
                onChange={handleImageUpload}
                className="block mb-2 w-30"
              />
            </div>
          )}
          <button
            onClick={deleteSelected}
            className="px-4 py-2 bg-red-500 text-white rounded mb-2"
          >
            <Trash2 color="#ffffff" />
          </button>
          <button
            onClick={toggleEraserMode}
            className="px-4 py-2 bg-red-500 text-white rounded mb-2"
          >
            {isEraserMode ? (
              <Eraser color="black" />
            ) : (
              <Eraser color="#ffffff" />
            )}
          </button>
        </div>
        <div className="flex">
          {imgModal && (
            <div className="my-4">
              <input
                type="file"
                onChange={handleImageUpload}
                className="block mb-2 w-30"
              />
            </div>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} className="fixed top-0 left-0 " />
    </div>
  );
};

export default Whiteboard;
