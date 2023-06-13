import { useState } from "react";
import Categories from "./Categories";
import { FoodItems } from "./FoodItems";
import { Stack } from "@mui/material";

export const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("Dessert");

  return (
    <Stack spacing={{ xs: 1, sm: 2 }} direction="row" justifyContent="center">
      <Categories
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <FoodItems selectedCategory={selectedCategory} />
    </Stack>
  );
};
