import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import user_api from "@/api/UserApi";

export const fetchImages = createAsyncThunk("images/fetchImages", async () => {
  const response = await user_api.get("/api/images/");
  return response.data;
});

export const addImage = createAsyncThunk(
  "images/addImage",
  async (formData) => {
    const response = await user_api.post("/api/images/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
);

export const updateImageOrder = createAsyncThunk(
  "images/updateImageOrder",
  async ({ id, order }) => {
    const response = await user_api.patch(`/api/images/${id}/`, {
      order,
    });
    return response.data;
  }
);

export const deleteImage = createAsyncThunk(
  "images/deleteImage",
  async (id) => {
    await user_api.delete(`/api/images/${id}/`);
    return id;
  }
);

export const updateImage = createAsyncThunk(
  "images/updateImage",
  async ({ id, formData }) => {
    const response = await user_api.patch(`/api/images/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
);

const imagesSlice = createSlice({
  name: "images",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchImages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addImage.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Optimistic update on updateImageOrder.pending
      .addCase(updateImageOrder.pending, (state, action) => {
        const { id, order: newOrder } = action.meta.arg;
        const existingImage = state.items.find((image) => image.id === id);

        if (existingImage) {
          const currentOrder = existingImage.order;

          state.previousItems = [...state.items];

          if (newOrder !== currentOrder) {
            if (newOrder > currentOrder) {
              state.items.forEach((image) => {
                if (image.order > currentOrder && image.order <= newOrder) {
                  image.order -= 1;
                }
              });
            } else {
              state.items.forEach((image) => {
                if (image.order >= newOrder && image.order < currentOrder) {
                  image.order += 1;
                }
              });
            }

            existingImage.order = newOrder;

            state.items.sort((a, b) => a.order - b.order);
          }
        }
      })
      .addCase(updateImageOrder.fulfilled, (state, action) => {
        const { id, order: newOrder } = action.payload;

        const existingImage = state.items.find((image) => image.id === id);
        if (existingImage) {
          const currentOrder = existingImage.order;

          if (newOrder !== currentOrder) {
            if (newOrder > currentOrder) {
              state.items.forEach((image) => {
                if (image.order > currentOrder && image.order <= newOrder) {
                  image.order -= 1;
                }
              });
            } else {
              state.items.forEach((image) => {
                if (image.order >= newOrder && image.order < currentOrder) {
                  image.order += 1;
                }
              });
            }

            existingImage.order = newOrder;

            state.items.sort((a, b) => a.order - b.order);
          }
        }
      })
      .addCase(updateImageOrder.rejected, (state, action) => {
        // On failure, revert the items to the previous state
        state.error = action.error.message;
        state.items = state.previousItems;
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(updateImage.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default imagesSlice.reducer;
