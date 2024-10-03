import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, Edit, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  fetchImages,
  addImage,
  updateImageOrder,
  deleteImage,
  updateImage,
} from "./imagesSlice";
import Navbar from "./Navbar";
import ProtectedRoute from "@/routes/ProtectedRoute";

function SortableImage({ image, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group touch-none"
    >
      <img
        src={image.image}
        alt={image.title}
        className="w-full h-48 object-cover rounded-lg"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(image);
          }}
          className="text-white mr-2"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(image.id);
          }}
          className="text-white"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <p className="mt-2 text-sm font-medium text-center">{image.title}</p>
    </div>
  );
}

export default function ImageGallery() {
  const dispatch = useDispatch();
  const images = useSelector((state) => state.images.items);
  const [editingImage, setEditingImage] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    dispatch(fetchImages());
  }, [dispatch]);

  const handleFileUpload = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        const formData = new FormData();
        formData.append("title", file.name);
        formData.append("image", file);
        formData.append("order", images.length);
        dispatch(addImage(formData));
      });
    },
    [dispatch, images.length]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileUpload,
    accept: "image/*",
    multiple: true,
  });

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = images.findIndex((item) => item.id === active.id);
      const newIndex = images.findIndex((item) => item.id === over?.id);

      const newImages = arrayMove(images, oldIndex, newIndex);
      dispatch(updateImageOrder({ id: active.id, order: newIndex }));
    }
  };

  const handleDelete = async (id) => {
    dispatch(deleteImage(id));
  };

  const handleEdit = (image) => {
    setEditingImage(image);
  };

  const handleSaveEdit = async (editedImage) => {
    const formData = new FormData();
    formData.append("title", editedImage.title);
    if (editedImage.newImage) {
      formData.append("image", editedImage.newImage);
    }
    dispatch(updateImage({ id: editedImage.id, formData }));
    setEditingImage(null);
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="container mx-auto p-4 pt-8">
        <div className="mb-4">
          <div {...getRootProps()} className="cursor-pointer">
            <Input {...getInputProps()} />
            <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="flex flex-col items-center">
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">
                  {isDragActive
                    ? "Drop the files here ..."
                    : "Drag 'n' drop some files here, or click to select files"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={images} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <SortableImage
                  key={image.id}
                  image={image}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <Dialog
          open={!!editingImage}
          onOpenChange={(open) => !open && setEditingImage(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Image</DialogTitle>
            </DialogHeader>
            {editingImage && (
              <div className="space-y-4">
                <img
                  src={editingImage.image}
                  alt={editingImage.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Input
                  type="text"
                  value={editingImage.title}
                  onChange={(e) =>
                    setEditingImage({ ...editingImage, title: e.target.value })
                  }
                  placeholder="Enter new title"
                />
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setEditingImage({
                        ...editingImage,
                        newImage: file,
                        image: URL.createObjectURL(file),
                      });
                    }
                  }}
                  accept="image/*"
                />
                <Button onClick={() => handleSaveEdit(editingImage)}>
                  Save Changes
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
